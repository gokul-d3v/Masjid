import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Appearance } from 'react-native';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system'); // Default to system
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Determine initial theme based on system or selected theme
    const determineInitialTheme = () => {
      const colorScheme = Appearance.getColorScheme();
      if (theme === 'system') {
        return colorScheme === 'dark';
      } else {
        return theme === 'dark';
      }
    };

    setIsDarkMode(determineInitialTheme());

    // Subscribe to theme changes only when theme is set to 'system'
    if (theme === 'system') {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setIsDarkMode(colorScheme === 'dark');
      });

      return () => {
        subscription?.remove();
      };
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};