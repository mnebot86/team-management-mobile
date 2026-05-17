import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

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
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="groups" size={28} color="#C9A227" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{team.name}</Text>
          <Text style={styles.subtitle}>
            {team.ageGroup} • {team.sport}
          </Text>
        </View>
      </View>

      <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F3E8C8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});

export default TeamCard;
