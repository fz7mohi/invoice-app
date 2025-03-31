/**
 * Theme definitions for the application
 */

// Common brand colors for Fortune Gifts
const brandColors = {
  primary: '#004359',
  secondary: '#000000',
  accent: '#FF4806',
  primaryLight: '#005E7C',
  accentLight: '#FF6D3C',
  purple: '#7c5dfa'
};

export const lightTheme = {
  mode: 'light',
  colors: {
    primary: brandColors.primary,
    secondary: '#7e88c3',
    accent: brandColors.accent,
    primaryLight: brandColors.primaryLight,
    accentLight: brandColors.accentLight,
    purple: brandColors.purple,
    red: '#EC5757'
  },
  backgrounds: {
    main: '#ffffff',
    card: '#ffffff',
    input: '#ffffff',
    hoveredItem: '#f9fafe'
  },
  text: {
    primary: brandColors.primary,
    secondary: '#7e88c3'
  },
  borders: '#dfe3fa',
  sidebarBackground: '#373B53'
};

export const darkTheme = {
  mode: 'dark',
  colors: {
    primary: '#ffffff',
    secondary: '#DFE3FA',
    accent: brandColors.accent,
    primaryLight: brandColors.primaryLight,
    accentLight: brandColors.accentLight,
    purple: brandColors.purple,
    red: '#FF9797'
  },
  backgrounds: {
    main: '#1E2139',
    card: '#252945',
    input: '#1E2139',
    hoveredItem: '#252945'
  },
  text: {
    primary: '#ffffff',
    secondary: '#DFE3FA'
  },
  borders: '#252945',
  sidebarBackground: '#1E2139'
}; 