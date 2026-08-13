import React, { useCallback, useEffect, useState } from 'react';
import ScreenContainer from '@/components/layout/Screen';
import { SectionList, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import AppSnackbar from '@/components/ui/SnackBar';
import { useTeamStore } from '@/hooks/useTeamStore';
import EventCard from '@/components/EventCard';
import Text from '@/components/ui/Text';
import { useTheme } from 'react-native-paper';
import { getTeamSchedule } from '@/api/schedule';
import { getSocket } from '@/socket';
import SegmentBar from '@/components/ui/SegmentBar';
import type { SegmentOption } from '@/components/ui/SegmentBar';
import type { SchedulePeriod } from '@/api/schedule';
import { removeDeletedSchedules, scheduleOccurrenceKey, shouldRefetchForScheduleSocket } from '@/utils/scheduleCancellation';
import { useScheduleInvalidationStore } from '@/hooks/useScheduleInvalidationStore';

const schedulePeriods: SegmentOption<SchedulePeriod>[] = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
];

const Schedule = () => {
  const { getTeamId } = useTeamStore();

  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<any[]>([]);
  const [period, setPeriod] = useState<SchedulePeriod>('upcoming');

  const teamId = getTeamId();
  const invalidationVersion = useScheduleInvalidationStore(
    (state) => teamId ? state.versions[teamId] ?? 0 : 0,
  );
  const invalidateTeamSchedule = useScheduleInvalidationStore((state) => state.invalidateTeamSchedule);

  const loadSchedule = useCallback(async () => {
    if (!teamId) return;

    try {
      setLoading(true);

      const response = await getTeamSchedule(teamId, period);

      setSections(response ?? []);
    } catch {
      setSnackbar({
        visible: true,
        message: 'Failed to load schedule',
      });
    } finally {
      setLoading(false);
    }
  }, [period, teamId]);

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
          <SegmentBar
            value={period}
            onValueChange={setPeriod}
            options={schedulePeriods}
          />
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
