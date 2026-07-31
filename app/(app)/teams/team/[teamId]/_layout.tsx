import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { joinTeam, leaveTeam } from '@/socket';
import AppHeader from '@/components/AppHeader';
import { Stack } from 'expo-router';
import AppButton from '@/components/ui/Button';
import { router } from 'expo-router';

export default function TeamStackLayout() {
  const { teamId } = useLocalSearchParams<{ teamId: string }>();

  useEffect(() => {
    if (!teamId) {
      return;
    }

    // joinTeam(teamId);

    return () => {
      // leaveTeam(teamId);
    };
  }, [teamId]);

  return (
    <Stack>
      <Stack.Screen
        name="(drawer)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="player/[playerId]"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="create-schedule-modal"
        options={{
          presentation: 'modal',
          header: () => (
            <AppHeader
              title="Create Schedule Event"
            />
          ),
        }}
      />

      <Stack.Screen
        name="pick-date-modal"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.25, 0.5, 1],
          sheetInitialDetentIndex: 1,
          header: () => (
            <AppHeader
              title="Pick Date"
            />
          ),
        }}
      />

      <Stack.Screen
        name="create-plan-modal"
        options={{
          presentation: 'modal',
          header: () => (
            <AppHeader
              title="Create Practice Plan"
            />
          ),
        }}
      />

      <Stack.Screen
        name="edit-plan-modal"
        options={{
          presentation: 'modal',
          header: () => (
            <AppHeader
              title="Edit Practice Plan"
            />
          ),
        }}
      />

      <Stack.Screen
        name="plan/[planId]"
        options={{
          header: ({ navigation }) => (
            <AppHeader
              title="Practice Plan Details"
              onBackPress={() => navigation.goBack()}
            />
          ),
        }}
      />

      <Stack.Screen
        name="schedule/[scheduleId]"
        options={{
          header: ({ navigation }) => (
            <AppHeader
              title="Event Details"
              onBackPress={() => navigation.goBack()}
            />
          ),
        }}
      />

      <Stack.Screen
        name="create-player-modal"
        options={{
          presentation: 'modal',
          header: () => (
            <AppHeader
              title="Create Player"
            />
          ),
        }}
      />

      <Stack.Screen
        name="invite-code"
        options={{
          header: ({ navigation }) => (
            <AppHeader
              title="Invite Code"
              onBackPress={() => navigation.goBack()}
              headerContent={(
                <AppButton
                  icon="plus"
                  variant='header'
                  fullWidth={false}
                  compact
                  onPress={() => {
                    router.push(`/teams/team/${teamId}/create-visit-code-modal`);
                  }}
                >
                  New Code
                </AppButton>
              )}
            />
          ),
        }}
      />

      <Stack.Screen
        name="create-visit-code-modal"
        options={{
          presentation: 'modal',
          header: () => (
            <AppHeader
              title="Create Visit Code"
            />
          ),
        }}
      />
    </Stack>
  );
}
