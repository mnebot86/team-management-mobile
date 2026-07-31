import { Text as PaperText } from 'react-native-paper';
import { StyleProp, TextStyle } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';

type TextLabelProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

const TextLabel = ({ children, style }: TextLabelProps) => {
  const theme = useAppTheme();

  return (
    <PaperText
      variant="titleMedium"
      style={[
        {
          color: theme.colors.text.secondary,
          fontWeight: '600',
        },
        style,
      ]}
    >
      {children}
    </PaperText>
  );
};

export default TextLabel;
