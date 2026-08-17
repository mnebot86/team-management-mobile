import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ScreenContainer from '@/components/layout/Screen';
import { ScrollView, SectionList, View } from 'react-native';
import { ActivityIndicator, Chip } from 'react-native-paper';
import { router, useFocusEffect } from 'expo-router';
import AppSnackbar from '@/components/ui/SnackBar';
import { useTeamStore } from '@/hooks/useTeamStore';
import EventCard from '@/components/EventCard';
import Text from '@/components/ui/Text';
import { getTeamSchedule } from '@/api/schedule';
import { getSocket } from '@/socket';
import SegmentBar from '@/components/ui/SegmentBar';
import type { SegmentOption } from '@/components/ui/SegmentBar';
import type { SchedulePeriod, ScheduleTypeFilter } from '@/api/schedule';
import { removeDeletedSchedules, scheduleOccurrenceKey, shouldRefetchForScheduleSocket } from '@/utils/scheduleCancellation';
import { useScheduleInvalidationStore } from '@/hooks/useScheduleInvalidationStore';
import { getScheduleEmptyMessage, scheduleQueryKey } from '@/utils/scheduleFilters';
import { useAppTheme } from '@/hooks/useAppTheme';

const schedulePeriods: SegmentOption<SchedulePeriod>[] = [
  { value: 'upcoming', label: 'Upcoming', accessibilityLabel: 'Show upcoming schedule' },
  { value: 'past', label: 'Past', accessibilityLabel: 'Show past schedule' },
];

const scheduleTypes: { value: ScheduleTypeFilter; label: string; accessibilityLabel: string }[] = [
  { value: 'all', label: 'All', accessibilityLabel: 'Show all schedule types' },
  { value: 'game', label: 'Games', accessibilityLabel: 'Show games' },
  { value: 'practice', label: 'Practices', accessibilityLabel: 'Show practices' },
  { value: 'event', label: 'Events', accessibilityLabel: 'Show events' },
  { value: 'other', label: 'Other', accessibilityLabel: 'Show other schedule items' },
];

