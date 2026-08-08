import React from 'react';
import AppHeader from '@/components/AppHeader';
import { router, useLocalSearchParams } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import AppButton from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import { getDrawerOptions } from '@/constants/navigationTheme';
import { useAppTheme } from '@/hooks/useAppTheme';

export const TeamDashboardLayout = () => {
  const theme = useAppTheme();
  const { teamId } = useLocalSearchParams<{ teamId: string }>();

  return (
    <Drawer screenOptions={{ ...getDrawerOptions(theme) }}>
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Dashboard',
          header: ({ options, navigation }) => (
            <AppHeader
              title={(options.title as string) ?? 'Team'}
              subtitle={(options as any).headerSubtitle ?? ''}
              onBackPress={() => navigation.goBack()}
              onMenuPress={() => navigation.toggleDrawer()}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="roster"
        options={{
          drawerLabel: 'Roster',
          header: ({ navigation }) => (
            <AppHeader
              title='Roster'
              subtitle='Manager your players'
              onMenuPress={() => navigation.toggleDrawer()}
              headerContent={(
                <AppButton
                  icon="plus"
                  variant='header'
                  fullWidth={false}
                  compact
                  onPress={() => {
                    router.push('/(app)/teams/team/[teamId]/create-player-modal');
                  }}
                >
                  New Player
                </AppButton>
              )}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="schedule"
        options={{
          drawerLabel: 'Schedule',
          header: ({ navigation }) => (
            <AppHeader
              title='Schedule'
              subtitle='Manager your events'
              onMenuPress={() => navigation.toggleDrawer()}
              headerContent={(
                <AppButton
                  icon="plus"
                  variant='header'
                  fullWidth={false}
                  compact
                  onPress={() => {
                    router.push(`/(app)/teams/team/${teamId}/create-schedule-modal`);
                  }}
                >
                  New Event
                </AppButton>
              )}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="plans"
        options={{
          drawerLabel: 'Plans',
          header: ({ navigation }) => (
            <AppHeader
              title='Plans'
              subtitle='Manager your plans'
              onMenuPress={() => navigation.toggleDrawer()}
              headerContent={(
                <AppButton
                  icon="plus"
                  variant='header'
                  fullWidth={false}
                  compact
                  onPress={() => {
                    router.push(`/teams/team/${teamId}/create-plan-modal`);
                  }}
                >
                  New Plan
                </AppButton>
              )}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="deptCharts"
        options={{
          drawerLabel: 'Dept Charts',
          header: ({ navigation }) => (
            <AppHeader
              title='Dept Charts'
              onMenuPress={() => navigation.toggleDrawer()}
              headerContent={(
                <IconButton
                  icon="plus"
                  accessibilityLabel="Create depth chart"
                  size={24}
                  onPress={() => {
                    router.push(`/teams/team/${teamId}/create-dept-chart`);
                  }}
                />
              )}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: 'Settings',
          header: ({ navigation }) => (
            <AppHeader
              title='Settings'
              subtitle='Configure your team'
              onMenuPress={() => navigation.toggleDrawer()}
            />
          ),
        }}
      />
    </Drawer>
  );
}

export default TeamDashboardLayout;
