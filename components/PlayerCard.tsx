import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import Text from '@/components/ui/Text';

type PlayerCardProps = {
  firstName: string;
  lastName: string;
  jerseyNumber: number;
  positions: string[];
  imageUrl: string;
  onPress?: () => void;
};

const PlayerCard = ({ firstName, lastName, jerseyNumber, positions, imageUrl, onPress }: PlayerCardProps) => {
  const theme = useAppTheme();
  const colors = theme.colors;
  const styles = createStyles(colors);

  const displayPositions = (positions ?? []).filter(Boolean);
  const primaryPosition = displayPositions[0] ?? 'Unassigned';
  const secondaryPositions = displayPositions.slice(1);

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
          <Text.Subheading style={styles.nameText}>{firstName} {lastName}</Text.Subheading>
          <Text.Caption style={styles.metaText}>#{jerseyNumber}</Text.Caption>

          <View style={styles.positionRow}>
            <View style={[styles.positionBadge, { backgroundColor: colors.primaryContainer }]}>
              <Text.Caption style={[styles.positionBadgeText, { color: colors.onPrimaryContainer }]}>
                {primaryPosition}
              </Text.Caption>
            </View>

            {secondaryPositions.length > 0 ? (
              <Text.Caption style={styles.positionText}>{secondaryPositions.join(' • ')}</Text.Caption>
            ) : null}
          </View>
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
      width: 68,
      height: 68,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
      borderWidth: 1,
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      borderRadius: 20,
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
      gap: 4,
    },
    nameText: {
      fontWeight: '700',
    },
    metaText: {
      color: colors.onSurfaceVariant,
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
    },
    positionBadgeText: {
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    positionText: {
      color: colors.onSurfaceVariant,
    },
  });

export default PlayerCard;
