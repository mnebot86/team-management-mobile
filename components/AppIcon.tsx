import React from 'react';
import { Icon } from 'react-native-paper';
import { useAppTheme } from '@/hooks/useAppTheme';

type AppIconProps = {
  name: string;
  size?: number;
  variant?: 'default' | 'accent' | 'muted';
};

const AppIcon = ({ name, size = 28, variant = 'default' }: AppIconProps) => {
  const theme = useAppTheme();

  const getColor = () => {
    if (variant === 'accent') return theme.colors.icon.accent;
    if (variant === 'muted') return theme.colors.icon.secondary;

    return theme.colors.icon.primary;
  };

  return <Icon source={name} size={size} color={getColor()} />;
};

export default AppIcon;
