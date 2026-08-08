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

          <View style={styles.statsGrid}>
            <AttendanceStat
              value={present}
              label="Present"
              backgroundColor={theme.colors.secondaryContainer}
              valueColor={theme.colors.onSecondaryContainer}
              style={styles.statCard}
            />

            {late > 0 && (
              <AttendanceStat
                value={late}
                label="Late"
                backgroundColor={theme.colors.primaryContainer}
                valueColor={theme.colors.onPrimaryContainer}
                style={styles.statCard}
              />
            )}

            <AttendanceStat
              value={absent}
              label="Absent"
              backgroundColor={theme.colors.errorContainer}
              valueColor={theme.colors.onErrorContainer}
              style={styles.statCard}
            />

            <AttendanceStat
              value={attendanceTotal}
              label="Total"
              backgroundColor={theme.colors.surfaceVariant}
              valueColor={theme.colors.onSurfaceVariant}
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
  backgroundColor: string;
  valueColor: string;
  style?: any;
};

const AttendanceStat = ({
  value,
  label,
  backgroundColor,
  valueColor,
  style,
}: AttendanceStatProps) => (
  <View style={[style, { backgroundColor }]}>
    <Text variant="headlineSmall" style={{ color: valueColor }}>
      {value}
    </Text>
    <Text variant="bodyMedium" style={{ opacity: 0.8 }}>
      {label}
    </Text>
  </View>
);

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    container: {
      gap: 8,
    },
    card: {
      borderRadius: 22,
      backgroundColor: colors.surface,
      borderColor: colors.outlineVariant,
    },
    content: {
      padding: 16,
      gap: 14,
    },
    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    iconContainer: {
      width: 68,
      height: 68,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primaryContainer,
    },
    percentageIcon: {
      color: colors.primary,
      fontSize: 22,
      fontWeight: '700',
    },
    heading: {
      color: colors.onSurface,
      fontWeight: '700',
    },
    subheading: {
      color: colors.onSurfaceVariant,
      marginTop: 2,
    },
    progressContainer: {
      flex: 1,
      gap: 6,
    },
    progressBar: {
      height: 8,
      borderRadius: 999,
      backgroundColor: colors.surfaceVariant,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    statCard: {
      flexBasis: '48%',
      minHeight: 88,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 18,
      gap: 4,
      paddingHorizontal: 8,
    },
    statLabel: {
      opacity: 0.8,
    },
  });
