import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';
import { COLORS } from './colors';

// Extend safely
export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.light.primary,
    // custom accent color (gold for links)
    // @ts-expect-error custom extension
    accent: COLORS.light.accent,
    background: COLORS.light.background,
    surface: COLORS.light.surface,
    onSurface: COLORS.light.text,
    onSurfaceVariant: COLORS.light.onSurfaceVariant,
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COLORS.dark.primary,
    // custom accent color (gold for links)
    // @ts-expect-error custom extension
    accent: COLORS.dark.accent,
    background: COLORS.dark.background,
    surface: COLORS.dark.surface,
    onSurface: COLORS.dark.text,
    onSurfaceVariant: COLORS.dark.onSurfaceVariant,
  },
};
