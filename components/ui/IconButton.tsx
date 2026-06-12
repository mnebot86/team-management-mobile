import React from 'react';
import { IconButton as PaperIconButton, IconButtonProps } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

export type AppIconButtonProps = IconButtonProps & {
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
};

const IconButton: React.FC<AppIconButtonProps> = ({
  variant = 'default',
  iconColor,
  containerColor,
  ...props
}) => {
  const theme = useTheme();

  const colors = {
    default: {
      iconColor: theme.colors.onSurface,
      containerColor: 'transparent',
    },
    primary: {
      iconColor: theme.colors.primary,
      containerColor: 'transparent',
    },
    secondary: {
      iconColor: theme.colors.secondary,
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
