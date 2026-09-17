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
  let buttonColor: string = theme.colors.button.secondaryBackground;
  let textColor: string = theme.colors.button.secondaryText;
  let borderColor = 'transparent';

  if (isHeader || isText) {
    buttonColor = 'transparent';
  } else if (isDisabled) {
    buttonColor = theme.colors.status.neutral;
  } else if (isPrimary) {
    buttonColor = theme.colors.button.primaryBackground;
  }

  if (isDisabled) {
    textColor = theme.colors.text.secondary;
  } else if (isHeader) {
    textColor = theme.colors.text.primary;
  } else if (isDanger) {
    textColor = theme.colors.error;
  } else if (isPrimary) {
    textColor = theme.colors.button.primaryText;
  }

  if (isDanger) {
    borderColor = theme.colors.error;
  } else if (isSecondary) {
    borderColor = theme.colors.button.border;
  }

  return (
    <PaperButton
      {...props}
      mode={mode}
      rippleColor={
        isDanger
          ? theme.colors.error
          : theme.colors.button.ripple
      }
      buttonColor={buttonColor}
      textColor={textColor}
      style={[
        {
          width: fullWidth ? '100%' : undefined,
          borderRadius: rounded ? 28 : 8,
          borderColor,
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
          color: textColor,
        },
        labelStyle,
      ]}
    />
  );
};

export default AppButton;
