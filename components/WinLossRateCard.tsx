import { StyleSheet, View } from 'react-native';
import { Card, ProgressBar, Text } from 'react-native-paper';

import { useAppTheme } from '@/hooks/useAppTheme';

type WinLossRateCardProps = {
  wins: number;
  losses: number;
  draws?: number;
  total?: number;
  heading?: string;
  subheading?: string;
};

export const WinLossRateCard = ({
  wins,
  losses,
  draws = 0,
  total,
  heading,
  subheading,
}: WinLossRateCardProps) => {
  const theme = useAppTheme();
  const gameTotal = total ?? wins + losses + draws;
  const winRate = gameTotal > 0 ? Math.round((wins / gameTotal) * 100) : 0;
  const progress = gameTotal > 0 ? wins / gameTotal : 0;
  const styles = createStyles(theme.colors);

  return (
    <View style={styles.container}>
      <Card mode="outlined" style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <Text variant="titleLarge" style={styles.heading}>
                {heading ?? 'Win Rate'}
              </Text>

              {subheading ? (
                <Text variant="bodyLarge" style={styles.subheading}>
                  {subheading}
                </Text>
              ) : null}
            </View>

            <Text style={styles.percentage}>{winRate}%</Text>
          </View>

          <ProgressBar
            progress={progress}
            color={theme.colors.status.success}
            style={styles.progressBar}
          />

          <View style={styles.statsGrid}>
            <WinLossStat value={wins} label="Wins" accentColor={theme.colors.status.success} style={styles.statCard} />
            <WinLossStat value={losses} label="Losses" accentColor={theme.colors.status.error} style={styles.statCard} />
            <WinLossStat value={draws} label="Draws" accentColor={theme.colors.status.warning} style={styles.statCard} />
            <WinLossStat value={gameTotal} label="Total" accentColor={theme.colors.status.neutral} style={styles.statCard} />
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

type WinLossStatProps = {
  value: number;
  label: string;
  accentColor: string;
  style?: any;
};

const WinLossStat = ({ value, label, accentColor, style }: WinLossStatProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme.colors);

  return (
    <View style={style}>
      <View style={[styles.statIndicator, { backgroundColor: accentColor }]} />
      <Text variant="titleLarge" style={styles.statValue}>{value}</Text>
      <Text variant="labelSmall" style={styles.statLabel}>{label}</Text>
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    container: { gap: 8 },
    card: {
      borderRadius: 18,
      backgroundColor: colors.surface,
      borderColor: colors.outlineVariant,
    },
    content: { padding: 16, gap: 12 },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
    },
    titleContainer: { flex: 1 },
    heading: { color: colors.onSurface, fontWeight: '700', fontSize: 18 },
    subheading: { color: colors.onSurfaceVariant, marginTop: 2 },
    percentage: { color: colors.text.primary, fontSize: 24, fontWeight: '800' },
    progressBar: {
      height: 6,
      borderRadius: 999,
      backgroundColor: colors.avatar.background,
    },
    statsGrid: { flexDirection: 'row', gap: 6, paddingTop: 2 },
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
    statIndicator: { width: 18, height: 3, borderRadius: 999, marginBottom: 2 },
    statValue: { color: colors.text.primary, fontWeight: '700' },
    statLabel: { color: colors.text.secondary },
  });
