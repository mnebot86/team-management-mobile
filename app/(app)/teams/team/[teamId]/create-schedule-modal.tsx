import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import ScreenContainer from '@/components/layout/Screen';
import ScheduleForm from '@/components/schedule/ScheduleForm';

export default function CreateScheduleModal() {
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  return <ScreenContainer.Scroll><ScheduleForm teamId={teamId} onSuccess={() => router.back()} /></ScreenContainer.Scroll>;
}
