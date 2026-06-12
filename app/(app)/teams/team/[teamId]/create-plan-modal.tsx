import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import ScreenContainer from '@/components/layout/Screen';
import AppButton from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AppSnackbar from '@/components/ui/SnackBar';
import { createPracticePlan } from '@/api/practices';

const CreatePlanModal = () => {
  const { teamId } = useLocalSearchParams<{ teamId: string }>();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('90');
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
  });

  const handleCreate = async () => {
    const payload = {
      teamId,
      title,
      description,
      totalDurationMinutes: Number(durationMinutes),
      status: 'draft',
      sections: [],
    };

    await createPracticePlan(teamId, payload);

    router.back();
  };

  return (
    <ScreenContainer.Scroll>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Input.Text
          label="Plan Name"
          value={title}
          onChangeText={setTitle}
          placeholder="Standard Practice"
        />

        <Input.Text
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Regular weekly practice routine focused on fundamentals."
          multiline
          numberOfLines={3}
        />

        <Input.Text
          label="Duration (Minutes)"
          value={durationMinutes}
          onChangeText={setDurationMinutes}
          placeholder="90"
          keyboardType="numeric"
        />

        <View style={{ marginTop: 16 }}>
          <AppButton onPress={handleCreate}>
            Create Plan
          </AppButton>
        </View>
      </ScrollView>

      <AppSnackbar
        visible={snackbar.visible}
        variant="error"
        onDismiss={() =>
          setSnackbar({
            visible: false,
            message: '',
          })
        }
      >
        {snackbar.message}
      </AppSnackbar>
    </ScreenContainer.Scroll>
  );
};

export default CreatePlanModal;
