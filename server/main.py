import os
from datetime import datetime, timedelta
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from . import models, database, auth
from fastapi.security import OAuth2PasswordRequestForm
import psycopg2
from psycopg2.extras import RealDictCursor

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Создаем директорию для загрузки файлов
os.makedirs("uploads/avatars", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Auth routes
@app.post("/api/register")
async def register(
    user: models.UserCreate,
    db: Session = Depends(database.get_db)
):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/api/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = auth.create_access_token(
        data={"sub": user.username}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/user")
async def read_users_me(
    current_user: models.User = Depends(auth.get_current_active_user)
):
    return current_user

# Avatar routes с использованием psycopg2
@app.post("/api/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    file_path = f"uploads/avatars/{current_user.id}_{file.filename}"
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    # Используем psycopg2 для обновления аватара
    with database.get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE users SET avatar = %s WHERE id = %s RETURNING *",
                (f"/{file_path}", current_user.id)
            )
            user = cur.fetchone()
            conn.commit()

    return {"avatar_url": user["avatar"]}

# Task routes с использованием и SQLAlchemy, и psycopg2
@app.get("/api/tasks")
async def get_tasks(
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # Используем psycopg2 для получения задач
    with database.get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT * FROM tasks WHERE user_id = %s ORDER BY created_at DESC",
                (current_user.id,)
            )
            tasks = cur.fetchall()
    return tasks

@app.post("/api/tasks")
async def create_task(
    task: models.TaskCreate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(database.get_db)
):
    db_task = models.Task(**task.dict(), user_id=current_user.id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.patch("/api/tasks/{task_id}")
async def update_task(
    task_id: int,
    task_update: models.TaskUpdate,
    current_user: models.User = Depends(auth.get_current_active_user)
):
    with database.get_db_connection() as conn:
        with conn.cursor() as cur:
            # Проверяем существование и владение задачей
            cur.execute(
                "SELECT * FROM tasks WHERE id = %s AND user_id = %s",
                (task_id, current_user.id)
            )
            task = cur.fetchone()

            if not task:
                raise HTTPException(status_code=404, detail="Task not found")

            # Формируем SQL для обновления
            update_fields = {k: v for k, v in task_update.dict(exclude_unset=True).items()}
            if not update_fields:
                return task

            set_clause = ", ".join(f"{k} = %s" for k in update_fields.keys())
            values = list(update_fields.values())
            values.extend([task_id, current_user.id])

            cur.execute(
                f"UPDATE tasks SET {set_clause} WHERE id = %s AND user_id = %s RETURNING *",
                values
            )
            updated_task = cur.fetchone()
            conn.commit()

            return updated_task

@app.delete("/api/tasks/{task_id}")
async def delete_task(
    task_id: int,
    current_user: models.User = Depends(auth.get_current_active_user)
):
    with database.get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM tasks WHERE id = %s AND user_id = %s RETURNING id",
                (task_id, current_user.id)
            )
            deleted = cur.fetchone()
            conn.commit()

            if not deleted:
                raise HTTPException(status_code=404, detail="Task not found")

            return {"ok": True}

@app.get("/api/stats")
async def get_stats(
    current_user: models.User = Depends(auth.get_current_active_user)
):
    with database.get_db_connection() as conn:
        with conn.cursor() as cur:
            # Получаем статистику одним SQL запросом
            cur.execute("""
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN completed THEN 1 ELSE 0 END) as completed,
                    SUM(CASE WHEN NOT completed THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN NOT completed AND deadline < NOW() THEN 1 ELSE 0 END) as overdue
                FROM tasks 
                WHERE user_id = %s
            """, (current_user.id,))
            stats = cur.fetchone()

            return {
                "total": stats["total"] or 0,
                "completed": stats["completed"] or 0,
                "pending": stats["pending"] or 0,
                "overdue": stats["overdue"] or 0
            }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "5000"))
    uvicorn.run(app, host="0.0.0.0", port=port)