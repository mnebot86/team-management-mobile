import React from 'react';
import { Text as PaperText } from 'react-native-paper';
import { useAppTheme } from '@/hooks/useAppTheme';
import { StyleProp, TextStyle, GestureResponderEvent } from 'react-native';

type TextBodyProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  variant?: 'default' | 'muted' | 'accent';
  onPress?: (event: GestureResponderEvent) => void;
};

const TextBody = ({ children, style, variant = 'default', onPress }: TextBodyProps) => {
  const theme = useAppTheme();

  const getColor = () => {
    if (variant === 'muted') return theme.colors.text.secondary;
    if (variant === 'accent') return theme.colors.text.accent;

    return theme.colors.text.primary;
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
