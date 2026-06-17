import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useAppTheme } from '@/hooks/useAppTheme';
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
  const theme = useAppTheme();

  return (
    <View style={style}>
      <Text.Body style={{ marginBottom: 8 }}>
        {label}
      </Text.Body>

      <Dropdown
        style={{
          minHeight: 64,
          borderWidth: 1,
          borderColor: theme.colors.card.border,
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: theme.colors.card.background,
        }}
        placeholderStyle={{
          color: theme.colors.text.secondary,
          fontSize: 16,
          lineHeight: 24,
        }}
        selectedTextStyle={{
          color: theme.colors.text.primary,
          fontSize: 16,
          lineHeight: 24,
        }}
        itemTextStyle={{
          color: theme.colors.text.primary,
        }}
        containerStyle={{
          borderRadius: 12,
          backgroundColor: theme.colors.card.elevatedBackground,
        }}
        activeColor={theme.colors.screen.headerBackground}
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
