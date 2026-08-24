import type { ThemeMode } from './vault/types';

/**
 * Obsidian-inspired dark theme palette.
 */
export const darkTheme = {
  '--bg-primary': '#1e1e1e',
  '--bg-secondary': '#252525',
  '--text-primary': '#dcddde',
  '--text-secondary': '#8b949e',
  '--border-color': '#30363d',
  '--sidebar-bg': '#1e1e1e',
  '--editor-bg': '#1e1e1e',
  '--graph-node': '#7c3aed',
  '--graph-link': '#30363d',
  '--accent-color': '#7c3aed',
};

/**
 * Obsidian-inspired light theme palette.
 */
export const lightTheme = {
  '--bg-primary': '#ffffff',
  '--bg-secondary': '#f3f4f6',
  '--text-primary': '#24292f',
  '--text-secondary': '#57606a',
  '--border-color': '#d0d7de',
  '--sidebar-bg': '#f6f8fa',
  '--editor-bg': '#ffffff',
  '--graph-node': '#7c3aed',
  '--graph-link': '#d0d7de',
  '--accent-color': '#7c3aed',
};

/**
 * Applies the CSS variables for the given theme mode.
 * @param theme - 'dark' or 'light'
 */
export function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  const variables = theme === 'dark' ? darkTheme : lightTheme;
  
  for (const [key, value] of Object.entries(variables)) {
    root.style.setProperty(key, value);
  }
  
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
}
