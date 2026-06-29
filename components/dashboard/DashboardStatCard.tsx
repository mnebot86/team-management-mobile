import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface } from 'react-native-paper';

import AppIcon from '@/components/AppIcon';
import Text from '@/components/ui/Text';
import { useAppTheme } from '@/hooks/useAppTheme';

type DashboardStatCardProps = {
  value: string | number;
  label: string;
  icon: string;
  highlighted?: boolean;
};

export default function DashboardStatCard({
  value,
  label,
  icon,
  highlighted = false,
}: DashboardStatCardProps) {
  const theme = useAppTheme();

  return (
    <Surface
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
        },
      ]}
      elevation={1}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: highlighted
              ? theme.colors.primaryContainer
              : theme.colors.surfaceVariant,
          },
        ]}
      >
        <AppIcon
          name={icon}
          variant={highlighted ? 'accent' : 'default'}
          size={28}
        />
      </View>

      <Text.Heading style={styles.value}>
        {value}
      </Text.Heading>

      <Text.Subheading
        style={[
          styles.label,
          { color: theme.colors.onSurfaceVariant },
        ]}
      >
        {label}
      </Text.Subheading>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginBottom: 12
  },
  value: {
    fontSize: 24,
    marginBottom: 4
  },
  label: {
    fontSize: 14
  },
});
