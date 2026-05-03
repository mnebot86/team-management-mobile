import React from 'react';
import { View } from 'react-native';
import BaseScreen from './BaseScreen';
import { styles } from './styles';

type ScreenCenteredProps = {
  children: React.ReactNode;
};

const ScreenCentered = ({ children }: ScreenCenteredProps) => {
  return (
    <BaseScreen>
      <View style={styles.centered}>
        {children}
      </View>
    </BaseScreen>
  );
};

export default ScreenCentered;
