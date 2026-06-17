import { Text as PaperText } from 'react-native-paper';
import { useAppTheme } from '@/hooks/useAppTheme';
import { StyleProp, TextStyle } from 'react-native';

type TextMutedProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

const TextMuted = ({ children, style }: TextMutedProps) => {
  const theme = useAppTheme();

  return (
    <PaperText
      variant="bodyMedium"
      style={[
        {
          color: theme.colors.text.secondary,
        },
        style,
      ]}
    >
      {children}
    </PaperText>
  );
};

export default TextMuted;
