import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  useEffect(() => {
    // Update class on document root element
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};