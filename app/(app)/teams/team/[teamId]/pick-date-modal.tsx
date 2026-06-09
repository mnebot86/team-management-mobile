import { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, useTheme } from 'react-native-paper';
import { DateTimeField, useDateTimeStore } from '@/hooks/useDateTimeStore';

import Screen from '@/components/layout/Screen';
import Text from '@/components/ui/Text';

export default function PickDateModal() {
  const theme = useTheme();

  const { mode, value, field } = useLocalSearchParams<{
    mode?: string;
    value?: string;
    field?: DateTimeField;
  }>();

  const setField = useDateTimeStore((state) => state.setField);

  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : new Date()
  );

  return (
    <Screen>
      <View style={{ padding: 24 }}>
        <Text.Heading style={{ marginBottom: 24 }}>
          {mode === 'time' ? 'Select Time' : 'Select Date'}
        </Text.Heading>

        <DateTimePicker
          value={selectedDate}
          mode={mode === 'time' ? 'time' : 'date'}
          display="spinner"
          onChange={(_, date) => {
            if (date) {
              setSelectedDate(date);
            }
          }}
        />

        <Button
          mode="contained"
          style={{ marginTop: 24 }}
          onPress={() => {
            if (field) {
              setField(field, selectedDate);
            }

            router.back();
          }}
        >
          Done
        </Button>
      </View>
    </Screen>
  );
}
