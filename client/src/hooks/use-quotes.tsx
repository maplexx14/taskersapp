import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/lib/i18n';

const russianQuotes = [
  "Каждая выполненная задача приближает вас к цели!",
  "Небольшие шаги ведут к большим свершениям!",
  "Вы уверенно движетесь к намеченной цели!",
  "Постоянный прогресс — путь к успеху!",
  "Завершённая задача — ещё одна победа!",
  "Успех складывается из небольших достижений!",
  "Отличная работа, так держать!",
  "Двигайтесь вперёд, у вас всё получается!",
  "Ваши старания приносят отличные результаты!",
  "С каждым днём вы становитесь эффективнее!"
];

const englishQuotes = [
  "Every achievement is a step towards greater success!",
  "Small victories create big results!",
  "You're on the right path to your goals!",
  "Progress is moving forward, step by step!",
  "Every completed task is your personal victory!",
  "Success is built from small achievements!",
  "You're doing a great job!",
  "Keep moving forward!",
  "Your hard work is paying off!",
  "You're getting better every day!"
];

export function useQuotes() {
  const { toast } = useToast();
  const { locale } = useTranslation();
  const quotes = locale === 'ru' ? russianQuotes : englishQuotes;

  const showRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    toast({
      title: locale === 'ru' ? "Молодец!" : "Well done!",
      description: quote,
      duration: 5000,
    });
  };

  return { showRandomQuote };
}
