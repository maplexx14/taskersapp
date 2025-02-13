import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import TaskForm from "@/components/task-form";
import TaskCard from "@/components/task-card";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeSwitch } from "@/components/theme-switch";
import { motion } from "framer-motion";
import { UserNav } from "@/components/user-nav";

export default function HomePage() {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<"deadline" | "created">("deadline");
  const [filterBy, setFilterBy] = useState<"all" | "pending" | "completed">("pending");

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const sortedAndFilteredTasks = tasks
    .filter((task) => {
      if (filterBy === "pending") return !task.completed;
      if (filterBy === "completed") return task.completed;
      return true;
    })
    .sort((a, b) => {
      const dateA = sortBy === "deadline" ? new Date(a.deadline) : new Date(a.createdAt);
      const dateB = sortBy === "deadline" ? new Date(b.deadline) : new Date(b.createdAt);
      return dateA.getTime() - dateB.getTime();
    });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">taskers.</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeSwitch />
            <UserNav />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Select value={sortBy} onValueChange={(value: "deadline" | "created") => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deadline">Sort by Deadline</SelectItem>
                <SelectItem value="created">Sort by Created</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterBy} onValueChange={(value: "all" | "pending" | "completed") => setFilterBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-screen h-4 w-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <TaskForm />
          </Dialog>
          </div>

          
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {sortedAndFilteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {sortedAndFilteredTasks.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No tasks found</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}