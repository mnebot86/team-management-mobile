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
  age: number;
  imageUrl: string;
  onPress?: () => void;
};

const PlayerCard = ({ firstName, lastName, jerseyNumber, positions, age, imageUrl, onPress }: PlayerCardProps) => {
  const theme = useAppTheme();
  const colors = theme.colors;

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
            <MaterialIcons name="person" size={28} color={colors.avatar.icon} />
          )}
        </View>

        <View style={styles.textContainer}>
          <Text.Subheading>{firstName} {lastName}</Text.Subheading>
          <Text.Caption>
            #{jerseyNumber} • {positions?.join(', ')} • Age {age}
          </Text.Caption>
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
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  textContainer: {
    justifyContent: 'center',
  },
});

export default PlayerCard;
