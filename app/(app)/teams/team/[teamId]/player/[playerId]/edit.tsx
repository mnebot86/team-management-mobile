import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from 'react-native-paper';

import ScreenContainer from '@/components/layout/Screen';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SnackBar from '@/components/ui/SnackBar';
import AvatarPicker, { AvatarFile } from '@/components/avatar/AvatarPicker';
import { editTeamMember, getTeamMember } from '@/api/teamMembers';

const EditPlayerScreen = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  const { teamId, playerId } = useLocalSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [positions, setPositions] = useState('');
  const [avatar, setAvatar] = useState<AvatarFile>();
  const [avatarPublicId, setAvatarPublicId] = useState('');

  useEffect(() => {
    const fetchPlayer = async () => {
      setIsLoading(true);

      if (!teamId || !playerId) {
        setError('Missing player information');
        setIsLoading(false);
        return;
      }

      try {
        const player = await getTeamMember(teamId as string, playerId as string);

        setFirstName(player?.firstName || '');
        setLastName(player?.lastName || '');
        setJerseyNumber(player?.jerseyNumber?.toString() || '');
        setPositions(player?.positions || '');

        if (player?.avatar) {
          setAvatar(player.avatar);
          setAvatarPublicId(player.avatar.publicId || '');
        }
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load player';

        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayer();
  }, [playerId, teamId]);

  const handleSave = async () => {
    if (!firstName.trim()) {
      setError('First name is required');
      return;
    }

    if (!lastName.trim()) {
      setError('Last name is required');
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        firstName,
        lastName,
        jerseyNumber,
        positions,
        avatar,
        avatarPublicId,
      };

      await editTeamMember(payload, teamId as string, playerId as string);

      router.back();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update player';

      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer.Centered>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
        />
      </ScreenContainer.Centered>
    );
  }

  return (
    <ScreenContainer.Scroll>
      <View style={styles.container}>
        <View style={styles.formCard}>
          <AvatarPicker
            value={avatar}
            onChange={setAvatar}
            size={140}
          />

          <Input.Text
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />

          <Input.Text
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />

          <Input.Text
            label="Jersey Number"
            value={jerseyNumber}
            onChangeText={setJerseyNumber}
            keyboardType="numeric"
          />

          <Input.Text
            label="Position"
            value={positions}
            onChangeText={setPositions}
          />

          <Button
            loading={isSaving}
            onPress={handleSave}>
            Save Changes
          </Button>
        </View>
      </View>

      {!!error && (
        <SnackBar
          visible={true}
          onDismiss={() => setError('')}>
          {error}
        </SnackBar>
      )}
    </ScreenContainer.Scroll>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      padding: 16,
      gap: 20,
    },
    headerSection: {
      gap: 6,
    },
    formCard: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 20,
      gap: 18,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
  });

export default EditPlayerScreen;
