import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Button as PaperButton, ButtonProps as PaperButtonProps } from 'react-native-paper';
import { useAppTheme } from '@/hooks/useAppTheme';

type AppButtonProps = Omit<PaperButtonProps, 'mode'> & {
  variant?: 'primary' | 'secondary' | 'text' | 'danger' | 'outline' | 'header';
  fullWidth?: boolean;
  rounded?: boolean;
  style?: StyleProp<ViewStyle>;
};

const mapVariantToMode = (variant: AppButtonProps['variant']): PaperButtonProps['mode'] => {
  if (variant === 'secondary' || variant === 'danger' || variant === 'outline') return 'outlined';
  if (variant === 'text' || variant === 'header') return 'text';
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
  const isHeader = variant === 'header';
  const isDisabled = props.disabled;

  return (
    <PaperButton
      {...props}
      mode={mode}
      rippleColor={isDanger ? theme.colors.error : theme.colors.button.ripple}
      textColor={
        isDisabled
          ? theme.colors.text.primary
          : isHeader
            ? theme.colors.text.primary
            : isDanger
              ? theme.colors.error
              : mode === 'contained'
                ? theme.colors.button.primaryText
                : theme.colors.button.secondaryText
      }
      buttonColor={
        isHeader
          ? 'transparent'
          : isDisabled
            ? theme.colors.status.neutral
            : mode === 'contained'
              ? theme.colors.button.primaryBackground
              : undefined
      }
      style={[
        {
          width: fullWidth ? '100%' : undefined,
          borderRadius: rounded ? 28 : 8,
          borderColor: isDanger ? theme.colors.error : theme.colors.button.border,
          backgroundColor: undefined,
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
          color: isDisabled
            ? theme.colors.text.primary
            : isHeader
              ? theme.colors.text.primary
              : isDanger
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
