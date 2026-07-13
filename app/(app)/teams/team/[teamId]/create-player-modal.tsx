import React, { useCallback, useState } from 'react';
import SnackBar from '@/components/ui/SnackBar';
import ScreenContainer from '@/components/layout/Screen';
import Input from '@/components/ui/Input';
import AppButton from '@/components/ui/Button';
import AvatarPicker, { AvatarFile } from '@/components/avatar/AvatarPicker';
import { router, useFocusEffect } from 'expo-router';
import { View } from 'react-native';
import { createAndInsertPlayerToTeam } from '@/api/teamMembers';
import { useTeamStore } from '@/hooks/useTeamStore';

const CreatePlayerModal = () => {
  const { getTeamId } = useTeamStore();

  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatar, setAvatar] = useState<AvatarFile>();
  const [error, setError] = useState('');

  const disabled = React.useMemo(() => {
    return !firstName || !lastName || loading || !!error;
  }, [firstName, lastName, loading, error]);

  const handleCreatePlayer = useCallback(async () => {
    setLoading(true);

    try {
      const teamId = getTeamId();

      if (!teamId) {
        setError('No team selected');
        return;
      }

      const payload = {
        firstName,
        lastName,
        avatar,
      };

      await createAndInsertPlayerToTeam(payload, teamId as string);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create player';

      setError(message);
    } finally {
      setLoading(false);

      router.back();
    }
  }, [firstName, lastName, avatar, router]);

  const handleCancel = useCallback(() => {
    setFirstName('');
    setLastName('');
    setError('');
    setError('');

    router.back();
  }, [router]);

  return (
    <ScreenContainer>
      <AvatarPicker
        value={avatar}
        onChange={setAvatar}
      />
      <Input.Text
        label="First Name"
        placeholder="John"
        value={firstName}
        onChangeText={setFirstName}
        style={{ marginBottom: 24 }}
      />

      <Input.Text
        label="Last Name"
        placeholder="Doe"
        value={lastName}
        onChangeText={setLastName}
        style={{ marginBottom: 24 }}
      />

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
        <AppButton
          onPress={handleCancel}
          style={{ flex: 1 }}
          variant="outline"
        >
          Cancel
        </AppButton>

        <AppButton
          disabled={disabled}
          onPress={handleCreatePlayer}
          loading={loading}
          style={{ flex: 1 }}
        >
          Create Player
        </AppButton>
      </View>

      {!!error && (
        <SnackBar
          visible={true}
          onDismiss={() => setError('')}
        >
          {error}
        </SnackBar>
      )}
    </ScreenContainer>
  );
};

export default CreatePlayerModal;
