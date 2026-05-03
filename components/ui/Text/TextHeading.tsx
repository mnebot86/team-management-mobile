import { Text as PaperText, useTheme } from 'react-native-paper';
import { StyleProp, TextStyle } from 'react-native';

type TextHeadingProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

const TextHeading = ({ children, style }: TextHeadingProps) => {
  const theme = useTheme();

  return (
    <PaperText
      variant="headlineMedium"
      style={[
        {
          color: theme.colors.onSurface,
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
