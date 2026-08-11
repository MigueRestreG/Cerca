/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

const darkPalette = {
  text: '#F5F7F2',
  background: '#040506',
  backgroundElement: '#0B0F12',
  backgroundSelected: '#11161A',
  textSecondary: '#93A19A',
  accent: '#33E18A',
  accentSoft: 'rgba(51, 225, 138, 0.08)',
  accentStrong: '#C8FFD9',
  warning: '#F4C06B',
  danger: '#FF7B6F',
  success: '#5BFF8A',
  border: 'rgba(255,255,255,0.08)',
  neonStart: '#33E18A',
  neonMid: '#5BFF8A',
  neonEnd: '#63B7FF',
  primaryGlow: 'rgba(91,255,138,0.20)',
  blueGlow: 'rgba(99,183,255,0.18)',
  whiteGlow: 'rgba(255,255,255,0.12)',
  radiusLg: 26,
  radiusMd: 18,
  transition: '280ms',
} as const;

export const Colors = {
  light: darkPalette,
  dark: darkPalette,
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 1120;
