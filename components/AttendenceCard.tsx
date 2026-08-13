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
      <Card mode="outlined" style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
                <Text variant="titleLarge" style={styles.heading}>
                  {heading ?? 'Attendance Rate'}
                </Text>

                {subheading ? (
                  <Text variant="bodyLarge" style={styles.subheading}>
                    {subheading}
                  </Text>
                ) : null}
            </View>

            <Text style={styles.percentage}>{attendancePercentage}%</Text>
          </View>

          <ProgressBar
            progress={progress}
            color={theme.colors.status.success}
            style={styles.progressBar}
          />

          <View style={styles.statsGrid}>
            <AttendanceStat
              value={present}
              label="Present"
              accentColor={theme.colors.status.success}
              style={styles.statCard}
            />

            <AttendanceStat
              value={late}
              label="Late"
              accentColor={theme.colors.status.warning}
              style={styles.statCard}
            />

            <AttendanceStat
              value={absent}
              label="Absent"
              accentColor={theme.colors.status.error}
              style={styles.statCard}
            />

            <AttendanceStat
              value={attendanceTotal}
              label="Total"
              accentColor={theme.colors.status.neutral}
              style={styles.statCard}
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
  accentColor: string;
  style?: any;
};

const AttendanceStat = ({
  value,
  label,
  accentColor,
  style,
}: AttendanceStatProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme.colors);

  return (
    <View style={style}>
      <View style={[styles.statIndicator, { backgroundColor: accentColor }]} />
      <Text variant="titleLarge" style={styles.statValue}>
        {value}
      </Text>
      <Text variant="labelSmall" style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    container: {
      gap: 8,
    },
    card: {
      borderRadius: 18,
      backgroundColor: colors.surface,
      borderColor: colors.outlineVariant,
    },
    content: {
      padding: 16,
      gap: 12,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
    },
    titleContainer: {
      flex: 1,
    },
    heading: {
      color: colors.onSurface,
      fontWeight: '700',
      fontSize: 18,
    },
    subheading: {
      color: colors.onSurfaceVariant,
      marginTop: 2,
    },
    percentage: {
      color: colors.text.primary,
      fontSize: 24,
      fontWeight: '800',
    },
    progressBar: {
      height: 6,
      borderRadius: 999,
      backgroundColor: colors.avatar.background,
    },
    statsGrid: {
      flexDirection: 'row',
      gap: 6,
      paddingTop: 2,
    },
    statCard: {
      flex: 1,
      minWidth: 0,
      minHeight: 72,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
      gap: 2,
      paddingVertical: 8,
      backgroundColor: colors.avatar.background,
    },
    statIndicator: {
      width: 18,
      height: 3,
      borderRadius: 999,
      marginBottom: 2,
    },
    statValue: {
      color: colors.text.primary,
      fontWeight: '700',
    },
    statLabel: {
      color: colors.text.secondary,
    },
  });
