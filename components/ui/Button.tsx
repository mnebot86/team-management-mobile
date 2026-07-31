import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import {
  Button as PaperButton,
  ButtonProps as PaperButtonProps,
} from 'react-native-paper';

import { useAppTheme } from '@/hooks/useAppTheme';

type AppButtonProps = Omit<PaperButtonProps, 'mode'> & {
  variant?: 'primary' | 'secondary' | 'text' | 'danger' | 'outline' | 'header';
  fullWidth?: boolean;
  rounded?: boolean;
  style?: StyleProp<ViewStyle>;
};

const mapVariantToMode = (
  variant: AppButtonProps['variant'],
): PaperButtonProps['mode'] => {
  switch (variant) {
    case 'secondary':
    case 'outline':
    case 'danger':
      return 'outlined';

    case 'text':
    case 'header':
      return 'text';

    default:
      return 'contained';
  }
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

  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary' || variant === 'outline';
  const isDanger = variant === 'danger';
  const isHeader = variant === 'header';
  const isText = variant === 'text';
  const isDisabled = props.disabled;

  return (
    <PaperButton
      {...props}
      mode={mode}
      rippleColor={
        isDanger
          ? theme.colors.error
          : theme.colors.button.ripple
      }
      buttonColor={
        isHeader || isText
          ? 'transparent'
          : isDisabled
            ? theme.colors.status.neutral
            : isPrimary
              ? theme.colors.button.primaryBackground
              : theme.colors.button.secondaryBackground
      }
      textColor={
        isDisabled
          ? theme.colors.text.secondary
          : isHeader
            ? theme.colors.text.primary
            : isDanger
              ? theme.colors.error
              : isPrimary
                ? theme.colors.button.primaryText
                : theme.colors.button.secondaryText
      }
      style={[
        {
          width: fullWidth ? '100%' : undefined,
          borderRadius: rounded ? 28 : 8,
          borderColor: isDanger
            ? theme.colors.error
            : isSecondary
              ? theme.colors.button.border
              : 'transparent',
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
            ? theme.colors.text.secondary
            : isHeader
              ? theme.colors.text.primary
              : isDanger
                ? theme.colors.error
                : isPrimary
                  ? theme.colors.button.primaryText
                  : theme.colors.button.secondaryText,
        },
        labelStyle,
      ]}
    />
  );
};

export default AppButton;
