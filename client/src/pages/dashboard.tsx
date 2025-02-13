import { useQuery } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import StatsDisplay from "@/components/stats-display";
import { Link } from "wouter";
import { ArrowLeft, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ThemeSwitch } from "@/components/theme-switch";

export default function Dashboard() {
  const { user, logoutMutation } = useAuth();
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const upcomingTasks = tasks
    .filter((task) => !task.completed)
    .sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tasks
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.username}
            </span>
            <ThemeSwitch />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          {stats && <StatsDisplay stats={stats} />}

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Tasks</h2>
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Due {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    {new Date(task.deadline) < new Date() && (
                      <span className="text-sm text-destructive">Overdue</span>
                    )}
                  </div>
                ))}
                {upcomingTasks.length === 0 && (
                  <p className="text-muted-foreground">No upcoming tasks</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}