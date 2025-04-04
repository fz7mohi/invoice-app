/**
 * Theme definitions for the application
 */

// Common brand colors for Fortune Gifts
const brandColors = {
  primary: '#004359',
  secondary: '#10273a',
  accent: '#FF4806',
  primaryLight: '#005E7C',
  accentLight: '#FF6D3C',
  purple: '#7c5dfa',
  border: '#9180f9'
};

export const lightTheme = {
  mode: 'light',
  colors: {
    primary: brandColors.primary,
    dark: '#10273a',
    secondary: '#7e88c3',
    accent: brandColors.accent,
    primaryLight: brandColors.primaryLight,
    accentLight: brandColors.accentLight,
    purple: brandColors.purple,
    red: '#EC5757',
    white: '#ffffff',
    background: '#ffffff',
    backgroundItem: '#ffffff',
    backgroundAlt: '#f8f8fb',
    textPrimary: brandColors.primary,
    textSecondary: '#7e88c3',
    textTertiary: '#888eb0',
    textQuaternary: '#7e88c3',
    bgInput: '#ffffff',
    bgInputBorder: '#dfe3fa',
    checkboxBg: '#dfe3fa',
    checkboxBgUnchecked: '#dfe3fa',
    btnPrimary: brandColors.purple,
    lightPurple: '#9277ff'
  },
  backgrounds: {
    main: '#ffffff',
    card: '#ffffff',
    input: '#ffffff',
    hoveredItem: '#f9fafe'
  },
  borders: '#dfe3fa',
  sidebarBackground: '#373B53'
};

export const darkTheme = {
  mode: 'dark',
  colors: {
    primary: '#ffffff',
    secondary: brandColors.secondary,
    dark: '#10273a',
    accent: brandColors.accent,
    primaryLight: brandColors.primaryLight,
    accentLight: brandColors.accentLight,
    border: brandColors.border,
    purple: brandColors.purple,
    red: '#FF9797',
    white: '#ffffff',
    background: brandColors.primary,
    backgroundItem: '#1e2139',
    backgroundAlt: '#252945',
    textPrimary: '#ffffff',
    textSecondary: '#DFE3FA',
    textTertiary: '#888eb0',
    textQuaternary: '#7e88c3',
    bgInput: '#1e2139',
    bgInputBorder: '#252945',
    checkboxBg: '#1e2139',
    checkboxBgUnchecked: '#252945',
    btnPrimary: brandColors.purple,
    lightPurple: '#9277ff'
  },
  backgrounds: {
    main: '#1E2139',
    card: '#252945',
    input: '#1E2139',
    hoveredItem: '#252945'
  },
  borders: '#252945',
  sidebarBackground: '#1E2139'
}; 