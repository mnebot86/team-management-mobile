import { Text as PaperText } from 'react-native-paper';
import { StyleProp, TextStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

type TextHeadingProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

const TextHeading = ({ children, style }: TextHeadingProps) => {
  const theme = useAppTheme();

  return (
    <PaperText
      variant="headlineMedium"
      style={[
        {
          color: theme.colors.text.primary,
          fontWeight: '700',
        },
        style,
      ]}
    >
      {children}
    </PaperText>
  );
};

export default TextHeading;
