import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import { AvatarImageProps } from './types';

const AvatarImage = ({ imageUrl, size = 120 }: AvatarImageProps) => {
  const theme = useAppTheme();

  const styles = createStyles(size, theme.colors);

  return (
    <View style={styles.container}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderContainer}>
          <MaterialCommunityIcons
            name="account"
            size={size * 0.45}
            color={theme.colors.avatar.icon}
          />
        </View>
      )}
    </View>
  );
};

const createStyles = (
  size: number,
  colors: {
    avatar: {
      background: string;
      border: string;
      icon: string;
    };
  },
) =>
  StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: size / 2,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: colors.avatar.border,
      backgroundColor: colors.avatar.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    placeholderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default AvatarImage;
