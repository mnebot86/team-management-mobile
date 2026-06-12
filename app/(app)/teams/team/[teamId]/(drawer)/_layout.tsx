import React from 'react';
import AppHeader from '@/components/AppHeader';
import { router, useLocalSearchParams } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import AppButton from '@/components/ui/Button';

export const TeamDashboardLayout = () => {
  const { teamId } = useLocalSearchParams<{ teamId: string }>();

  return (
    <Drawer>
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
    </Drawer>
  );
}

export default TeamDashboardLayout;
