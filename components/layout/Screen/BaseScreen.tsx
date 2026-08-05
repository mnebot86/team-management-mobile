import React from 'react';
import { KeyboardAvoidingView, Platform, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Surface } from 'react-native-paper';
import { useAppTheme } from '@/hooks/useAppTheme';
import { styles } from './styles';

type BaseScreenProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const BaseScreen = ({ children, style }: BaseScreenProps) => {
  const theme = useAppTheme();

  return (
    <SafeAreaView
      edges={['bottom', 'left', 'right']}
      style={[
        styles.safeArea,
        { backgroundColor: theme.colors.screen.background },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <Surface
          elevation={0}
          style={[
            styles.surface,
            { backgroundColor: theme.colors.screen.background },
            style,
          ]}
        >
          {children}
        </Surface>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BaseScreen;
