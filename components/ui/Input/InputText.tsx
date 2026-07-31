import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';

import Text from '@/components/ui/Text';
import { useAppTheme } from '@/hooks/useAppTheme';

type InputTextProps = TextInputProps & {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  rightIcon?: React.ComponentProps<typeof TextInput.Icon>['icon'];
};

const InputText = ({
  label,
  containerStyle,
  style,
  rightIcon,
  right,
  ...props
}: InputTextProps) => {
  const theme = useAppTheme();

  return (
    <View style={[{ width: '100%' }, containerStyle]}>
      {label && (
        <View style={{ marginBottom: 6 }}>
          <Text.Body>{label}</Text.Body>
        </View>
      )}

      <TextInput
        {...props}
        mode="outlined"
        style={[
          {
            width: '100%',
            backgroundColor: theme.colors.card.background,
          },
          style,
        ]}
        outlineColor={theme.colors.card.border}
        activeOutlineColor={theme.colors.primary}
        textColor={theme.colors.text.primary}
        right={
          rightIcon
            ? <TextInput.Icon icon={rightIcon} />
            : right
        }
      />
    </View>
  );
};

export default InputText;
