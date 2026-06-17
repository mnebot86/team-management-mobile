import { ReactNode } from 'react';
import { Modal, Portal } from 'react-native-paper';
import { View } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const BottomSheet = ({
  visible,
  onClose,
  title,
  children,
}: BottomSheetProps) => {
  const theme = useAppTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={{
          backgroundColor: theme.colors.overlay.background,
          marginHorizontal: 16,
          marginBottom: 0,
          padding: 20,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          minHeight: 320,
        }}
      >
        <View
          style={{
            width: 48,
            height: 4,
            borderRadius: 2,
            backgroundColor: theme.colors.overlay.handle,
            alignSelf: 'center',
            marginBottom: 16,
          }}
        />
        <View>
          {children}
        </View>
      </Modal>
    </Portal>
  );
}

export default BottomSheet;
