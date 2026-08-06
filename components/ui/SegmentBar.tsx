import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import {
  SegmentedButtons,
  SegmentedButtonsProps,
} from 'react-native-paper';

import { useAppTheme } from '@/hooks/useAppTheme';

type SegmentOption<T extends string> = SegmentedButtonsProps<T>['buttons'][number];

type SegmentBarProps<T extends string> = {
  value: T;
  onValueChange: (value: T) => void;
  options: SegmentOption<T>[];
  density?: SegmentedButtonsProps<T>['density'];
  style?: StyleProp<ViewStyle>;
};

const SegmentBar = <T extends string>({
  value,
  onValueChange,
  options,
  density = 'regular',
  style,
}: SegmentBarProps<T>) => {
  const theme = useAppTheme();

  const buttons = options.map((option) => ({
    ...option,
    checkedColor: option.checkedColor ?? theme.colors.segment.selectedText,
    uncheckedColor: option.uncheckedColor ?? theme.colors.segment.text,
    style: [
      { borderColor: theme.colors.segment.border },
      option.style,
    ],
  }));

  return (
    <SegmentedButtons
      value={value}
      onValueChange={onValueChange}
      buttons={buttons}
      density={density}
      style={style}
      theme={{
        colors: {
          secondaryContainer: theme.colors.segment.selectedBackground,
          onSecondaryContainer: theme.colors.segment.selectedText,
          onSurface: theme.colors.segment.text,
          outline: theme.colors.segment.border,
          surface: theme.colors.segment.background,
        },
      }}
    />
  );
};

export default SegmentBar;
export type { SegmentBarProps, SegmentOption };
