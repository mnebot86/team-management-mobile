import { Text as PaperText } from 'react-native-paper';
import { StyleProp, TextStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

type TextCaptionProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

const TextCaption = ({ children, style }: TextCaptionProps) => {
  const theme = useAppTheme();

  return (
    <PaperText
      variant="bodySmall"
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

export default TextCaption;
