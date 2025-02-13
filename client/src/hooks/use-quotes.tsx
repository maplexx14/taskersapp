import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/lib/i18n';

const russianQuotes = [
  "Каждое достижение - шаг к большему успеху!",
  "Маленькие победы создают большие результаты!",
  "Вы на правильном пути к своим целям!",
  "Прогресс - это движение вперёд, шаг за шагом!",
  "Каждая выполненная задача - это ваша личная победа!",
  "Успех строится из маленьких достижений!",
  "Вы делаете отличную работу!",
  "Продолжайте двигаться вперед!",
  "Ваше усердие приносит результаты!",
  "Вы становитесь лучше с каждым днем!"
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
