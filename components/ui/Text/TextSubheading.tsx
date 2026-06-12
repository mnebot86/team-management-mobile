import React from 'react';
import { Text as PaperText, useTheme } from 'react-native-paper';

type TextSubheadingProps = React.ComponentProps<typeof PaperText>;

const TextSubheading = ({ children, style, ...props }: TextSubheadingProps) => {
  const theme = useTheme();
  return (
    <PaperText
      variant="titleMedium"
      style={[
        {
          fontWeight: '600',
          color: theme.colors.onSurface,
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
