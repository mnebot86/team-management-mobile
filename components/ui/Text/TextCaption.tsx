import { Text as PaperText, useTheme } from 'react-native-paper';
import { StyleProp, TextStyle } from 'react-native';

type TextCaptionProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

const TextCaption = ({ children, style }: TextCaptionProps) => {
  const theme = useTheme();

  return (
    <PaperText
      variant="bodySmall"
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

export default TextCaption;
