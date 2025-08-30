export const Colors = {
  // Primary Colors
  primary: {
    blue: '#007AFF',
    lightBlue: '#34C8FF',
    darkBlue: '#0051D5',
  },

  // System Colors (iOS inspired)
  system: {
    red: '#FF3B30',
    orange: '#FF9500',
    yellow: '#FFCC00',
    green: '#34C759',
    teal: '#30B0C7',
    blue: '#007AFF',
    indigo: '#5856D6',
    purple: '#AF52DE',
    pink: '#FF2D55',
  },

  // Gray Scale (iOS system grays)
  gray: {
    gray1: '#8E8E93',
    gray2: '#AEAEB2',
    gray3: '#C7C7CC',
    gray4: '#D1D1D6',
    gray5: '#E5E5EA',
    gray6: '#F2F2F7',
  },

  // Semantic Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F2F7',
    tertiary: '#FFFFFF',
    grouped: '#F2F2F7',
    groupedSecondary: '#FFFFFF',

    // Dark mode support (future)
    primaryDark: '#000000',
    secondaryDark: '#1C1C1E',
    tertiaryDark: '#2C2C2E',
  },

  // Label Colors (text)
  label: {
    primary: '#000000',
    secondary: 'rgba(60, 60, 67, 0.6)',
    tertiary: 'rgba(60, 60, 67, 0.3)',
    quaternary: 'rgba(60, 60, 67, 0.18)',

    // Dark mode support (future)
    primaryDark: '#FFFFFF',
    secondaryDark: 'rgba(235, 235, 245, 0.6)',
    tertiaryDark: 'rgba(235, 235, 245, 0.3)',
    quaternaryDark: 'rgba(235, 235, 245, 0.18)',
  },

  // Separator Colors
  separator: {
    default: 'rgba(60, 60, 67, 0.36)',
    opaque: '#C6C6C8',

    // Dark mode support (future)
    defaultDark: 'rgba(84, 84, 88, 0.65)',
    opaqueDark: '#38383A',
  },

  // Nutrition Colors (custom for our app)
  nutrition: {
    protein: '#FF6B6B',
    carbs: '#4ECDC4',
    fat: '#FFD93D',
    calories: '#6C5CE7',
  },
} as const;

export const Typography = {
  // Font Families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },

  // Font Sizes (iOS Human Interface Guidelines)
  fontSize: {
    largeTitle: 34,
    title1: 28,
    title2: 22,
    title3: 20,
    headline: 17,
    body: 17,
    callout: 16,
    subheadline: 15,
    footnote: 13,
    caption1: 12,
    caption2: 11,
  },

  // Line Heights
  lineHeight: {
    largeTitle: 41,
    title1: 34,
    title2: 28,
    title3: 25,
    headline: 22,
    body: 22,
    callout: 21,
    subheadline: 20,
    footnote: 18,
    caption1: 16,
    caption2: 13,
  },

  // Font Weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
} as const;

export const Spacing = {
  // Base unit (8pt grid system)
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,

  // Component specific
  padding: {
    card: 16,
    button: 12,
    input: 16,
    screen: 16,
  },

  margin: {
    section: 32,
    item: 16,
    small: 8,
  },
} as const;

export const BorderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  xl: 16,
  full: 9999,

  // Component specific
  card: 12,
  button: 8,
  input: 10,
  chip: 16,
  modal: 14,
} as const;

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const Animation = {
  duration: {
    instant: 0,
    fast: 200,
    normal: 300,
    slow: 500,
  },

  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',

    // iOS spring animations
    spring: {
      damping: 0.8,
      stiffness: 100,
    },
  },
} as const;

export const Accessibility = {
  minTouchTarget: 44, // iOS minimum touch target size

  focusStyle: {
    borderWidth: 2,
    borderColor: Colors.primary.blue,
    borderRadius: BorderRadius.medium,
  },

  contrast: {
    minimum: 4.5, // WCAG AA
    enhanced: 7, // WCAG AAA
  },
} as const;

export const Layout = {
  maxContentWidth: 428, // iPhone 14 Pro Max width

  grid: {
    columns: 12,
    gutter: Spacing.md,
  },

  safeArea: {
    top: 44, // iOS status bar
    bottom: 34, // iPhone home indicator
  },
} as const;

// Type exports for TypeScript
export type ColorValue =
  (typeof Colors)[keyof typeof Colors][keyof (typeof Colors)[keyof typeof Colors]];
export type TypographyValue =
  (typeof Typography)[keyof typeof Typography][keyof (typeof Typography)[keyof typeof Typography]];
export type SpacingValue = (typeof Spacing)[keyof typeof Spacing];
export type BorderRadiusValue = (typeof BorderRadius)[keyof typeof BorderRadius];

// Theme type for future theming support
export interface Theme {
  colors: typeof Colors;
  typography: typeof Typography;
  spacing: typeof Spacing;
  borderRadius: typeof BorderRadius;
  shadows: typeof Shadows;
  animation: typeof Animation;
  accessibility: typeof Accessibility;
  layout: typeof Layout;
}

export const defaultTheme: Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  animation: Animation,
  accessibility: Accessibility,
  layout: Layout,
};
