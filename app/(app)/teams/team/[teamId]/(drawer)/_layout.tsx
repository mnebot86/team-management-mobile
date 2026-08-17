import React from 'react';
import AppHeader from '@/components/AppHeader';
import { router, useLocalSearchParams } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
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
              onMenuPress={() => navigation.toggleDrawer()}
              headerContent={(
                <IconButton
                  icon="plus"
                  accessibilityLabel="Create player"
                  size={24}
                  onPress={() => {
                    router.push('/(app)/teams/team/[teamId]/create-player-modal');
                  }}
                />
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
              onMenuPress={() => navigation.toggleDrawer()}
              headerContent={(
                <IconButton
                  icon="plus"
                  accessibilityLabel="Create schedule event"
                  size={24}
                  onPress={() => {
                    router.push(`/(app)/teams/team/${teamId}/create-schedule-modal`);
                  }}
                />
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
              onMenuPress={() => navigation.toggleDrawer()}
              headerContent={(
                <IconButton
                  icon="plus"
                  accessibilityLabel="Create practice plan"
                  size={24}
                  onPress={() => {
                    router.push(`/teams/team/${teamId}/create-plan-modal`);
                  }}
                />
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
              onMenuPress={() => navigation.toggleDrawer()}
            />
          ),
        }}
      />
    </Drawer>
  );
}

export default TeamDashboardLayout;
