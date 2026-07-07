import AppHeader from '@/components/AppHeader';
import { Stack } from 'expo-router';

export default function TeamStackLayout() {
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
    </Stack>
  );
}
