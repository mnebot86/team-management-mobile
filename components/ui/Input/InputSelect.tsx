import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useTheme } from 'react-native-paper';
import Text from '@/components/ui/Text';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  value?: string;
  placeholder?: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

const InputSelect = ({
  label,
  value,
  placeholder = 'Select an option',
  options,
  onValueChange,
  style,
}: SelectProps) => {
  const theme = useTheme();

  return (
    <View style={style}>
      <Text.Body style={{ marginBottom: 8 }}>
        {label}
      </Text.Body>

      <Dropdown
        style={{
          minHeight: 64,
          borderWidth: 1,
          borderColor: theme.colors.outline,
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: theme.colors.background,
        }}
        placeholderStyle={{
          color: theme.colors.onSurfaceVariant,
          fontSize: 16,
          lineHeight: 24,
        }}
        selectedTextStyle={{
          color: theme.colors.onSurface,
          fontSize: 16,
          lineHeight: 24,
        }}
        itemTextStyle={{
          color: theme.colors.onSurface,
        }}
        containerStyle={{
          borderRadius: 12,
          backgroundColor: theme.colors.surface,
        }}
        activeColor={theme.colors.surfaceVariant}
        data={options}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value}
        renderRightIcon={() => null}
        onChange={(item) => onValueChange(item.value)}
      />
    </View>
  );
};

export default InputSelect;
