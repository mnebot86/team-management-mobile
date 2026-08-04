import { CreateInviteCode, createInviteCode } from '@/api/teams';
import ScreenContainer from '@/components/layout/Screen';
import AppButton from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AppSnackbar from '@/components/ui/SnackBar';
import Text from '@/components/ui/Text';
import { useDateTimeStore } from '@/hooks/useDateTimeStore';
import { useTeamStore } from '@/hooks/useTeamStore';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const CreateVisitCodeModal = () => {
  const { getTeamId } = useTeamStore();
  const { recurrenceEndDate } = useDateTimeStore();

  const [role, setRole] = useState<'player' | 'coach' | 'parent'>('player');
  const [unlimitedUses, setUnlimitedUses] = useState(true);
  const [maxUses, setMaxUses] = useState('');
  const [neverExpires, setNeverExpires] = useState(true);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
  });

  const teamId = getTeamId();

  const handleGenerateInvite = useCallback(async () => {
    if (!unlimitedUses && (!maxUses || Number(maxUses) <= 0)) {
      setSnackbar({
        visible: true,
        message: 'Please enter a valid maximum number of uses.',
      });

      return;
    }

    try {
      const payload: CreateInviteCode = {
        role,
        maxUses: unlimitedUses ? 0 : Number(maxUses),
        expiresAt: neverExpires ? null : (recurrenceEndDate ?? null),
      };

      await createInviteCode(payload, teamId as string);

      router.back();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create invite code.';

      setSnackbar({
        visible: true,
        message,
      });
    }
  }, [unlimitedUses, maxUses, neverExpires, role, recurrenceEndDate, teamId]);

  return (
    <ScreenContainer>
      <View style={styles.section}>
        <Text.Label>Role</Text.Label>

        <View style={styles.buttonRow}>
          <AppButton
            fullWidth={false}
            style={styles.segmentButton}
            variant={role === 'player' ? 'primary' : 'secondary'}
            onPress={() => setRole('player')}
          >
            Player
          </AppButton>

          <AppButton
            fullWidth={false}
            style={styles.segmentButton}
            variant={role === 'coach' ? 'primary' : 'secondary'}
            onPress={() => setRole('coach')}
          >
            Coach
          </AppButton>

          <AppButton
            fullWidth={false}
            style={styles.segmentButton}
            variant={role === 'parent' ? 'primary' : 'secondary'}
            onPress={() => setRole('parent')}
          >
            Parent
          </AppButton>
        </View>
      </View>

      <View style={styles.section}>
        <Text.Label>Maximum Uses</Text.Label>

        <View style={styles.buttonRow}>
          <AppButton
            fullWidth={false}
            style={styles.segmentButton}
            variant={unlimitedUses ? 'primary' : 'secondary'}
            onPress={() => {
              setUnlimitedUses(true);
              setMaxUses('');
            }}
          >
            Unlimited
          </AppButton>

          <AppButton
            fullWidth={false}
            style={styles.segmentButton}
            variant={!unlimitedUses ? 'primary' : 'secondary'}
            onPress={() => setUnlimitedUses(false)}
          >
            Limited
          </AppButton>
        </View>

        {!unlimitedUses && (
          <Input.Text
            containerStyle={styles.inputContainer}
            label="Maximum Uses"
            value={maxUses}
            keyboardType="numeric"
            placeholder="Enter number of uses"
            onChangeText={setMaxUses}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text.Label>Expiration</Text.Label>

        <View style={styles.buttonRow}>
          <AppButton
            fullWidth={false}
            style={styles.segmentButton}
            variant={neverExpires ? 'primary' : 'secondary'}
            onPress={() => {
              setNeverExpires(true);
            }}
          >
            Never
          </AppButton>

          <AppButton
            fullWidth={false}
            style={styles.segmentButton}
            variant={!neverExpires ? 'primary' : 'secondary'}
            onPress={() => setNeverExpires(false)}
          >
            Set Date
          </AppButton>
        </View>

        {!neverExpires && (
          <Input.DateTime
            style={styles.inputContainer}
            label="Expiration Date"
            mode="date"
            field="recurrenceEndDate"
            value={recurrenceEndDate}
          />
        )}
      </View>

      <View style={styles.actions}>
        <AppButton onPress={handleGenerateInvite}>
          Generate Invite
        </AppButton>

        <AppButton
          variant="text"
          onPress={() => router.back()}
        >
          Cancel
        </AppButton>
      </View>

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
    </ScreenContainer>
  );
};

export default CreateVisitCodeModal;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 24,
  },

  section: {
    marginBottom: 32,
    gap: 8,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },

  segmentButton: {
    flex: 1,
  },

  actions: {
    marginTop: 12,
    gap: 12,
  },

  inputContainer: {
    marginTop: 12,
  },
});
