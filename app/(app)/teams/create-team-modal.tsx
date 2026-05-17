import React, { useCallback, useState } from 'react';
import { createTeam } from '@/api/teams';
import SnackBar from '@/components/ui/SnackBar';
import ScreenContainer from '@/components/layout/Screen';
import Input from '@/components/ui/Input';
import AppButton from '@/components/ui/Button';
import { router } from 'expo-router';
import { View } from 'react-native';

const CreateTeamModal = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [sport, setSport] = useState('');
  const [error, setError] = useState('');

  const disabled = React.useMemo(() => {
    return !name || !ageGroup || !sport || loading || !!error;
  }, [name, ageGroup, sport, loading, error]);

  const handleCreateTeam = useCallback(async () => {
    setLoading(true);

    try {
      const payload = { name, ageGroup, sport };

      await createTeam(payload);

    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create team';

      setError(message);
    } finally {
      setLoading(false);

      router.back();
    }
  }, [name, ageGroup, sport, router]);

  const handleCancel = useCallback(() => {
    setName('');
    setAgeGroup('');
    setSport('');
    setError('');

    router.back();
  }, [router]);

  return (
    <ScreenContainer>
      <Input.Text
        label="Team Name"
        placeholder="Warriors FC"
        value={name}
        onChangeText={setName}
        style={{ marginBottom: 24 }}
      />

      <Input.Text
        label="Age Group"
        placeholder="U-12, U-15, Adult, etc."
        value={ageGroup}
        onChangeText={setAgeGroup}
        style={{ marginBottom: 24 }}
      />

      <Input.Text
        label="Sport"
        placeholder="Soccer, Basketball, etc."
        value={sport}
        onChangeText={setSport}
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
          onPress={handleCreateTeam}
          loading={loading}
          style={{ flex: 1 }}
        >
          Create Team
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

export default CreateTeamModal;
