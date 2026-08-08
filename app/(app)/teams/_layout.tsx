import React, { useCallback, useEffect, useState } from 'react';
import { router, Stack } from 'expo-router';

import { joinTeamByCode } from '@/api/teams';
import AppHeader from '@/components/AppHeader';
import IconButton from '@/components/ui/IconButton';
import { Snackbar } from 'react-native-paper';

export default function TeamsLayout() {
  const [inviteCode, setInviteCode] = useState('');

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
  });

  const inviteCodeOnChange = useCallback((text: string) => {
    setInviteCode(text);
  }, []);

  useEffect(() => {
    const postInviteCode = async () => {
      try {
        const join = await joinTeamByCode({ code: inviteCode });

        if (join.teamId) {
          router.replace({
            pathname: '/(app)/teams/team/[teamId]/(drawer)',
            params: {
              teamId: join.teamId,
            },
          });
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to join team.';

        setSnackbar({
          visible: true,
          message,
        });
      }
    };

    if (inviteCode.length === 9) {
      postInviteCode();
    }
  }, [inviteCode]);

  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            header: () => (
              <AppHeader
                title="Teams"
                headerContent={
                  <IconButton
                    icon="plus"
                    accessibilityLabel="Create team"
                    size={24}
                    onPress={() => {
                      router.push('/(app)/teams/create-team-modal');
                    }}
                  />
                }
                textInputProps={{
                  placeholder: 'Enter invite code',
                  value: inviteCode,
                  onChangeText: inviteCodeOnChange,
                  rightIcon: 'arrow-right',
                  onSubmitEditing: () => { },
                }}
              />
            ),
          }}
        />

        <Stack.Screen
          name="team/[teamId]"
          options={{
            headerShown: false,
            header: ({ options, navigation }) => (
              <AppHeader
                title={(options.title as string) ?? 'Team'}
                onBackPress={() => navigation.goBack()}
              />
            ),
          }}
        />

        <Stack.Screen
          name="create-team-modal"
          options={{
            presentation: 'modal',
            header: () => (
              <AppHeader title="Create Team" />
            ),
          }}
        />
      </Stack>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() =>
          setSnackbar({
            visible: false,
            message: '',
          })
        }
      >
        {snackbar.message}
      </Snackbar>
    </>
  );
}
