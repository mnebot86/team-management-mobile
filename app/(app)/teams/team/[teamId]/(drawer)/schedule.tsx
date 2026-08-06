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
    if (!teamId) return;

    try {
      const socket = getSocket();
      const handleScheduleChange = (schedule: { teamId?: string }) => {
        if (!schedule.teamId || schedule.teamId === teamId) {
          loadSchedule();
        }
      };

      socket.on('schedule.created', handleScheduleChange);
      socket.on('schedule.updated', handleScheduleChange);

      return () => {
        socket.off('schedule.created', handleScheduleChange);
        socket.off('schedule.updated', handleScheduleChange);
      };
    } catch {
      return;
    }
  }, [loadSchedule, teamId]);


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
        scheduleId: schedule.scheduleId ?? schedule._id,
        schedule: JSON.stringify(schedule),
      },
    });
  };

  return (
    <ScreenContainer>
      <SectionList
        sections={sections}
        keyExtractor={(item) =>
          `${item.scheduleId ?? item._id}-${item.occurrenceStartDate ?? item.startDate}`
        }
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
