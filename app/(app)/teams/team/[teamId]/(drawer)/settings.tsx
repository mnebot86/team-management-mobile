import ScreenContainer from '@/components/layout/Screen';
import IconButton from '@/components/ui/IconButton';
import Text from '@/components/ui/Text';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Card, Surface } from 'react-native-paper';
import { router } from 'expo-router';

const Settings = () => {
  const handleRouterVisitCode = useCallback(() => {
    router.push('../invite-code');
  }, []);

  return (
    <ScreenContainer>
      <Text.Caption>Setting</Text.Caption>

      <Surface style={styles.container}>
        <Card.Title
          style={styles.tilt}
          title="Invite Code"
          subtitle="manage invitation codes"
          left={(props) => <Avatar.Icon {...props} icon="code-json" />}
          right={(props) => (
            <IconButton {...props} icon="chevron-right" onPress={handleRouterVisitCode} />
          )}
        />
      </Surface>
    </ScreenContainer>
  )
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16
  },
  tilt: {
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1
  }
});
