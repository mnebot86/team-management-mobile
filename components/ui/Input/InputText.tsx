import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { TextInput, TextInputProps, useTheme } from 'react-native-paper';
import Text from '@/components/ui/Text';

type InputTextProps = TextInputProps & {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

const InputText = ({ label, containerStyle, style, ...props }: InputTextProps) => {
  const theme = useTheme();

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
        style={[{ width: '100%' }, style]}
        outlineColor={theme.colors.outline}
        activeOutlineColor={theme.colors.primary}
        textColor={theme.colors.onSurface}
      />
    </View>
  );
};

export default InputText;
