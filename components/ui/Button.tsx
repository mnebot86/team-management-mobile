import React, { useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Button as PaperButton, ButtonProps as PaperButtonProps } from 'react-native-paper';
import { useAppTheme } from '@/hooks/useAppTheme';

type AppButtonProps = Omit<PaperButtonProps, 'mode'> & {
  variant?: 'primary' | 'secondary' | 'text' | 'danger' | 'outline';
  fullWidth?: boolean;
  rounded?: boolean;
  style?: StyleProp<ViewStyle>;
};

const mapVariantToMode = (variant: AppButtonProps['variant']): PaperButtonProps['mode'] => {
  if (variant === 'secondary' || variant === 'danger' || variant === 'outline') return 'outlined';
  if (variant === 'text') return 'text';
  return 'contained';
};

const AppButton = ({
  variant = 'primary',
  fullWidth = true,
  rounded = true,
  style,
  contentStyle,
  labelStyle,
  ...props
}: AppButtonProps) => {
  const theme = useAppTheme();

  const mode = mapVariantToMode(variant);

  const isDanger = variant === 'danger';

  const [pressed, setPressed] = useState(false);

  return (
    <PaperButton
      {...props}
      mode={mode}
      onPressIn={(e) => {
        setPressed(true);
        props.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setPressed(false);
        props.onPressOut?.(e);
      }}
      rippleColor={isDanger ? theme.colors.error : theme.colors.button.primaryBackground}
      style={[
        {
          width: fullWidth ? '100%' : undefined,
          borderRadius: rounded ? 28 : 8,
          borderColor: isDanger ? theme.colors.error : theme.colors.button.border,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
      contentStyle={[
        {
          paddingVertical: 10,
        },
        contentStyle,
      ]}
      labelStyle={[
        {
          color: isDanger
            ? theme.colors.error
            : mode === 'contained'
              ? theme.colors.button.primaryText
              : theme.colors.button.secondaryText,
        },
        labelStyle,
      ]}
    />
  );
};

export default AppButton;
