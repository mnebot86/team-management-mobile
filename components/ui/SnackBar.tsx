import React from 'react';
import { Snackbar as PaperSnackbar, SnackbarProps as PaperSnackbarProps } from 'react-native-paper';
import { useAppTheme } from '@/hooks/useAppTheme';

type Variant = 'success' | 'error' | 'info';

type AppSnackBarProps = PaperSnackbarProps & {
  variant?: Variant;
};

const getBackgroundColor = (variant: Variant | undefined, theme: any) => {
  switch (variant) {
    case 'success':
      return theme.colors.status.success;
    case 'error':
      return theme.colors.status.error;
    case 'info':
      return theme.colors.status.info;
    default:
      return theme.colors.card.elevatedBackground;
  }
};

const getTextColor = (variant: Variant | undefined, theme: any) => {
  switch (variant) {
    case 'success':
    case 'error':
    case 'info':
      return theme.colors.button.primaryText;
    default:
      return theme.colors.text.primary;
  }
};

const SnackBar: React.FC<AppSnackBarProps> = ({
  variant = 'info',
  style,
  children,
  ...props
}) => {
  const theme = useAppTheme();

  const backgroundColor = getBackgroundColor(variant, theme);
  const textColor = getTextColor(variant, theme);

  return (
    <PaperSnackbar
      {...props}
      style={[
        {
          backgroundColor,
        },
        style,
      ]}
      theme={{
        ...theme,
        colors: {
          ...theme.colors,
          onSurface: textColor,
        },
      }}
    >
      {children}
    </PaperSnackbar>
  );
};

export default SnackBar;
