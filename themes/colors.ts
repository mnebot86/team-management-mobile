// Base color variables (no loose inline strings)

type HexColor = `#${string}`;

// primitives
export const WHITE: HexColor = '#ffffff';
export const BLACK: HexColor = '#000000';

export const DARK_BG: HexColor = '#0F1117';
export const DARK_SURFACE: HexColor = '#1A1D26';
export const DARK_SURFACE_ALT: HexColor = '#232733';

// brand colors
export const GOLD: HexColor = '#C9A13B';
export const GOLD_LIGHT: HexColor = '#E5C76B';
export const GOLD_DARK: HexColor = '#A8842F';
export const GOLD_100: HexColor = '#F3E5B5';
export const GOLD_900: HexColor = '#3D3320';

// neutrals
export const GRAY_100: HexColor = '#F8F8F8';
export const GRAY_200: HexColor = '#E5E5E5';
export const GRAY_400: HexColor = '#999999';
export const GRAY_600: HexColor = '#666666';
export const GRAY_800: HexColor = '#2F333D';

// semantic utility colors
export const GRAY_300: HexColor = '#B8BBC6';
export const GRAY_500: HexColor = '#777B86';

export const RED_300: HexColor = '#FF6B6B';
export const RED_500: HexColor = '#D32F2F';
export const GREEN_500: HexColor = '#2E7D32';
export const ORANGE_500: HexColor = '#ED6C02';
export const BLUE_500: HexColor = '#0288D1';
export const GRAY_900: HexColor = '#171A21';

// theme structure
type ThemeColors = {
  // legacy/core tokens
  background: HexColor;
  surface: HexColor;

  // brand
  primary: HexColor;
  accent: HexColor;

  // UI states
  border: HexColor;
  disabled: HexColor;
  error: HexColor;

  status: {
    success: HexColor;
    warning: HexColor;
    error: HexColor;
    info: HexColor;
    neutral: HexColor;
  };
  event: {
    practice: {
      accent: HexColor;
      background: HexColor;
    };
    game: {
      accent: HexColor;
      background: HexColor;
    };
    event: {
      accent: HexColor;
      background: HexColor;
    };
  };

  // semantic screen tokens
  screen: {
    background: HexColor;
    headerBackground: HexColor;
    tabBarBackground: HexColor;
  };

  auth: {
    headerBackground: HexColor;
    headerText: HexColor;
    headerSubtitle: HexColor;
  };

  drawer: {
    background: HexColor;
    activeBackground: HexColor;
    activeText: HexColor;
    inactiveText: HexColor;
    border: HexColor;
  };

  card: {
    background: HexColor;
    elevatedBackground: HexColor;
    border: HexColor;
  };

  overlay: {
    background: HexColor;
    handle: HexColor;
    backdrop: string;
  };

  text: {
    primary: HexColor;
    secondary: HexColor;
    accent: HexColor;
  };

  button: {
    primaryBackground: HexColor;
    primaryText: HexColor;
    secondaryBackground: HexColor;
    secondaryText: HexColor;
    border: HexColor;
    ripple: HexColor;
  };

  icon: {
    primary: HexColor;
    secondary: HexColor;
    accent: HexColor;
  };

  avatar: {
    background: HexColor;
    border: HexColor;
    icon: HexColor;
  };
};

export const COLORS = {
  light: {
    // base
    background: GRAY_100,
    surface: WHITE,

    // brand
    primary: BLACK,
    accent: GOLD,

    // UI
    border: GRAY_200,
    disabled: GRAY_400,
    error: RED_500,
    status: {
      success: GREEN_500,
      warning: ORANGE_500,
      error: RED_500,
      info: BLUE_500,
      neutral: GRAY_400,
    },
    event: {
      practice: {
        accent: BLACK,
        background: GRAY_100,
      },
      game: {
        accent: GOLD,
        background: GOLD_100,
      },
      event: {
        accent: GRAY_600,
        background: GRAY_200,
      },
    },

    // semantic screen tokens
    screen: {
      background: GRAY_100,
      headerBackground: WHITE,
      tabBarBackground: WHITE,
    },

    auth: {
      headerBackground: BLACK,
      headerText: WHITE,
      headerSubtitle: GRAY_300,
    },

    drawer: {
      background: WHITE,
      activeBackground: GOLD_100,
      activeText: BLACK,
      inactiveText: GRAY_600,
      border: GRAY_200,
    },

    card: {
      background: WHITE,
      elevatedBackground: WHITE,
      border: GRAY_200,
    },

    overlay: {
      background: WHITE,
      handle: GRAY_300,
      backdrop: 'rgba(0,0,0,0.4)',
    },

    text: {
      primary: BLACK,
      secondary: GRAY_600,
      accent: GOLD,
    },

    button: {
      primaryBackground: BLACK,
      primaryText: WHITE,
      secondaryBackground: WHITE,
      secondaryText: BLACK,
      border: BLACK,
      ripple: GRAY_200,
    },

    icon: {
      primary: BLACK,
      secondary: GRAY_600,
      accent: GOLD,
    },

    avatar: {
      background: GRAY_100,
      border: GRAY_200,
      icon: GOLD,
    },
  },

  dark: {
    // base
    background: DARK_BG,
    surface: DARK_SURFACE,

    // brand
    primary: GOLD_LIGHT,
    accent: GOLD,

    // UI
    border: GRAY_800,
    disabled: GRAY_500,
    error: RED_300,
    status: {
      success: GREEN_500,
      warning: ORANGE_500,
      error: RED_300,
      info: BLUE_500,
      neutral: GRAY_500,
    },
    event: {
      practice: {
        accent: GRAY_100,
        background: DARK_SURFACE_ALT,
      },
      game: {
        accent: GOLD_LIGHT,
        background: GOLD_900,
      },
      event: {
        accent: GRAY_300,
        background: GRAY_900,
      },
    },

    // semantic screen tokens
    screen: {
      background: DARK_BG,
      headerBackground: DARK_SURFACE,
      tabBarBackground: DARK_SURFACE,
    },

    auth: {
      headerBackground: BLACK,
      headerText: WHITE,
      headerSubtitle: GRAY_300,
    },

    drawer: {
      background: DARK_SURFACE,
      activeBackground: GOLD_900,
      activeText: GOLD_LIGHT,
      inactiveText: GRAY_300,
      border: GRAY_900,
    },

    card: {
      background: DARK_SURFACE,
      elevatedBackground: DARK_SURFACE_ALT,
      border: GRAY_900,
    },

    overlay: {
      background: DARK_SURFACE_ALT,
      handle: GRAY_500,
      backdrop: 'rgba(0,0,0,0.6)',
    },

    text: {
      primary: GRAY_100,
      secondary: GRAY_300,
      accent: GOLD_LIGHT,
    },

    button: {
      primaryBackground: GOLD_LIGHT,
      primaryText: BLACK,
      secondaryBackground: DARK_SURFACE,
      secondaryText: GRAY_100,
      border: GOLD_LIGHT,
      ripple: GOLD_DARK,
    },

    icon: {
      primary: GRAY_100,
      secondary: GRAY_300,
      accent: GOLD_LIGHT,
    },

    avatar: {
      background: DARK_SURFACE_ALT,
      border: GRAY_900,
      icon: GOLD_LIGHT,
    },
  },
} as const satisfies Record<'light' | 'dark', ThemeColors>;

export type ColorScheme = keyof typeof COLORS;
export type ColorTokens = (typeof COLORS)[ColorScheme];
