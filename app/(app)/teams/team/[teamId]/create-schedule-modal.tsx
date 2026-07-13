import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import ScreenContainer from '@/components/layout/Screen';
import AppButton from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AppSnackbar from '@/components/ui/SnackBar';
import { useDateTimeStore } from '@/hooks/useDateTimeStore';
import { createSchedule } from '@/api/schedule';

const CreateScheduleModal = () => {
  const { teamId } = useLocalSearchParams();

  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('practice');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState('false');
  const [isHomeGame, setIsHomeGame] = useState('home');
  const [repeatDays, setRepeatDays] = useState('');
  const [locationName, setLocationName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [opponentName, setOpponentName] = useState('');
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
  });

  const {
    startDate,
    startTime,
    endTime,
    recurrenceEndDate,
    reset,
  } = useDateTimeStore();

  const handleCreate = async () => {
    const dayMap: Record<string, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };

    const payload = {
      teamId,
      title,
      description,
      isHomeGame: isHomeGame === 'home',
      recurrence: {
        isRecurring: isRecurring === 'true',
        frequency: isRecurring === 'true' ? 'weekly' : null,
        daysOfWeek: repeatDays
          ? repeatDays
            .split(',')
            .map((day) => dayMap[day.trim()])
            .filter((day) => day !== undefined)
          : [],
        endDate: recurrenceEndDate,
      },
      eventType,
      startDate,
      startTime,
      endTime,
      repeatDays,
      locationName,
      streetAddress,
      city,
      state,
      zipCode,
      opponentName,
    };

    await createSchedule(payload);

    reset();
    router.back();
  };

  return (
    <ScreenContainer.Scroll>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Input.Select
          label="Event Type"
          value={eventType}
          onValueChange={setEventType}
          options={[
            { label: 'Practice', value: 'practice' },
            { label: 'Game', value: 'game' },
            { label: 'Team Event', value: 'event' },
          ]}
        />

        {eventType === 'game' ? (
          <Input.Text
            label="Opponent"
            value={opponentName}
            onChangeText={setOpponentName}
            placeholder="Thunder FC"
          />
        ) : (
          <Input.Text
            label="Event Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Morning Practice"
          />
        )}

        <Input.Text
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Practice details, equipment needed, notes..."
          multiline
          numberOfLines={3}
        />

        <Input.DateTime
          label="Start Date"
          mode="date"
          field="startDate"
          value={startDate}
          placeholder="Select Date"
        />

        <Input.DateTime
          label="Start Time"
          mode="time"
          field="startTime"
          value={startTime}
        />

        <Input.DateTime
          label="End Time"
          mode="time"
          field="endTime"
          value={endTime}
        />

        <Input.Select
          label="Recurring Event"
          value={isRecurring}
          onValueChange={setIsRecurring}
          options={[
            { label: 'No', value: 'false' },
            { label: 'Yes', value: 'true' },
          ]}
        />

        {isRecurring === 'true' && (
          <>
            <Input.Text
              label="Repeat Days"
              value={repeatDays}
              onChangeText={setRepeatDays}
              placeholder="Mon, Wed, Fri"
            />

            <Input.DateTime
              label="Repeat Until"
              mode="date"
              field="recurrenceEndDate"
              value={recurrenceEndDate}
              placeholder="Select Date"
            />
          </>
        )}

        <Input.Text
          label="Location Name"
          value={locationName}
          onChangeText={setLocationName}
          placeholder="North Providence High School"
        />

        <Input.Text
          label="Street Address"
          value={streetAddress}
          onChangeText={setStreetAddress}
          placeholder="123 Main St"
        />

        <Input.Text
          label="City"
          value={city}
          onChangeText={setCity}
          placeholder="Providence"
        />

        <Input.Text
          label="State"
          value={state}
          onChangeText={setState}
          placeholder="RI"
        />

        <Input.Text
          label="Zip Code"
          value={zipCode}
          onChangeText={setZipCode}
          placeholder="02911"
        />

        {eventType === 'game' && (
          <>
            <Input.Select
              label="Game Location"
              value={isHomeGame}
              onValueChange={setIsHomeGame}
              options={[
                { label: 'Home', value: 'home' },
                { label: 'Away', value: 'away' },
              ]}
            />
          </>
        )}

        <View style={{ marginTop: 16 }}>
          <AppButton onPress={handleCreate}>
            Create Event
          </AppButton>
        </View>
      </ScrollView>

      <AppSnackbar
        visible={snackbar.visible}
        variant="error"
        onDismiss={() =>
          setSnackbar({
            visible: false,
            message: '',
          })
        }
      >
        {snackbar.message}
      </AppSnackbar>
    </ScreenContainer.Scroll>
  );
};

export default CreateScheduleModal;
