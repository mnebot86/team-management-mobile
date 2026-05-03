import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Surface, useTheme } from 'react-native-paper';
import { styles } from './styles';

type BaseScreenProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const BaseScreen = ({ children, style }: BaseScreenProps) => {
  const theme = useTheme();

  return (
    <SafeAreaView
      edges={['top', 'bottom', 'left', 'right']}
      style={[
        styles.safeArea,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Surface
        elevation={0}
        style={[
          styles.surface,
          { backgroundColor: theme.colors.background },
          style,
        ]}
      >
        {children}
      </Surface>
    </SafeAreaView>
  );
};

export default BaseScreen;
