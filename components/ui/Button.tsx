import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Button as PaperButton, ButtonProps as PaperButtonProps, useTheme } from 'react-native-paper';

type AppButtonProps = Omit<PaperButtonProps, 'mode'> & {
  variant?: 'primary' | 'secondary' | 'text';
  fullWidth?: boolean;
  rounded?: boolean;
  style?: StyleProp<ViewStyle>;
};

const mapVariantToMode = (variant: AppButtonProps['variant']): PaperButtonProps['mode'] => {
  if (variant === 'secondary') return 'outlined';
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
  const theme = useTheme();

  const mode = mapVariantToMode(variant);

  return (
    <PaperButton
      {...props}
      mode={mode}
      style={[
        {
          width: fullWidth ? '100%' : undefined,
          borderRadius: rounded ? 28 : 8,
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
          color: mode === 'contained' ? theme.colors.onPrimary : undefined,
        },
        labelStyle,
      ]}
    />
  );
};

export default AppButton;
