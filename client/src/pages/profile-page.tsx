import { useQuery } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import StatsDisplay from "@/components/stats-display";
import { Link } from "wouter";
import { ArrowLeft, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSwitch } from "@/components/theme-switch";
import { motion } from "framer-motion";
import { UserNav } from "@/components/user-nav";
import { AvatarUpload } from "@/components/avatar-upload";

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const completedTasks = tasks.filter((task) => task.completed);
  const recentCompletedTasks = completedTasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад к задачам
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeSwitch />
            <UserNav />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-8"
        >
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <User className="h-6 w-6" />
                Профиль пользователя
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <AvatarUpload currentAvatar={user?.avatar} username={user?.username || ""} />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Имя пользователя</p>
                    <p className="font-medium">{user?.username}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              id="stats"
            >
              <StatsDisplay stats={stats} />
            </motion.div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Недавно выполненные задачи</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCompletedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div>
                      <h3 className="font-medium line-through opacity-75">
                        {task.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Выполнено {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {recentCompletedTasks.length === 0 && (
                  <p className="text-muted-foreground">Нет выполненных задач</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}