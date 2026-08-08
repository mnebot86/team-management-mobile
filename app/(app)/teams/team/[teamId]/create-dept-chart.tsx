import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  createDeptChart,
  type CreateDeptChartPayload,
} from '@/api/deptCharts';
import ScreenContainer from '@/components/layout/Screen';
import AppButton from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AppSnackbar from '@/components/ui/SnackBar';

const CreateDeptChartModal = () => {
  const { teamId } = useLocalSearchParams<{ teamId: string }>();

  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const handleCreate = useCallback(async () => {
    const trimmedName = name.trim();

    if (!teamId) {
      setSnackbar({
        visible: true,
        message: 'A team is required to create a dept chart.',
      });
      return;
    }

    if (!trimmedName) {
      setSnackbar({
        visible: true,
        message: 'Please enter a dept chart name.',
      });
      return;
    }

    const payload: CreateDeptChartPayload = { name: trimmedName };

    try {
      setIsCreating(true);

      await createDeptChart(teamId, payload);

      router.back();
    } catch (error) {
      setSnackbar({
        visible: true,
        message: error instanceof Error
          ? error.message
          : 'Failed to create dept chart.',
      });
    } finally {
      setIsCreating(false);
    }
  }, [name, teamId]);

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Input.Text
          label="Depth Chart Name"
          value={name}
          onChangeText={setName}
          placeholder="Offense"
          autoCapitalize="words"
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleCreate}
        />

        <View style={styles.actions}>
          <AppButton
            variant="secondary"
            fullWidth={false}
            compact
            style={styles.actionButton}
            disabled={isCreating}
            onPress={() => router.back()}
          >
            Cancel
          </AppButton>

          <AppButton
            fullWidth={false}
            compact
            style={styles.actionButton}
            loading={isCreating}
            disabled={isCreating || !name.trim()}
            onPress={handleCreate}
          >
            Create Chart
          </AppButton>
        </View>
      </View>

      <AppSnackbar
        visible={snackbar.visible}
        variant="error"
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
      >
        {snackbar.message}
      </AppSnackbar>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 18,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});

export default CreateDeptChartModal;
