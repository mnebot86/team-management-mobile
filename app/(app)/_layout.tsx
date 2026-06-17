import AppIcon from '@/components/AppIcon';
import React from 'react';
import { Tabs } from 'expo-router';
import AppHeader from '@/components/AppHeader';
import { useAppTheme } from '@/hooks/useAppTheme';
import { getTabBarOptions } from '@/constants/navigationTheme';

export default function AuthLayout() {
  const theme = useAppTheme();

  return (
    <Tabs screenOptions={{ ...getTabBarOptions(theme) }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          header: () => (
            <AppHeader
              title="Dashboard"
              subtitle="Welcome back, Coach!"
            />
          ),
          tabBarIcon: ({ size }) => (
            <AppIcon name="view-dashboard-outline" size={size} variant="default" />
          ),
          tabBarLabel: 'Dashboard',
        }}
      />

      <Tabs.Screen
        name="teams"
        options={{
          headerShown: false,
          tabBarIcon: ({ size }) => (
            <AppIcon name="account-group-outline" size={size} variant="default" />
          ),
          tabBarLabel: 'Teams',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          header: () => (
            <AppHeader
              title="Settings"
              subtitle="Manage your account"
            />
          ),
          tabBarIcon: ({ size }) => (
            <AppIcon name="cog-outline" size={size} variant="default" />
          ),
          tabBarLabel: 'Settings',
        }}
      />
    </Tabs>
  );
}
