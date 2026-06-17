import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import Text from '@/components/ui/Text';

type TeamCardProps = {
  team: {
    _id: string;
    name: string;
    sport: string;
    role?: string;
    memberCount?: number;
    ageGroup: string
  };
  onPress?: () => void;
  empty?: boolean;
};

const TeamCard = ({ team, onPress, empty }: TeamCardProps) => {
  const theme = useAppTheme();
  return (
    <Pressable
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card.background,
          borderColor: theme.colors.card.border,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.leftSection}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: theme.colors.avatar.background,
              borderColor: theme.colors.avatar.border,
            },
          ]}
        >
          <MaterialIcons
            name="groups"
            size={28}
            color={theme.colors.avatar.icon}
          />
        </View>

        <View style={styles.textContainer}>
          <Text.Subheading>{team.name}</Text.Subheading>
          <Text.Caption>
            {team.ageGroup} • {team.sport}
          </Text.Caption>
        </View>
      </View>

      <MaterialIcons
        name="chevron-right"
        size={24}
        color={theme.colors.icon.secondary}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 12,
  },
  textContainer: {
    justifyContent: 'center',
  },
});

export default TeamCard;
