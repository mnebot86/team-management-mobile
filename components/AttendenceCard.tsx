import { StyleSheet, View } from 'react-native';
import { Card, ProgressBar, Text } from 'react-native-paper';

import { useAppTheme } from '@/hooks/useAppTheme';

type AttendanceCardProps = {
  present: number;
  absent: number;
  total?: number;
  late?: number;
  heading?: string;
  subheading?: string;
};

export const AttendanceCard = ({
  present,
  absent,
  total,
  late = 0,
  heading,
  subheading,
}: AttendanceCardProps) => {
  const theme = useAppTheme();

  const attendanceTotal = total ?? present + late + absent;
  const attendancePercentage = attendanceTotal > 0
    ? Math.round((present / attendanceTotal) * 100)
    : 0;
  const progress = attendanceTotal > 0
    ? present / attendanceTotal
    : 0;

  const styles = createStyles(theme.colors);

  return (
    <View style={styles.container}>
      <Card mode="elevated" style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.summaryRow}>
            <View style={styles.iconContainer}>
              <Text style={styles.percentageIcon}>
                {attendancePercentage}%
              </Text>
            </View>

            <View style={styles.progressContainer}>
              <View>
                <Text variant="titleLarge" style={styles.heading}>
                  {heading ?? 'Attendance Rate'}
                </Text>

                {subheading ? (
                  <Text variant="bodyLarge" style={styles.subheading}>
                    {subheading}
                  </Text>
                ) : null}
              </View>

              <ProgressBar
                progress={progress}
                color={theme.colors.primary}
                style={styles.progressBar}
              />
            </View>
          </View>

          <View style={styles.statsRow}>
            <AttendanceStat
              value={present}
              label="Present"
              backgroundColor={theme.colors.secondaryContainer}
              valueColor={theme.colors.primary}
            />

            {late > 0 && (
              <AttendanceStat
                value={late}
                label="Late"
                backgroundColor={theme.colors.primaryContainer}
                valueColor={theme.colors.primary}
              />
            )}

            <AttendanceStat
              value={absent}
              label="Absent"
              backgroundColor={theme.colors.errorContainer}
              valueColor={theme.colors.error}
            />

            <AttendanceStat
              value={attendanceTotal}
              label="Total"
              backgroundColor={theme.colors.surfaceVariant}
              valueColor={theme.colors.onSurface}
            />
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

type AttendanceStatProps = {
  value: number;
  label: string;
  backgroundColor: string;
  valueColor: string;
};

const AttendanceStat = ({
  value,
  label,
  backgroundColor,
  valueColor,
}: AttendanceStatProps) => (
  <View style={[styles.statCard, { backgroundColor }]}>
    <Text variant="headlineSmall" style={{ color: valueColor }}>
      {value}
    </Text>
    <Text variant="bodyLarge" style={styles.statLabel}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    gap: 4,
  },
  statLabel: {
    opacity: 0.7,
  },
});

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    container: {
      gap: 8,
    },
    title: {
      color: colors.onSurfaceVariant,
      letterSpacing: 1.5,
      fontSize: 14,
    },
    card: {
      borderRadius: 20,
      backgroundColor: colors.surface,
    },
    content: {
      padding: 14,
      gap: 12,
    },
    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primaryContainer,
    },
    percentageIcon: {
      color: colors.primary,
      fontSize: 20,
      fontWeight: '600',
    },
    heading: {
      color: colors.onSurface,
      fontWeight: '600',
    },
    subheading: {
      color: colors.onSurfaceVariant,
      marginTop: 2,
    },
    progressContainer: {
      flex: 1,
      gap: 4,
    },
    progressBar: {
      height: 6,
      borderRadius: 4,
      backgroundColor: colors.surfaceVariant,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 8,
    },
  });
