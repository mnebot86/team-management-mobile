// Base color variables (no loose inline strings)

type HexColor = `#${string}`;

// primitives
export const WHITE: HexColor = '#ffffff';
export const BLACK: HexColor = '#000000';

export const DARK_BG: HexColor = '#121212';
export const DARK_SURFACE: HexColor = '#1e1e1e';

// brand colors
export const GOLD: HexColor = '#C9A13B';
export const GOLD_LIGHT: HexColor = '#E5C76B';
export const GOLD_DARK: HexColor = '#A8842F';

// neutrals
export const GRAY_100: HexColor = '#F8F8F8';
export const GRAY_200: HexColor = '#E5E5E5';
export const GRAY_400: HexColor = '#999999';
export const GRAY_600: HexColor = '#666666';

// theme structure
type ThemeColors = {
  // core
  background: HexColor;
  surface: HexColor;
  text: HexColor;
  textSecondary: HexColor;
  onSurface: HexColor;
  onSurfaceVariant: HexColor;

  // brand
  primary: HexColor;
  accent: HexColor;

  // UI states
  border: HexColor;
  disabled: HexColor;
  error: HexColor;
};

export const COLORS = {
  light: {
    // base
    background: GRAY_100,
    surface: WHITE,
    text: BLACK,
    textSecondary: GRAY_600,
    onSurface: BLACK,
    onSurfaceVariant: GRAY_600,

    // brand
    primary: BLACK,
    accent: GOLD,

    // UI
    border: GRAY_200,
    disabled: GRAY_400,
    error: '#D32F2F',
  },

  dark: {
    // base
    background: DARK_BG,
    surface: DARK_SURFACE,
    text: GRAY_100,
    textSecondary: GRAY_400,
    onSurface: GRAY_100,
    onSurfaceVariant: GRAY_400,

    // brand
    primary: WHITE,
    accent: GOLD_LIGHT,

    // UI
    border: '#2A2A2A',
    disabled: GRAY_600,
    error: '#EF5350',
  },
} as const satisfies Record<'light' | 'dark', ThemeColors>;

export type ColorScheme = keyof typeof COLORS;
export type ColorTokens = (typeof COLORS)[ColorScheme];
