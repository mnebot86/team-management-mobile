import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import Text from '@/components/ui/Text';
import ScreenContainer from '@/components/layout/Screen';

type LoadingScreenProps = {
  message?: string;
};

const LoadingScreen = ({
  message = 'Loading...'
}: LoadingScreenProps) => {
  return (
    <ScreenContainer>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        }}
      >
        <ActivityIndicator size="large" />

        <Text.Muted
          style={{
            marginTop: 12,
          }}
        >
          {message}
        </Text.Muted>
      </View>
    </ScreenContainer>
  );
};

export default LoadingScreen;
