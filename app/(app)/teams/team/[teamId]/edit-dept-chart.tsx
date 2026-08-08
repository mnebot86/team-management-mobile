import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Trash2 } from 'lucide-react-native';

import { deleteDeptChart, updateDeptChart } from '@/api/deptCharts';
import ScreenContainer from '@/components/layout/Screen';
import AppButton from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AppSnackbar from '@/components/ui/SnackBar';
import Text from '@/components/ui/Text';
import { useAppTheme } from '@/hooks/useAppTheme';

const EditDeptChartModal = () => {
  const theme = useAppTheme();
  const params = useLocalSearchParams<{
    deptChartId: string;
    name?: string;
  }>();
  const [name, setName] = useState(params.name ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const showError = useCallback((error: unknown, fallback: string) => {
    setSnackbar({
      visible: true,
      message: error instanceof Error ? error.message : fallback,
    });
  }, []);

  const handleSave = useCallback(async () => {
    const trimmedName = name.trim();

    if (!params.deptChartId) {
      showError(undefined, 'A depth chart is required.');
      return;
    }

    if (!trimmedName) {
      showError(undefined, 'Please enter a depth chart name.');
      return;
    }

    try {
      setIsSaving(true);
      await updateDeptChart(params.deptChartId, { name: trimmedName });
      router.back();
    } catch (error) {
      showError(error, 'Failed to update depth chart.');
    } finally {
      setIsSaving(false);
    }
  }, [name, params.deptChartId, showError]);

  const confirmDelete = useCallback(() => {
    if (!params.deptChartId || isDeleting) return;

    Alert.alert(
      'Delete depth chart?',
      `This will permanently delete ${name.trim() || 'this depth chart'}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteDeptChart(params.deptChartId);
              router.back();
            } catch (error) {
              showError(error, 'Failed to delete depth chart.');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  }, [isDeleting, name, params.deptChartId, showError]);

  const isBusy = isSaving || isDeleting;

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <View style={styles.formSection}>
          <Input.Text
            label="Depth Chart Name"
            value={name}
            onChangeText={setName}
            placeholder="Offense"
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />

          <View style={styles.actions}>
            <AppButton
              variant="secondary"
              fullWidth={false}
              compact
              style={styles.actionButton}
              disabled={isBusy}
              onPress={() => router.back()}
            >
              Cancel
            </AppButton>

            <AppButton
              fullWidth={false}
              compact
              style={styles.actionButton}
              loading={isSaving}
              disabled={isBusy || !name.trim()}
              onPress={handleSave}
            >
              Save Changes
            </AppButton>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete depth chart"
          disabled={isBusy}
          onPress={confirmDelete}
          style={({ pressed }) => [
            styles.deleteAction,
            {
              backgroundColor: theme.colors.card.background,
              borderColor: theme.colors.card.border,
              opacity: isBusy ? 0.45 : pressed ? 0.7 : 1,
            },
          ]}
        >
          <View style={styles.deleteCopy}>
            <Text.Body style={[styles.deleteTitle, { color: theme.colors.error }]}>
              Delete depth chart
            </Text.Body>
            <Text.Caption>This action cannot be undone.</Text.Caption>
          </View>
          <Trash2 size={20} color={theme.colors.error} />
        </Pressable>
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
    gap: 24,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  formSection: {
    gap: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  deleteAction: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 16,
  },
  deleteCopy: {
    gap: 2,
  },
  deleteTitle: {
    fontWeight: '600',
  },
});

export default EditDeptChartModal;
