import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Locale = 'ru' | 'en';

type LocaleStore = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: 'ru',
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'locale-storage',
    }
  )
);

type Translations = {
  [key in Locale]: {
    [key: string]: string;
  };
};

export const translations: Translations = {
  ru: {
    'taskManager': 'Управление задачами',
    'newTask': 'Новая задача',
    'sortByDeadline': 'Сортировать по сроку',
    'sortByCreated': 'Сортировать по созданию',
    'allTasks': 'Все задачи',
    'pending': 'В процессе',
    'completed': 'Выполненные',
    'noTasks': 'Задачи не найдены',
    'settings': 'Настройки',
    'profile': 'Профиль',
    'statistics': 'Статистика',
    'logout': 'Выйти',
    'language': 'Язык',
    'theme': 'Тема',
    'edit': 'Редактировать',
    'delete': 'Удалить',
    'due': 'Срок',
    'description': 'Описание',
    'title': 'Название',
    'save': 'Сохранить',
    'cancel': 'Отмена',
    'completedTasks': 'Выполненные задачи',
    'personalAccount': 'Личный аккаунт',
    'backToTasks': 'Назад к задачам',
    'username': 'Имя пользователя',
    'noCompletedTasks': 'Нет выполненных задач',
    'completedOn': 'Выполнено',
    'sounds': 'Звуки',
    'enableSounds': 'Включить звуки',
    'volume': 'Громкость',
    'taskCompleted': 'Задача выполнена',
    'taskUncompleted': 'Задача не выполнена',
    'avatar': 'Аватар',
    'uploadAvatar': 'Загрузить аватар',
    'removeAvatar': 'Удалить аватар',
    'avatarUpdated': 'Аватар обновлен',
    'avatarUpdateSuccess': 'Ваш аватар успешно обновлен',
    'avatarUpdateError': 'Ошибка обновления аватара',
    'avatarSizeError': 'Слишком большой файл',
    'avatarSizeLimit': 'Размер файла не должен превышать 5 МБ',
    'avatarRequirements': 'Поддерживаются форматы JPG, PNG. Максимальный размер: 5 МБ',
  },
  en: {
    'taskManager': 'Task Manager',
    'newTask': 'New Task',
    'sortByDeadline': 'Sort by Deadline',
    'sortByCreated': 'Sort by Created',
    'allTasks': 'All Tasks',
    'pending': 'Pending',
    'completed': 'Completed',
    'noTasks': 'No tasks found',
    'settings': 'Settings',
    'profile': 'Profile',
    'statistics': 'Statistics',
    'logout': 'Logout',
    'language': 'Language',
    'theme': 'Theme',
    'edit': 'Edit',
    'delete': 'Delete',
    'due': 'Due',
    'description': 'Description',
    'title': 'Title',
    'save': 'Save',
    'cancel': 'Cancel',
    'completedTasks': 'Completed Tasks',
    'personalAccount': 'Personal Account',
    'backToTasks': 'Back to Tasks',
    'username': 'Username',
    'noCompletedTasks': 'No completed tasks',
    'completedOn': 'Completed on',
    'sounds': 'Sounds',
    'enableSounds': 'Enable sounds',
    'volume': 'Volume',
    'taskCompleted': 'Task completed',
    'taskUncompleted': 'Task uncompleted',
    'avatar': 'Avatar',
    'uploadAvatar': 'Upload avatar',
    'removeAvatar': 'Remove avatar',
    'avatarUpdated': 'Avatar updated',
    'avatarUpdateSuccess': 'Your avatar has been updated successfully',
    'avatarUpdateError': 'Failed to update avatar',
    'avatarSizeError': 'File too large',
    'avatarSizeLimit': 'File size should not exceed 5MB',
    'avatarRequirements': 'Supported formats: JPG, PNG. Maximum size: 5MB',
  },
};

export function useTranslation() {
  const { locale } = useLocaleStore();

  const t = (key: keyof typeof translations['en']) => {
    return translations[locale][key] || key;
  };

  return { t, locale };
}