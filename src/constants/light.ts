import {
  ITheme,
  ThemeColors,
  ThemeGradients,
  ThemeSizes,
  ThemeSpacing,
} from './types';

import { THEME as commonTheme } from './theme';

export const COLORS: ThemeColors = {
  // default text color
  text: '#1A1D2E',

  // base colors - Intellact Premium Brand Colors
  /** UI color for #primary - Deep Indigo */
  primary: '#4F46E5',
  /** UI color for #secondary */
  secondary: '#7C3AED',
  /** UI color for #tertiary */
  tertiary: '#3730A3',

  // non-colors
  black: '#1A1D2E',
  white: '#FFFFFF',

  dark: '#0F1121',
  light: '#F5F7FF',

  // gray variations
  /** UI color for #gray */
  gray: '#9CA3AF',

  // colors variations
  /** UI color for #danger */
  danger: '#EF4444',
  /** UI color for #warning */
  warning: '#F59E0B',
  /** UI color for #success */
  success: '#10B981',
  /** UI color for #info */
  info: '#06B6D4',

  /** UI colors for navigation & card */
  card: '#FFFFFF',
  background: '#F5F7FF',

  /** UI color for shadowColor */
  shadow: '#4F46E5',
  overlay: 'rgba(15,17,33,0.4)',

  /** UI color for input borderColor on focus */
  focus: '#4F46E5',
  input: '#1A1D2E',

  /** UI color for switch checked/active color */
  switchOn: '#4F46E5',
  switchOff: '#E5E7EB',

  /** UI color for checkbox icon checked/active color */
  checkbox: ['#4F46E5', '#7C3AED'],
  checkboxIcon: '#FFFFFF',

  /** social colors */
  facebook: '#3B5998',
  twitter: '#55ACEE',
  dribbble: '#EA4C89',

  /** icon tint color */
  icon: '#4F46E5',

  /** blur tint color */
  blurTint: 'light',

  /** product link color */
  link: '#4F46E5',
};

export const GRADIENTS: ThemeGradients = {
  primary: ['#4F46E5', '#7C3AED'], // Premium indigo to purple
  secondary: ['#7C3AED', '#A78BFA'],
  info: ['#06B6D4', '#22D3EE'],
  success: ['#10B981', '#34D399'],
  warning: ['#F59E0B', '#FBBF24'],
  danger: ['#EF4444', '#F87171'],

  light: ['#F5F7FF', '#EDE9FE'],
  dark: ['#1A1D2E', '#0F1121'],

  white: [String(COLORS.white), '#F5F7FF'],
  black: [String(COLORS.black), '#0F1121'],

  divider: ['rgba(255,255,255,0.3)', 'rgba(79, 70, 229, 0.2)'],
  menu: [
    'rgba(255, 255, 255, 0.2)',
    'rgba(79, 70, 229, 0.15)',
    'rgba(255, 255, 255, 0.2)',
  ],
};

export const SIZES: ThemeSizes = {
  // global sizes
  base: 8,
  text: 14,
  radius: 4,
  padding: 20,

  // font sizes
  h1: 44,
  h2: 40,
  h3: 32,
  h4: 24,
  h5: 18,
  p: 16,

  // button sizes
  buttonBorder: 1,
  buttonRadius: 8,
  socialSize: 64,
  socialRadius: 16,
  socialIconSize: 26,

  // button shadow
  shadowOffsetWidth: 0,
  shadowOffsetHeight: 7,
  shadowOpacity: 0.07,
  shadowRadius: 4,
  elevation: 2,

  // input sizes
  inputHeight: 46,
  inputBorder: 1,
  inputRadius: 8,
  inputPadding: 12,

  // card sizes
  cardRadius: 16,
  cardPadding: 10,

  // image sizes
  imageRadius: 14,
  avatarSize: 32,
  avatarRadius: 8,

  // switch sizes
  switchWidth: 50,
  switchHeight: 24,
  switchThumb: 20,

  // checkbox sizes
  checkboxWidth: 18,
  checkboxHeight: 18,
  checkboxRadius: 5,
  checkboxIconWidth: 10,
  checkboxIconHeight: 8,

  // product link size
  linkSize: 12,

  /** font size multiplier: for maxFontSizeMultiplier prop */
  multiplier: 2,
};

export const SPACING: ThemeSpacing = {
  /** xs: 4px */
  xs: SIZES.base * 0.5,
  /** s: 8px */
  s: SIZES.base * 1,
  /** sm: 16px */
  sm: SIZES.base * 2,
  /** m: 24px */
  m: SIZES.base * 3,
  /** md: 32px */
  md: SIZES.base * 4,
  /** l: 40px */
  l: SIZES.base * 5,
  /** xl: 48px */
  xl: SIZES.base * 6,
  /** xxl: 56px */
  xxl: SIZES.base * 7,
};

export const THEME: ITheme = {
  ...commonTheme,
  colors: COLORS,
  gradients: GRADIENTS,
  sizes: { ...SIZES, ...commonTheme.sizes, ...SPACING },
};
