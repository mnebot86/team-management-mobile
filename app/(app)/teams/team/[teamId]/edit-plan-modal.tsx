import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import ScreenContainer from '@/components/layout/Screen';
import AppButton from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Text from '@/components/ui/Text';
import { editPracticePlan } from '@/api/practices';

type PracticeSection = {
  id: string;
  title: string;
  durationMinutes: string;
  description: string;
  order?: number;
};

const EditPlanModal = () => {
  const { planId, plan } = useLocalSearchParams<{
    planId: string;
    plan: string;
  }>();

  const planData = useMemo(() => {
    if (!plan) {
      return null;
    }
    try {
      return JSON.parse(plan);
    } catch {
      return null;
    }
  }, [plan]);

  const [title, setTitle] = useState(planData?.title ?? '');
  const [durationMinutes, setDurationMinutes] = useState(
    planData?.totalDurationMinutes?.toString() ?? ''
  );
  const [notes, setNotes] = useState(planData?.description ?? '');
  const [sections, setSections] = useState<PracticeSection[]>(
    planData?.sections ?? []
  );

  const updateSection = (
    sectionId: string,
    field: 'title' | 'durationMinutes' | 'description',
    value: string
  ) => {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? { ...section, [field]: value }
          : section
      )
    );
  };

  const handleDeleteSection = useCallback((sectionId: string) => {
    setSections((current) =>
      current.filter((section) => section.id !== sectionId)
    );
  }, []);

  const handleAddSection = useCallback(() => {
    setSections((current) => [
      ...current,
      {
        id: Date.now().toString(),
        title: '',
        durationMinutes: '10',
        description: '',
      },
    ]);
  }, []);

  const handleClose = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.dismiss();
  }, [router]);

  const handleSave = useCallback(async () => {
    const payload = {
      title,
      description: notes,
      totalDurationMinutes: Number(durationMinutes),
      sections: sections.map((section, index) => ({
        title: section.title,
        description: section.description,
        durationMinutes: Number(section.durationMinutes),
        order: index + 1,
      })),
    };

    await editPracticePlan(planId, payload);

    handleClose();
  }, [title, notes, durationMinutes, sections, planId, handleClose]);

  return (
    <ScreenContainer.Scroll>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Text.Heading>Edit Plan</Text.Heading>

        <Input.Text
          label="Practice Title"
          value={title}
          onChangeText={setTitle}
        />

        <Input.Text
          label="Duration"
          value={durationMinutes}
          onChangeText={setDurationMinutes}
          keyboardType="numeric"
        />

        <Input.Text
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />

        <Text.Subheading>
          Sections ({sections.length})
        </Text.Subheading>

        {sections.map((section, index) => (
          <View
            key={section.id}
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 20,
              padding: 16,
              gap: 12,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text.Body>
                Section {index + 1}
              </Text.Body>

              <AppButton
                variant="text"
                fullWidth={false}
                onPress={() => handleDeleteSection(section.id)}
              >
                Remove
              </AppButton>
            </View>

            <View
              style={{
                flexDirection: 'row',
                gap: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <Input.Text
                  label="Section Name"
                  value={section.title}
                  onChangeText={(value) =>
                    updateSection(section.id, 'title', value)
                  }
                />
              </View>

              <View style={{ width: 120 }}>
                <Input.Text
                  label="Minutes"
                  value={section.durationMinutes}
                  keyboardType="numeric"
                  onChangeText={(value) =>
                    updateSection(section.id, 'durationMinutes', value)
                  }
                />
              </View>
            </View>

            <Input.Text
              label="Description"
              value={section.description}
              multiline
              numberOfLines={2}
              onChangeText={(value) =>
                updateSection(section.id, 'description', value)
              }
            />
          </View>
        ))}

        <AppButton
          variant="outline"
          onPress={handleAddSection}
        >
          Add Section
        </AppButton>

        <AppButton onPress={handleSave}>
          Save Practice Plan
        </AppButton>

        <AppButton
          variant="text"
          onPress={() => router.back()}
        >
          Cancel
        </AppButton>
      </ScrollView>
    </ScreenContainer.Scroll>
  );
};

export default EditPlanModal;
