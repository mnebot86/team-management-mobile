import { Text as PaperText, useTheme } from 'react-native-paper';
import { StyleProp, TextStyle } from 'react-native';

type TextMutedProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

const TextMuted = ({ children, style }: TextMutedProps) => {
  const theme = useTheme();

  return (
    <PaperText
      variant="bodyMedium"
      style={[
        {
          color: theme.colors.onSurfaceVariant,
        },
        style,
      ]}
    >
      {children}
    </PaperText>
  );
};

export default TextMuted;
