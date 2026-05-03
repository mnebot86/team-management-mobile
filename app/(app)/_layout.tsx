import AppIcon from '@/components/AppIcon';
import React from 'react';
import { Tabs } from 'expo-router';
import AppHeader from '@/components/AppHeader';

export default function AuthLayout() {
  return (
    <Tabs>
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
