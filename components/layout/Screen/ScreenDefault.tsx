import React from 'react';
import { View } from 'react-native';
import BaseScreen from './BaseScreen';
import { styles } from './styles';

type ScreenDefaultProps = {
  children: React.ReactNode;
};

const ScreenDefault = ({ children }: ScreenDefaultProps) => {
  return (
    <BaseScreen>
      <View style={styles.content}>
        {children}
      </View>
    </BaseScreen>
  );
};

export default ScreenDefault;
