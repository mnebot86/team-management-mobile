import React from 'react';
import { Snackbar as PaperSnackbar, SnackbarProps as PaperSnackbarProps, useTheme } from 'react-native-paper';

type Variant = 'success' | 'error' | 'info';

type AppSnackBarProps = PaperSnackbarProps & {
  variant?: Variant;
};

const getBackgroundColor = (variant: Variant | undefined, theme: any) => {
  switch (variant) {
    case 'success':
      return '#2E7D32'; // green (can move to theme later)
    case 'error':
      return theme.colors.error;
    case 'info':
      return theme.colors.primary;
    default:
      return theme.colors.surface;
  }
};

const getTextColor = (variant: Variant | undefined, theme: any) => {
  switch (variant) {
    case 'success':
    case 'error':
    case 'info':
      return theme.colors.onPrimary;
    default:
      return theme.colors.onSurface;
  }
};

const SnackBar: React.FC<AppSnackBarProps> = ({
  variant = 'info',
  style,
  children,
  ...props
}) => {
  const theme = useTheme();

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
