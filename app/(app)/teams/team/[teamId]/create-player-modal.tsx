import React, { useCallback, useState } from 'react';
import SnackBar from '@/components/ui/SnackBar';
import ScreenContainer from '@/components/layout/Screen';
import Input from '@/components/ui/Input';
import AppButton from '@/components/ui/Button';
import { router } from 'expo-router';
import { View } from 'react-native';
import { createAndInsertPlayerToTeam } from '@/api/teamMembers';
import { useLocalSearchParams } from 'expo-router';

const CreatePlayerModal = () => {
  const { teamId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const disabled = React.useMemo(() => {
    return !firstName || !lastName || loading || !!error;
  }, [firstName, lastName, loading, error]);

  const handleCreatePlayer = useCallback(async () => {
    setLoading(true);

    try {
      if (!teamId) {
        setError('No team selected');
        return;
      }

      const payload = { firstName, lastName };

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
  }, [firstName, lastName, router]);

  const handleCancel = useCallback(() => {
    setFirstName('');
    setLastName('');
    setError('');
    setError('');

    router.back();
  }, [router]);

  return (
    <ScreenContainer>
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
