import { useTheme } from 'react-native-paper';

import type { AppTheme } from '@/themes/theme';

export const useAppTheme = () => useTheme<AppTheme>();
