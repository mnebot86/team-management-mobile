import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import Text from '@/components/ui/Text';

type PlayerCardProps = {
  firstName: string;
  lastName: string;
  jerseyNumber?: number | string | null;
  positions: string[];
  imageUrl: string;
  onPress?: () => void;
};

const PlayerCard = ({ firstName, lastName, jerseyNumber, positions, imageUrl, onPress }: PlayerCardProps) => {
  const theme = useAppTheme();
  const colors = theme.colors;
  const styles = createStyles(colors);

  const displayPositions = (positions ?? []).filter(Boolean);
  const positionInitials = displayPositions.map((position) => {
    const trimmed = position.trim();
    if (/^[A-Z0-9]{1,4}$/.test(trimmed)) return trimmed;

    return trimmed
      .split(/[\s/-]+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }).filter(Boolean);
  const hasJerseyNumber = jerseyNumber !== null
    && jerseyNumber !== undefined
    && String(jerseyNumber).trim() !== '';

  return (
    <Pressable
      style={[
        styles.card,
        {
          backgroundColor: colors.card.background,
          borderColor: colors.card.border,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.leftSection}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: colors.avatar.background,
              borderColor: colors.avatar.border,
            },
          ]}
        >
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <MaterialIcons name="person" size={30} color={colors.avatar.icon} />
          )}
        </View>

        <View style={styles.textContainer}>
          <View style={styles.nameRow}>
            <Text.Subheading style={styles.nameText}>{firstName} {lastName}</Text.Subheading>
            {hasJerseyNumber && (
              <Text.Subheading style={[styles.jerseyNumber, { color: colors.text.secondary }]}>#{jerseyNumber}</Text.Subheading>
            )}
          </View>

          {positionInitials.length > 0 && (
            <View style={styles.positionRow}>
              {positionInitials.map((position, index) => (
                <View
                  key={`${position}-${index}`}
                  style={[
                    styles.positionBadge,
                    { backgroundColor: colors.avatar.background, borderColor: colors.avatar.border },
                  ]}
                >
                  <Text.Caption style={[styles.positionBadgeText, { color: colors.text.primary }]}>
                    {position}
                  </Text.Caption>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderRadius: 20,
      marginBottom: 12,
      borderWidth: 1,
      elevation: 2,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconContainer: {
      width: 88,
      height: 88,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
      borderWidth: 1,
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      borderRadius: 24,
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
      gap: 4,
    },
    nameText: {
      fontWeight: '700',
      flex: 1,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    jerseyNumber: {
      fontWeight: '700',
    },
    positionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 2,
    },
    positionBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      borderWidth: 1,
    },
    positionBadgeText: {
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
  });

export default PlayerCard;
