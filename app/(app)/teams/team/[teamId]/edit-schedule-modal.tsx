import React, { useMemo } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import ScreenContainer from '@/components/layout/Screen';
import ScheduleForm from '@/components/schedule/ScheduleForm';

export default function EditScheduleModal() {
  const { teamId, scheduleId, schedule: raw, editScope } = useLocalSearchParams<{ teamId: string; scheduleId: string; schedule: string; editScope?: 'occurrence' | 'series' }>();
  const schedule = useMemo(() => { try { return JSON.parse(raw); } catch { return null; } }, [raw]);
  const handleSuccess = () => {
    router.dismiss();
    router.replace({
      pathname: '/(app)/teams/team/[teamId]/(drawer)/schedule',
      params: { teamId },
    });
  };

  return <ScreenContainer.Scroll><ScheduleForm teamId={teamId} scheduleId={scheduleId} initialSchedule={schedule} editScope={editScope} onSuccess={handleSuccess} /></ScreenContainer.Scroll>;
}
