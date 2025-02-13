import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Howl } from 'howler';

type SoundSettings = {
  enabled: boolean;
  volume: number;
  setEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
};

export const useSoundSettings = create<SoundSettings>()(
  persist(
    (set) => ({
      enabled: true,
      volume: 0.5,
      setEnabled: (enabled) => set({ enabled }),
      setVolume: (volume) => set({ volume }),
    }),
    {
      name: 'sound-settings',
    }
  )
);

const sounds = {
  complete: new Howl({
    src: ['/sounds/complete.mp3'],
    volume: 0.5,
  }),
  notification: new Howl({
    src: ['/sounds/notification.mp3'],
    volume: 0.5,
  }),
};

export function useAppSound() {
  const { enabled, volume } = useSoundSettings();

  const playSound = (soundName: keyof typeof sounds) => {
    if (enabled) {
      const sound = sounds[soundName];
      sound.volume(volume);
      sound.play();
    }
  };

  return { playSound };
}
