import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type PlayerCardProps = {
  firstName: string;
  lastName: string;
  jerseyNumber: number;
  position: string;
  age: number;
  imageUrl: string;
  onPress?: () => void;
};

const PlayerCard = ({ firstName, lastName, jerseyNumber, position, age, imageUrl, onPress }: PlayerCardProps) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <MaterialIcons name="person" size={28} color="#C9A227" />
          )}
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{firstName} {lastName}</Text>
          <Text style={styles.subtitle}>
            #{jerseyNumber} • {position} • Age {age}
          </Text>
        </View>
      </View>
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
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
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

export default PlayerCard;
