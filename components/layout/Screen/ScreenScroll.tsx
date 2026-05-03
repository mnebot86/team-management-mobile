import React from 'react';
import { ScrollView } from 'react-native';
import BaseScreen from './BaseScreen';
import { styles } from './styles';

type ScreenScrollProps = {
  children: React.ReactNode;
};

const ScreenScroll = ({ children }: ScreenScrollProps) => {
  return (
    <BaseScreen>
      <ScrollView contentContainerStyle={styles.content}>
        {children}
      </ScrollView>
    </BaseScreen>
  );
};

export default ScreenScroll;
