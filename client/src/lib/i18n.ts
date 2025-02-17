import { create } from "zustand";
import { persist } from "zustand/middleware";

type Locale = "ru" | "en";

type LocaleStore = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: "ru",
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "locale-storage",
    },
  ),
);

type Translations = {
  [key in Locale]: {
    [key: string]: string;
  };
};

export const translations: Translations = {
  ru: {
    taskManager: "Планировщик задач",
    newTask: "Создать задачу",
    sortByDeadline: "По сроку выполнения",
    sortByCreated: "По дате создания",
    allTasks: "Все задачи",
    pending: "Активные",
    completed: "Завершённые",
    noTasks: "Нет задач",
    settings: "Настройки",
    profile: "Профиль",
    statistics: "Статистика",
    logout: "Выйти",
    language: "Язык интерфейса",
    theme: "Оформление",
    edit: "Изменить",
    delete: "Удалить",
    due: "Выполнить до",
    overdue: "Просрочено",
    description: "Описание",
    title: "Заголовок",
    save: "Сохранить",
    cancel: "Отмена",
    completedTasks: "Завершённые задачи",
    personalAccount: "Личный кабинет",
    backToTasks: "К списку задач",
    username: "Имя пользователя",
    noCompletedTasks: "Нет завершённых задач",
    completedOn: "Дата выполнения",
    sounds: "Звуковые эффекты",
    enableSounds: "Включить звуки",
    volume: "Громкость",
    taskCompleted: "Задача завершена",
    taskUncompleted: "Задача возобновлена",
    avatar: "Фото профиля",
    uploadAvatar: "Загрузить фото",
    removeAvatar: "Удалить фото",
    avatarUpdated: "Фото обновлено",
    avatarUpdateSuccess: "Фото профиля успешно обновлено",
    avatarUpdateError: "Не удалось обновить фото",
    avatarSizeError: "Файл слишком большой",
    avatarSizeLimit: "Максимальный размер файла: 5 МБ",
    avatarRequirements:
      "Поддерживаемые форматы: JPG, PNG. Максимальный размер: 5 МБ",
    noTasksFound: "Нет задач",
    notFound: "Страница не найдена",
    completedTask: "Задача завершена",
    tasks: "Задачи",
    completedTasksHome: "Завершённые",
    updateTask: "Изменить задачу",
    upcomingTasks: "Нужно выполнить",
    sureConfirm: "Вы уверены?",
    sureAtt: "Вы уверены, что хотите удалить задачу?",
    welcome: "Добро пожаловать",
    tasksDistribution: "Сводка по задачам",
  },
  en: {
    taskManager: "Task Manager",
    newTask: "New Task",
    sortByDeadline: "Sort by Deadline",
    sortByCreated: "Sort by Created",
    allTasks: "All Tasks",
    pending: "Pending",
    completed: "Completed",
    noTasks: "No tasks found",
    settings: "Settings",
    profile: "Profile",
    statistics: "Statistics",
    logout: "Logout",
    language: "Language",
    theme: "Theme",
    edit: "Edit",
    delete: "Delete",
    due: "Due",
    overdue: "Overdue",
    description: "Description",
    title: "Title",
    save: "Save",
    cancel: "Cancel",
    completedTasks: "Completed Tasks",
    personalAccount: "Personal Account",
    backToTasks: "Back to Tasks",
    username: "Username",
    noCompletedTasks: "No completed tasks",
    completedOn: "Completed on",
    sounds: "Sounds",
    enableSounds: "Enable sounds",
    volume: "Volume",
    taskCompleted: "Task completed",
    taskUncompleted: "Task uncompleted",
    avatar: "Avatar",
    uploadAvatar: "Upload avatar",
    removeAvatar: "Remove avatar",
    avatarUpdated: "Avatar updated",
    avatarUpdateSuccess: "Your avatar has been updated successfully",
    avatarUpdateError: "Failed to update avatar",
    avatarSizeError: "File too large",
    avatarSizeLimit: "File size should not exceed 5MB",
    avatarRequirements: "Supported formats: JPG, PNG. Maximum size: 5MB",
    noTasksFound: "No tasks found",
    notFound: "Not found",
    completedTask: "Task completed",
    tasks: "Tasks",
    completedTasksHome: "Completed",
    updateTask: "Update Task",
    sureConfirm: "Are you sure?",
    sureAtt: "This action cannot be undone",
    welcome: "Welcome",
    upcomingTasks: "Upcoming",
    tasksDistribution: "Task Distribution",
  },
};

export function useTranslation() {
  const { locale } = useLocaleStore();

  const t = (key: keyof (typeof translations)["en"]) => {
    return translations[locale][key] || key;
  };

  return { t, locale };
}
