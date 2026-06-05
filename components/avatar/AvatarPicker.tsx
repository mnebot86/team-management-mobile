import React from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Text, useTheme } from 'react-native-paper';
import AvatarImage from './AvatarImage';

export interface AvatarFile {
  uri: string;
  name: string;
  type: string;
}

interface AvatarPickerProps {
  value?: AvatarFile | string;
  onChange: (image?: AvatarFile) => void;
  size?: number;
}

const AvatarPicker = ({
  value,
  onChange,
  size = 120,
}: AvatarPickerProps) => {
  const theme = useTheme();

  const handleOpenOptions = () => {
    Alert.alert('Profile Photo', 'Choose an option', [
      {
        text: 'Take Photo',
        onPress: handleTakePhoto,
      },
      {
        text: 'Choose From Library',
        onPress: handleChooseFromLibrary,
      },
      ...(value
        ? [
          {
            text: 'Remove Photo',
            style: 'destructive' as const,
            onPress: () => onChange(undefined),
          },
        ]
        : []),
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission Required', 'Camera permission is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];

    onChange({
      uri: asset.uri,
      name: asset.fileName || `avatar-${Date.now()}.jpg`,
      type: asset.mimeType || 'image/jpeg',
    });
  };

  const handleChooseFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission Required', 'Photo library permission is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];

    onChange({
      uri: asset.uri,
      name: asset.fileName || `avatar-${Date.now()}.jpg`,
      type: asset.mimeType || 'image/jpeg',
    });
  };

  const imageUrl = typeof value === 'string'
    ? value
    : value?.uri;

  return (
    <View style={styles.container}>
      <Pressable onPress={handleOpenOptions}>
        <AvatarImage
          imageUrl={imageUrl}
          size={size}
        />
      </Pressable>

      <Text
        variant="bodyMedium"
        style={[styles.label, { color: theme.colors.primary }]}
        onPress={handleOpenOptions}>
        Add Photo
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontWeight: '600',
  },
});

export default AvatarPicker;
