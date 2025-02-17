import { Task } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Pencil, Trash2, Clock } from "lucide-react";
import TaskForm from "./task-form";
import { format, isAfter } from "date-fns";
import { ru } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSound } from "@/hooks/use-sound-settings";
import { useTranslation } from "@/lib/i18n";
import { useQuotes } from "@/hooks/use-quotes";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { playSound } = useAppSound();
  const { t } = useTranslation();
  const { showRandomQuote } = useQuotes();
  const toggleMutation = useMutation({
    mutationFn: async () => {
      const isCompleting = !task.completed;
      const res = await apiRequest("PATCH", `/api/tasks/${task.id}`, {
        completed: isCompleting,
        completedAt: isCompleting ? new Date().toISOString() : null,
      });
      return await res.json();
    },
    onSuccess: (updatedTask: Task) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });

      if (!task.completed) {
        playSound("complete");
        showRandomQuote();

        // Добавляем уведомление о выполнении
        toast({
          title: t("taskCompleted"),
          description: t("congratsOnCompletion"),
          duration: 3000,
        });
      }
    },
    onError: () => {
      playSound("notification");
      toast({
        title: t("error"),
        description: t("failedToUpdateTask"),
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/tasks/${task.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });

  const isOverdue = new Date(task.deadline) < new Date() && !task.completed;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        layout
      >
        <Card className={task.completed ? "opacity-75" : ""}>
          <CardContent className="pt-6">
            <motion.div
              className="flex items-start justify-between"
              animate={{
                scale: task.completed ? 0.98 : 1,
                x: task.completed ? 10 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
            >
              <div className="flex items-start space-x-2">
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleMutation.mutate()}
                    className="mt-1"
                  />
                </motion.div>
                <div>
                  <motion.h3
                    className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                    animate={{
                      opacity: task.completed ? 0.75 : 1,
                      scale: task.completed ? 0.95 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {task.title}
                  </motion.h3>
                  {task.description && (
                    <motion.p
                      className="text-sm text-muted-foreground mt-1"
                      animate={{ opacity: task.completed ? 0.5 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {task.description}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center justify-between mt-1"
              animate={{ opacity: task.completed ? 0.7 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <p className="flex items-center gap-3 text-[13px] text-black  font-500 rounded-[100px] p-1 ">
                <motion.span
                  className={
                    isOverdue
                      ? " items-center justify-between bg-red-500 p-1 rounded-[100px] flex "
                      : "items-center justify-between flex bg-gray-400 font-medium p-1 rounded-[100px]"
                  }
                  animate={{
                    color: "inherit",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  до {format(new Date(task.deadline), "d MMM")}
                </motion.span>
              </p>
            </motion.div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4 mr-2" />
                    {t("edit")}
                  </Button>
                </motion.div>
              </DialogTrigger>
              <TaskForm task={task} />
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("delete")}
                  </Button>
                </motion.div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('sureConfirm')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('sureAtt')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMutation.mutate()}
                    className="bg-destructive text-destructive-foreground"
                  >
                    {t('delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