const Schedule = () => {
  const { getTeamId } = useTeamStore();

  const theme = useAppTheme();

  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [sections, setSections] = useState<any[]>([]);
  const [period, setPeriod] = useState<SchedulePeriod>('upcoming');
  const [type, setType] = useState<ScheduleTypeFilter>('all');
  const activeRequestKey = useRef('');

  const teamId = getTeamId();
  const invalidationVersion = useScheduleInvalidationStore(
    (state) => teamId ? state.versions[teamId] ?? 0 : 0,
  );
  const invalidateTeamSchedule = useScheduleInvalidationStore((state) => state.invalidateTeamSchedule);
  const queryKey = useMemo(
    () => teamId ? scheduleQueryKey(teamId, period, type).join(':') : '',
    [period, teamId, type],
  );

  const loadSchedule = useCallback(async () => {
    if (!teamId) return;

    const isNewQuery = activeRequestKey.current !== queryKey;
    activeRequestKey.current = queryKey;
    try {
      setLoading(true);
      setHasError(false);
      if (isNewQuery) setSections([]);

      const response = await getTeamSchedule(teamId, period, type);

      if (activeRequestKey.current === queryKey) setSections(response ?? []);
    } catch {
      if (activeRequestKey.current !== queryKey) return;
      setSections([]);
      setHasError(true);
      setSnackbar({
        visible: true,
        message: 'Failed to load schedule',
      });
    } finally {
      if (activeRequestKey.current === queryKey) setLoading(false);
    }
  }, [period, queryKey, teamId, type]);

  useFocusEffect(
    useCallback(() => {
      loadSchedule();
    }, [loadSchedule]),
  );

  useEffect(() => {
    if (invalidationVersion > 0) loadSchedule();
  }, [invalidationVersion, loadSchedule]);

  useEffect(() => {
    if (!teamId) return;

    try {
      const socket = getSocket();
      const handleScheduleChange = (schedule: { teamId?: string }) => {
        if (shouldRefetchForScheduleSocket(schedule.teamId, teamId)) {
          // Socket payloads are parent schedule documents, not generated
          // occurrences. Refetch so occurrence overrides remain isolated.
          invalidateTeamSchedule(teamId);
        }
      };
      const handleScheduleDeleted = (event: {
        teamId?: string;
        scheduleId: string;
        scope: 'occurrence' | 'series';
        recurrenceGroupId?: string | null;
      }) => {
        if (!shouldRefetchForScheduleSocket(event.teamId, teamId)) return;
        setSections((current) => removeDeletedSchedules(current, event));
        invalidateTeamSchedule(teamId);
      };

      socket.on('schedule.created', handleScheduleChange);
      socket.on('schedule.updated', handleScheduleChange);
      socket.on('schedule.deleted', handleScheduleDeleted);

      return () => {
        socket.off('schedule.created', handleScheduleChange);
        socket.off('schedule.updated', handleScheduleChange);
        socket.off('schedule.deleted', handleScheduleDeleted);
      };
    } catch {
      return;
    }
  }, [invalidateTeamSchedule, teamId]);


  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  const handleOnSchedulePress = (schedule: any) => {
    if (!teamId) return;

    router.push({
      pathname: '/(app)/teams/team/[teamId]/schedule/[scheduleId]',
      params: {
        teamId,
        scheduleId: schedule.scheduleId,
        schedule: JSON.stringify(schedule),
      },
    });
  };

  return (
    <ScreenContainer>
      <SectionList
        sections={sections}
        keyExtractor={(item) => scheduleOccurrenceKey(item)}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 32,
        }}
        ListHeaderComponent={
          <View style={{ gap: 12, marginBottom: 8 }}>
            <SegmentBar
              value={period}
              onValueChange={setPeriod}
              options={schedulePeriods}
            />
            <Text.Caption style={{ color: theme.colors.onSurfaceVariant }}>
              Type
            </Text.Caption>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingRight: 16 }}
            >
              {scheduleTypes.map((option) => {
                const selected = type === option.value;

                return (
                  <Chip
                    key={option.value}
                    mode={selected ? 'flat' : 'outlined'}
                    selected={selected}
                    showSelectedCheck={false}
                    accessibilityLabel={option.accessibilityLabel}
                    accessibilityState={{ selected }}
                    onPress={() => setType(option.value)}
                    style={{
                      height: 44,
                      justifyContent: 'center',
                      backgroundColor: selected
                        ? theme.colors.segment.selectedBackground
                        : theme.colors.segment.background,
                      borderColor: theme.colors.segment.border,
                    }}
                    textStyle={{
                      color: selected
                        ? theme.colors.segment.selectedText
                        : theme.colors.segment.text,
                    }}
                  >
                    {option.label}
                  </Chip>
                );
              })}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingHorizontal: 24, paddingVertical: 64 }}>
            {loading ? (
              <ActivityIndicator size="large" />
            ) : (
              <Text.Body
                style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}
              >
                {hasError
                  ? 'Unable to load the schedule.'
                  : getScheduleEmptyMessage(period, type)}
              </Text.Body>
            )}
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 24,
              marginBottom: 16,
            }}
          >
            <Text.Caption
              style={{
                textTransform: 'uppercase',
                marginRight: 12,
                color: theme.colors.outline,
              }}
            >
              {section.title}
            </Text.Caption>

            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: theme.colors.outlineVariant,
              }}
            />
          </View>
        )}
        renderItem={({ item }) => (
          <EventCard
            data={item}
            onPress={() => handleOnSchedulePress(item)}
          />
        )}
      />

      <AppSnackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        variant="error"
      >
        {snackbar.message}
      </AppSnackbar>
    </ScreenContainer>
  );
};

export default Schedule;
