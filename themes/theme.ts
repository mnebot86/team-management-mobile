import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { COLORS } from './colors';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,

    primary: COLORS.light.primary,
    accent: COLORS.light.accent,

    background: COLORS.light.background,
    surface: COLORS.light.surface,

    text: COLORS.light.text,
    card: COLORS.light.card,
    overlay: COLORS.light.overlay,
    screen: COLORS.light.screen,
    drawer: COLORS.light.drawer,
    button: COLORS.light.button,
    status: COLORS.light.status,
    event: COLORS.light.event,
    icon: COLORS.light.icon,
    avatar: COLORS.light.avatar,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,

    primary: COLORS.dark.primary,
    accent: COLORS.dark.accent,

    background: COLORS.dark.background,
    surface: COLORS.dark.surface,

    text: COLORS.dark.text,
    card: COLORS.dark.card,
    overlay: COLORS.dark.overlay,
    screen: COLORS.dark.screen,
    drawer: COLORS.dark.drawer,
    button: COLORS.dark.button,
    status: COLORS.dark.status,
    event: COLORS.dark.event,
    icon: COLORS.dark.icon,
    avatar: COLORS.dark.avatar,
  },
};

export type AppTheme = typeof lightTheme;
