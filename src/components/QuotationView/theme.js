// Theme definitions with proper color contrast for light and dark themes
export const lightTheme = {
  colors: {
    // Core colors
    background: '#F8F8FB',
    backgroundItem: '#FFFFFF',
    backgroundAlt: '#F2F2F5',
    backgroundDetails: '#F9FAFE',
    
    // Text colors with good contrast
    textPrimary: '#0C0E16',
    textSecondary: '#333852',
    textTertiary: '#7E88C3',
    textQuaternary: '#7E88C3',
    
    // Status colors with good contrast
    statusApprovedBg: 'rgba(51, 214, 159, 0.06)',
    statusApprovedText: '#33D69F',
    statusPendingBg: 'rgba(255, 143, 0, 0.06)',
    statusPendingText: '#FF8F00',
    statusDraftBg: 'rgba(55, 59, 83, 0.06)',
    statusDraftText: '#373B53',
    
    // Accent colors
    purple: '#7C5DFA',
    lightPurple: '#9277FF',
    
    // UI elements
    divider: '#DFE3FA',
    totalBackground: '#373B53',
    totalText: '#FFFFFF',
    
    // Other functional colors
    error: '#EC5757',
    success: '#33D69F',
    warning: '#FF8F00',
  }
};

export const darkTheme = {
  colors: {
    // Core colors with dark theme contrast
    background: '#0C0E16',
    backgroundItem: '#1E2139',
    backgroundAlt: '#252945',
    backgroundDetails: '#252945',
    
    // Text colors with good contrast on dark backgrounds
    textPrimary: '#FFFFFF',
    textSecondary: '#DFE3FA',
    textTertiary: '#888EB0',
    textQuaternary: '#7E88C3',
    
    // Status colors with same contrast ratio in dark mode
    statusApprovedBg: 'rgba(51, 214, 159, 0.06)',
    statusApprovedText: '#33D69F',
    statusPendingBg: 'rgba(255, 143, 0, 0.06)',
    statusPendingText: '#FF8F00',
    statusDraftBg: 'rgba(223, 227, 250, 0.06)',
    statusDraftText: '#DFE3FA',
    
    // Accent colors
    purple: '#7C5DFA',
    lightPurple: '#9277FF',
    
    // UI elements
    divider: 'rgba(255, 255, 255, 0.1)',
    totalBackground: '#494E6E',
    totalText: '#FFFFFF',
    
    // Other functional colors
    error: '#FF9797',
    success: '#33D69F',
    warning: '#FF8F00',
  }
}; 