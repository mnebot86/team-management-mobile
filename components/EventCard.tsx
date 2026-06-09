import React from 'react';
import dayjs from 'dayjs';
import { Linking, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Card, Chip, useTheme } from 'react-native-paper';
import Text from '@/components/ui/Text';
import {
  Calendar,
  ChevronRight,
  Clock3,
  Dumbbell,
  MapPin,
  Trophy,
  Users,
} from 'lucide-react-native';

export type EventType = 'practice' | 'game' | 'event';

interface EventLocation {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface ScheduleCardData {
  scheduleId: string;
  title: string;
  description: string;
  type: EventType;
  opponentName: string;
  isHomeGame: boolean;
  startDate: string;
  startTime: string;
  endTime: string;
  occurrenceStartDate: string;
  location: EventLocation;
}

interface EventCardProps {
  data: ScheduleCardData;
  onPress?: () => void;
}

const EVENT_CONFIG = {
  practice: {
    label: 'Practice',
    icon: Dumbbell,
    accent: '#000000',
    chipBackground: '#F3F4F6',
  },
  game: {
    label: 'Game',
    icon: Trophy,
    accent: '#D4AF37',
    chipBackground: '#F3E5B5',
  },
  event: {
    label: 'Team Event',
    icon: Users,
    accent: '#6B7280',
    chipBackground: '#E5E7EB',
  },
} as const;

export const EventCard = ({
  data,
  onPress,
}: EventCardProps) => {
  const theme = useTheme();
  const colors = theme.colors;

  const time = data.occurrenceStartDate ?? data.startTime ?? data.startDate;
  const endTime = data.endTime;
  const type = data.type;
  const details = data.opponentName;
  const title = data.title;
  const location = data.location?.name ?? '';

  const address = [
    data.location?.street,
    data.location?.city,
    data.location?.state,
    data.location?.zip,
  ]
    .filter(Boolean)
    .join(', ');

  const formattedDate = dayjs(time).isValid()
    ? dayjs(time).format('ddd, MMM D')
    : time;

  const formattedTimeRange = dayjs(time).isValid()
    ? `${dayjs(time).format('h:mm A')}${endTime && dayjs(endTime).isValid() ? ` - ${dayjs(endTime).format('h:mm A')}` : ''}`
    : '';

  const handleOpenMaps = async () => {
    if (!address) return;

    const encodedAddress = encodeURIComponent(address);

    const url = Platform.OS === 'ios'
      ? `maps://?q=${encodedAddress}`
      : `https://maps.google.com/?q=${encodedAddress}`;

    await Linking.openURL(url);
  };

  const displayTitle = type === 'game' && details
    ? details
    : title;
  const config = EVENT_CONFIG[type];
  const Icon = config.icon;

  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card} mode="elevated">
        <View style={styles.container}>
          <View style={styles.leftSection}>
            <View
              style={[
                styles.accentBar,
                {
                  backgroundColor: config.accent,
                },
              ]}
            />

            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: colors.surfaceVariant,
                },
              ]}
            >
              <Icon size={20} color={theme.colors.onSurface} />
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.headerRow}>
              <Text.Heading style={styles.title}>
                {displayTitle}
              </Text.Heading>

              <Chip
                compact
                style={{ backgroundColor: config.chipBackground, height: 32 }}
              >
                {config.label}
              </Chip>
            </View>

            <View style={styles.infoRow}>
              <Calendar size={18} color={colors.onSurfaceVariant} />
              <Text.Body style={[styles.infoText, { color: colors.onSurfaceVariant }]}>
                {formattedDate}
              </Text.Body>
            </View>

            <View style={styles.infoRow}>
              <Clock3 size={18} color={colors.onSurfaceVariant} />
              <Text.Body style={[styles.infoText, { color: colors.onSurfaceVariant }]}>
                {formattedTimeRange}
              </Text.Body>
            </View>

            <Pressable
              onPress={handleOpenMaps}
              disabled={!address}
              style={styles.infoRow}
            >
              <MapPin size={18} color={colors.onSurfaceVariant} />

              <Text.Body
                style={[
                  styles.infoText,
                  {
                    color: colors.primary,
                    textDecorationLine: address ? 'underline' : 'none',
                  },
                ]}
              >
                {location}
              </Text.Body>
            </Pressable>
          </View>

          <View style={styles.chevronContainer}>
            <ChevronRight size={24} color={colors.outline} />
          </View>
        </View>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 20,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 72,
    gap: 8,
  },
  chevronContainer: {
    width: 24,
    alignItems: 'flex-end',
  },
  accentBar: {
    width: 6,
    height: 80,
    borderRadius: 999,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
    marginRight: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '600',
    color: undefined,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '600',
    color: undefined,
  },
});

export default EventCard;
