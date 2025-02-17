import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertTaskSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import express from 'express';

// Настройка multer для загрузки файлов
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  storage: multer.diskStorage({
    destination: "./uploads/avatars",
    filename: (_req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  }),
});

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Ensure uploads directory exists
  fs.mkdir("./uploads/avatars", { recursive: true }).catch(console.error);

  // Avatar route
  app.post("/api/avatar", upload.single("avatar"), async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const user = await storage.updateUser(req.user.id, {
      avatar: `/uploads/avatars/${req.file.filename}`,
    });

    res.json(user);
  });

  // Serve uploaded files
  app.use("/uploads", express.static("uploads"));

  // Task routes
  app.get("/api/tasks", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const tasks = await storage.getTasksByUserId(req.user.id);
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const task = await storage.createTask({
      ...parsed.data,
      userId: req.user.id,
    });
    res.status(201).json(task);
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const taskId = parseInt(req.params.id);
    const task = await storage.getTask(taskId);

    if (!task) return res.sendStatus(404);
    if (task.userId !== req.user.id) return res.sendStatus(403);

    const data = req.body;
    if (data.deadline) {
      data.deadline = new Date(data.deadline);
    }
    const updatedTask = await storage.updateTask(taskId, data);
    res.json(updatedTask);
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const taskId = parseInt(req.params.id);
    const task = await storage.getTask(taskId);

    if (!task) return res.sendStatus(404);
    if (task.userId !== req.user.id) return res.sendStatus(403);

    await storage.deleteTask(taskId);
    res.sendStatus(204);
  });

  app.get("/api/stats", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const stats = await storage.getUserStats(req.user.id);
    res.json(stats);
  });

  const httpServer = createServer(app);
  return httpServer;
}