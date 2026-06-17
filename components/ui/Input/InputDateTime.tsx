import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { TextInput } from 'react-native-paper';
import { useAppTheme } from '@/hooks/useAppTheme';

import InputText from './InputText';

interface InputDateTimeProps {
  label: string;
  value?: Date;
  placeholder?: string;
  mode: 'date' | 'time' | 'datetime';
  field: 'startDate' | 'startTime' | 'endTime' | 'recurrenceEndDate';
  style?: StyleProp<TextStyle>;
}

const InputDateTime = ({
  label,
  value,
  placeholder = 'Select Time',
  mode,
  field,
  style,
}: InputDateTimeProps) => {
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  const theme = useAppTheme();

  const displayValue = value
    ? mode === 'date'
      ? value.toLocaleDateString()
      : mode === 'datetime'
        ? value.toLocaleString()
        : value.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        })
    : '';

  return (
    <InputText
      label={label}
      value={displayValue}
      placeholder={placeholder}
      editable={false}
      style={style}
      right={
        <TextInput.Icon
          icon={mode === 'date' ? 'calendar' : 'clock-outline'}
          color={theme.colors.icon.secondary}
        />
      }
      onPressIn={() => {
        router.push({
          pathname: '/teams/team/[teamId]/pick-date-modal',
          params: {
            teamId,
            field,
            mode,
            value: value?.toISOString(),
          },
        });
      }}
    />
  );
};

export default InputDateTime;
