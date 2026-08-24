import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '@/lib/vault/types';
import { applyTheme } from '@/lib/themes';

interface ThemeState {
  theme: ThemeMode;
  accentColor: string;
  fontSize: number;
  fontFamily: string;
  
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  setAccentColor: (color: string) => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      accentColor: '#7c3aed',
      fontSize: 16,
      fontFamily: 'Inter',

      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        applyTheme(newTheme);
      },

      setTheme: (mode) => {
        set({ theme: mode });
        applyTheme(mode);
      },

      setAccentColor: (color) => {
        set({ accentColor: color });
        document.documentElement.style.setProperty('--accent-color', color);
      },

      setFontSize: (size) => {
        set({ fontSize: size });
        document.documentElement.style.setProperty('--base-font-size', `${size}px`);
      },

      setFontFamily: (family) => {
        set({ fontFamily: family });
        document.documentElement.style.setProperty('--base-font-family', family);
      }
    }),
    {
      name: 'obsidian1-theme-storage'
    }
  )
);
