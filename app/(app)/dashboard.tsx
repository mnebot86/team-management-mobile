import React from 'react';
import { StyleSheet, View } from 'react-native';

import ScreenContainer from '@/components/layout/Screen';
import Text from '@/components/ui/Text';
import DashboardStatCard from '@/components/dashboard/DashboardStatCard';

const stats = [
  {
    id: 'teams',
    value: 3,
    label: 'Active Teams',
    icon: 'account-group-outline',
    highlighted: true,
  },
  {
    id: 'events',
    value: 5,
    label: 'Upcoming Events',
    icon: 'calendar-month-outline',
  },
  {
    id: 'players',
    value: 24,
    label: 'Total Players',
    icon: 'trophy-outline',
    highlighted: true,
  },
  {
    id: 'plans',
    value: 8,
    label: 'Practice Plans',
    icon: 'clipboard-text-outline',
  },
];

const Dashboard = () => {
  return (
    <ScreenContainer>
      <Text.Heading>Welcome Back 👋</Text.Heading>

      <Text.Body style={styles.subtitle}>
        Here's a quick look at your teams.
      </Text.Body>

      <View style={styles.grid}>
        {stats.map((stat) => (
          <View key={stat.id} style={styles.cardContainer}>
            <DashboardStatCard {...stat} />
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  cardContainer: {
    width: '48%',
    marginBottom: 16,
  },
});

export default Dashboard;
