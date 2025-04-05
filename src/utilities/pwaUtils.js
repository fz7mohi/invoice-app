/**
 * Check if the app is running as an installed PWA
 * @returns {boolean} True if running as PWA, false otherwise
 */
export const isRunningAsPWA = () => {
  // Check if the app is running in standalone mode (installed PWA)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  
  // Check if running in fullscreen mode
  if (window.matchMedia('(display-mode: fullscreen)').matches) {
    return true;
  }
  
  // For iOS devices
  if (window.navigator.standalone === true) {
    return true;
  }
  
  // Default to false if we can't determine
  return false;
};

/**
 * Check if the app can be installed
 * @returns {boolean} True if the app can be installed, false otherwise
 */
export const canInstallPWA = () => {
  // Check if the app is already installed
  if (isRunningAsPWA()) {
    return false;
  }
  
  // Check if the browser supports the beforeinstallprompt event
  const hasBeforeInstallPrompt = 'BeforeInstallPromptEvent' in window;
  
  // For testing purposes, always return true if we're in development
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  return hasBeforeInstallPrompt;
};

/**
 * Check if the app is running on a mobile device
 * @returns {boolean} True if running on mobile, false otherwise
 */
export const isMobileDevice = () => {
  // Use a more reliable method to detect mobile devices
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Regular expression to identify mobile devices
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  return mobileRegex.test(userAgent.toLowerCase());
};

/**
 * Check if the app is running on iOS
 * @returns {boolean} True if running on iOS, false otherwise
 */
export const isIOS = () => {
  // Get browser information
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const platform = navigator.platform || '';
  
  // Check for Chrome, Firefox, Edge, Opera, or other non-iOS browsers
  const isChrome = /Chrome/.test(userAgent);
  const isFirefox = /Firefox/.test(userAgent);
  const isEdge = /Edge/.test(userAgent) || /Edg/.test(userAgent);
  const isOpera = /OPR/.test(userAgent);
  
  // If any of these browsers are detected, it's not iOS Safari
  if (isChrome || isFirefox || isEdge || isOpera) {
    return false;
  }
  
  // Check for iOS devices
  const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  
  // Additional platform check
  const isIOSPlatform = /iPhone|iPad|iPod/.test(platform);
  
  // Only return true if both user agent and platform indicate iOS
  return isIOSDevice && isIOSPlatform;
};

/**
 * Check if the app is running on Safari
 * @returns {boolean} True if running on Safari, false otherwise
 */
export const isSafari = () => {
  // Get browser information
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Check for Chrome, Firefox, Edge, Opera, or other non-Safari browsers
  const isChrome = /Chrome/.test(userAgent);
  const isFirefox = /Firefox/.test(userAgent);
  const isEdge = /Edge/.test(userAgent) || /Edg/.test(userAgent);
  const isOpera = /OPR/.test(userAgent);
  
  // If any of these browsers are detected, it's not Safari
  if (isChrome || isFirefox || isEdge || isOpera) {
    return false;
  }
  
  // Check for Safari
  const hasSafari = /Safari/.test(userAgent);
  
  // Safari is the only browser that includes 'Safari' but not 'Chrome' in its user agent
  return hasSafari && !isChrome;
}; 