import React, { useState } from "react";
import { View } from "react-native";
import ScreenContainer from "@/components/layout/Screen";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { userCreateProfile } from "@/api/profile";
import { useSessionStore } from "@/hooks/useSessionStore";
import { router } from 'expo-router';
import AppSnackbar from '@/components/ui/SnackBar';
import AvatarPicker, { AvatarFile } from '@/components/avatar/AvatarPicker';

const CreateProfile = () => {
  const { setProfile } = useSessionStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState<AvatarFile>();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  const isDisabled = !firstName.trim() || !lastName.trim() || loading;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const createdProfile = await userCreateProfile({
        firstName,
        lastName,
        avatar,
      });
      const profile = createdProfile?.profile ?? createdProfile;

      if (profile && typeof profile === 'object') {
        setProfile(profile);
      }

      // Rethinking this path
      // router.replace('/(onboarding)/welcome');
      router.replace('/(app)/teams');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';

      setSnackbar({
        visible: true,
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={{ paddingHorizontal: 16, gap: 16 }}>
        <AvatarPicker
          value={avatar}
          onChange={setAvatar}
        />

        <Input.Text
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="John"
        />

        <Input.Text
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Doe"
        />

        <View style={{ marginTop: 12 }}>
          <Button
            variant="primary"
            disabled={isDisabled}
            loading={loading}
            onPress={handleSubmit}
          >
            Continue
          </Button>
        </View>
      </View>

      <AppSnackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        variant="error"
      >
        {snackbar.message}
      </AppSnackbar>
    </ScreenContainer>
  );
};

export default CreateProfile;
