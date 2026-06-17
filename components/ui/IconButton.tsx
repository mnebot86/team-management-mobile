import React from 'react';
import { IconButton as PaperIconButton, IconButtonProps } from 'react-native-paper';
import { useAppTheme } from '@/hooks/useAppTheme';

export type AppIconButtonProps = IconButtonProps & {
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
};

const IconButton: React.FC<AppIconButtonProps> = ({
  variant = 'default',
  iconColor,
  containerColor,
  ...props
}) => {
  const theme = useAppTheme();

  const colors = {
    default: {
      iconColor: theme.colors.icon.primary,
      containerColor: 'transparent',
    },
    primary: {
      iconColor: theme.colors.icon.accent,
      containerColor: 'transparent',
    },
    secondary: {
      iconColor: theme.colors.icon.secondary,
      containerColor: 'transparent',
    },
    danger: {
      iconColor: theme.colors.error,
      containerColor: 'transparent',
    },
  };

  return (
    <PaperIconButton
      iconColor={iconColor ?? colors[variant].iconColor}
      containerColor={containerColor ?? colors[variant].containerColor}
      {...props}
    />
  );
};

export default IconButton;
