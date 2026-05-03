import React from 'react';
import { Icon, useTheme } from 'react-native-paper';

type AppIconProps = {
  name: string;
  size?: number;
  variant?: 'default' | 'accent' | 'muted';
};

const AppIcon = ({ name, size = 28, variant = 'default' }: AppIconProps) => {
  const theme = useTheme();

  const getColor = () => {
    if (variant === 'accent') return (theme.colors as any).accent ?? theme.colors.primary;
    if (variant === 'muted') return theme.colors.onSurfaceVariant;

    return theme.colors.onSurface;
  };

  return <Icon source={name} size={size} color={getColor()} />;
};

export default AppIcon;
