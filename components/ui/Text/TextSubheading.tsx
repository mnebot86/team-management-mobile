import React from 'react';
import { Text as PaperText } from 'react-native-paper';
import { useAppTheme } from '@/hooks/useAppTheme';

type TextSubheadingProps = React.ComponentProps<typeof PaperText>;

const TextSubheading = ({ children, style, ...props }: TextSubheadingProps) => {
  const theme = useAppTheme();
  return (
    <PaperText
      variant="titleMedium"
      style={[
        {
          fontWeight: '600',
          color: theme.colors.text.primary,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </PaperText>
  );
};

export default TextSubheading;
