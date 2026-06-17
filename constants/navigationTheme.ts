// constants/navigationTheme.ts
import type { AppTheme } from '@/themes/theme';

export const getTabBarOptions = (theme: AppTheme) => ({
  tabBarStyle: {
    backgroundColor: theme.colors.screen.tabBarBackground,
    borderTopColor: theme.colors.card.border,
    borderTopWidth: 1,
  },
  tabBarActiveTintColor: theme.colors.icon.accent,
  tabBarInactiveTintColor: theme.colors.icon.secondary,
});

export const getDrawerOptions = (theme: AppTheme) => ({
  drawerStyle: {
    backgroundColor: theme.colors.drawer.background,
    borderRightColor: theme.colors.drawer.border,
  },
  drawerActiveBackgroundColor: theme.colors.drawer.activeBackground,
  drawerActiveTintColor: theme.colors.drawer.activeText,
  drawerInactiveTintColor: theme.colors.drawer.inactiveText,
});
