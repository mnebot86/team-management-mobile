import React from 'react';
import { Text as PaperText, useTheme } from 'react-native-paper';
import { StyleProp, TextStyle, GestureResponderEvent } from 'react-native';

type TextBodyProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  variant?: 'default' | 'muted' | 'accent';
  onPress?: (event: GestureResponderEvent) => void;
};

const TextBody = ({ children, style, variant = 'default', onPress }: TextBodyProps) => {
  const theme = useTheme();

  const getColor = () => {
    if (variant === 'muted') return theme.colors.onSurfaceVariant;
    if (variant === 'accent') return (theme.colors as any).accent ?? theme.colors.primary;

    return theme.colors.onSurface;
  };

  return (
    <PaperText
      variant="bodyMedium"
      onPress={onPress}
      style={[
        {
          color: getColor(),
        },
        style,
      ]}
    >
      {children}
    </PaperText>
  );
};

export default TextBody;
