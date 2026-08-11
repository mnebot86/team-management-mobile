import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { createSchedule, ScheduleEventType, ScheduleMutationScope, updateSchedule } from '@/api/schedule';
import { buildUpdatePayload } from '@/utils/scheduleCancellation';
import { useDateTimeStore } from '@/hooks/useDateTimeStore';
import AppButton from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AppSnackbar from '@/components/ui/SnackBar';
import Text from '@/components/ui/Text';
import { useScheduleInvalidationStore } from '@/hooks/useScheduleInvalidationStore';

const dayMap: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type Props = {
  teamId: string;
  scheduleId?: string;
  initialSchedule?: any;
  editScope?: ScheduleMutationScope;
  onSuccess: (schedule: any) => void;
};

const asDate = (value?: string | Date | null) => value ? new Date(value) : undefined;
const iso = (value?: Date) => value?.toISOString();

export default function ScheduleForm({ teamId, scheduleId, initialSchedule, editScope, onSuccess }: Props) {
  const isEdit = Boolean(scheduleId);
  const initialType = initialSchedule?.eventType ?? initialSchedule?.type ?? 'practice';
  const initialRecurrence = initialSchedule?.recurrence;
  const initialLocation = initialSchedule?.location ?? {};

  const [title, setTitle] = useState(initialSchedule?.title ?? '');
  const [eventType, setEventType] = useState<ScheduleEventType>(initialType);
  const [description, setDescription] = useState(initialSchedule?.description ?? '');
  const [isRecurring, setIsRecurring] = useState(String(Boolean(initialRecurrence?.isRecurring)));
  const [frequency, setFrequency] = useState(String(initialRecurrence?.frequency ?? 'weekly'));
  const [isHomeGame, setIsHomeGame] = useState(initialSchedule?.isHomeGame === false ? 'away' : 'home');
  const [repeatDays, setRepeatDays] = useState(
    ((initialRecurrence?.daysOfWeek ?? []) as number[]).map((day: number) => dayNames[day]).join(', '),
  );
  const [locationName, setLocationName] = useState(initialSchedule?.locationName ?? initialLocation.name ?? '');
  const [streetAddress, setStreetAddress] = useState(initialSchedule?.streetAddress ?? initialLocation.street ?? '');
  const [city, setCity] = useState(initialSchedule?.city ?? initialLocation.city ?? '');
  const [state, setState] = useState(initialSchedule?.state ?? initialLocation.state ?? '');
  const [zipCode, setZipCode] = useState(initialSchedule?.zipCode ?? initialLocation.zip ?? '');
  const [opponentName, setOpponentName] = useState(initialSchedule?.opponentName ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const invalidateTeamSchedule = useScheduleInvalidationStore((state) => state.invalidateTeamSchedule);

  const { startDate, startTime, endTime, recurrenceEndDate, setField, reset } = useDateTimeStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const occurrenceDate = initialSchedule?.startDate ?? initialSchedule?.occurrenceStartDate;
    const fields = [
      ['startDate', occurrenceDate],
      ['startTime', initialSchedule?.startTime ?? occurrenceDate],
      ['endTime', initialSchedule?.endTime],
      ['recurrenceEndDate', initialRecurrence?.endDate],
    ] as const;
    fields.forEach(([field, value]) => {
      const date = asDate(value);
      if (date && !Number.isNaN(date.getTime())) setField(field, date);
    });
  }, [initialRecurrence?.endDate, initialSchedule, setField]);

  const original = useMemo(() => ({
    title: initialSchedule?.title ?? '',
    description: initialSchedule?.description ?? '',
    eventType: initialType,
    opponentName: initialSchedule?.opponentName ?? null,
    isHomeGame: initialSchedule?.isHomeGame ?? null,
    startDate: asDate(initialSchedule?.startDate ?? initialSchedule?.occurrenceStartDate)?.toISOString(),
    startTime: asDate(initialSchedule?.startTime ?? initialSchedule?.occurrenceStartDate)?.toISOString(),
    endTime: asDate(initialSchedule?.endTime)?.toISOString(),
    locationName: initialSchedule?.locationName ?? initialLocation.name ?? '',
    streetAddress: initialSchedule?.streetAddress ?? initialLocation.street ?? '',
    city: initialSchedule?.city ?? initialLocation.city ?? '',
    state: initialSchedule?.state ?? initialLocation.state ?? '',
    zipCode: initialSchedule?.zipCode ?? initialLocation.zip ?? '',
    recurrence: {
      isRecurring: Boolean(initialRecurrence?.isRecurring),
      frequency: initialRecurrence?.frequency ?? null,
      daysOfWeek: initialRecurrence?.daysOfWeek ?? [],
      endDate: asDate(initialRecurrence?.endDate)?.toISOString() ?? null,
    },
  }), [initialLocation, initialRecurrence, initialSchedule, initialType]);

  const handleSubmit = async () => {
    const daysOfWeek = repeatDays.split(',').map((day) => dayMap[day.trim()]).filter((day) => day !== undefined);
    const recurring = isRecurring === 'true';
    const values = {
      title,
      description,
      eventType,
      opponentName: eventType === 'game' ? opponentName || null : null,
      isHomeGame: eventType === 'game' ? isHomeGame === 'home' : null,
      startDate: iso(startDate), startTime: iso(startTime), endTime: iso(endTime),
      locationName, streetAddress, city, state, zipCode,
      recurrence: {
        isRecurring: recurring,
        frequency: recurring ? frequency as 'daily' | 'weekly' | 'monthly' : null,
        daysOfWeek: recurring && frequency === 'weekly' ? daysOfWeek : [],
        endDate: recurring ? iso(recurrenceEndDate) ?? null : null,
      },
    };

    setSaving(true);
    setError('');
    try {
      let result;
      if (isEdit && scheduleId) {
        const changed = Object.fromEntries(Object.entries(values).filter(([key, value]) =>
          JSON.stringify(value) !== JSON.stringify(original[key as keyof typeof original]),
        ));
        if (Object.keys(changed).length === 0) return onSuccess(initialSchedule);
        const payload = buildUpdatePayload({
          changed,
          isRecurring: Boolean(initialRecurrence?.isRecurring),
          scope: editScope ?? null,
          recurrenceDate: initialSchedule.recurrenceDate ?? '',
          isMaterialized: Boolean(initialSchedule.recurrenceGroupId),
        });
        result = await updateSchedule(scheduleId, payload);
      } else {
        result = await createSchedule({ teamId, ...values });
      }
      reset();
      invalidateTeamSchedule(teamId);
      onSuccess(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Unable to ${isEdit ? 'update' : 'create'} event.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {isEdit && initialRecurrence?.isRecurring && (
          <View style={{ padding: 12, borderRadius: 8, backgroundColor: '#FFF3CD' }}>
            <Text.Body>
              {editScope === 'occurrence'
                ? 'Only this event will be updated. Its recurrence rule will not change.'
                : 'All events in this recurring series will be updated.'}
            </Text.Body>
          </View>
        )}
        <Input.Select label="Event Type" value={eventType} onValueChange={(v) => setEventType(v as ScheduleEventType)} options={[
          { label: 'Practice', value: 'practice' }, { label: 'Game', value: 'game' },
          { label: 'Team Event', value: 'event' }, { label: 'Other', value: 'other' },
        ]} />
        {eventType === 'game' ? <Input.Text label="Opponent" value={opponentName} onChangeText={setOpponentName} /> : <Input.Text label="Event Title" value={title} onChangeText={setTitle} />}
        <Input.Text label="Description" value={description} onChangeText={setDescription} multiline numberOfLines={3} />
        <Input.DateTime label="Start Date" mode="date" field="startDate" value={startDate} />
        <Input.DateTime label="Start Time" mode="time" field="startTime" value={startTime} />
        <Input.DateTime label="End Time" mode="time" field="endTime" value={endTime} />
        {editScope !== 'occurrence' && <Input.Select label="Recurring Event" value={isRecurring} onValueChange={setIsRecurring} options={[{ label: 'No', value: 'false' }, { label: 'Yes', value: 'true' }]} />}
        {editScope !== 'occurrence' && isRecurring === 'true' && <>
          <Input.Select label="Frequency" value={frequency} onValueChange={setFrequency} options={[{ label: 'Daily', value: 'daily' }, { label: 'Weekly', value: 'weekly' }, { label: 'Monthly', value: 'monthly' }]} />
          {frequency === 'weekly' && <Input.Text label="Repeat Days" value={repeatDays} onChangeText={setRepeatDays} placeholder="Mon, Wed, Fri" />}
          <Input.DateTime label="Repeat Until" mode="date" field="recurrenceEndDate" value={recurrenceEndDate} />
        </>}
        <Input.Text label="Location Name" value={locationName} onChangeText={setLocationName} />
        <Input.Text label="Street Address" value={streetAddress} onChangeText={setStreetAddress} />
        <Input.Text label="City" value={city} onChangeText={setCity} />
        <Input.Text label="State" value={state} onChangeText={setState} />
        <Input.Text label="Zip Code" value={zipCode} onChangeText={setZipCode} />
        {eventType === 'game' && <Input.Select label="Game Location" value={isHomeGame} onValueChange={setIsHomeGame} options={[{ label: 'Home', value: 'home' }, { label: 'Away', value: 'away' }]} />}
        <AppButton onPress={handleSubmit} loading={saving} disabled={saving}>{isEdit ? 'Save Changes' : 'Create Event'}</AppButton>
      </ScrollView>
      <AppSnackbar visible={Boolean(error)} variant="error" onDismiss={() => setError('')}>{error}</AppSnackbar>
    </>
  );
}
