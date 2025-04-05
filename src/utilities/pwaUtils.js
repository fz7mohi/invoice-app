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
  
  // Check if running in a browser that supports the display-mode media query
  if (window.matchMedia('(display-mode: browser)').matches) {
    return false;
  }
  
  // For browsers that don't support display-mode media query
  // Check if the app is running in a standalone window
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
  return 'BeforeInstallPromptEvent' in window;
};

/**
 * Check if the app is running on a mobile device
 * @returns {boolean} True if running on mobile, false otherwise
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Check if the app is running on iOS
 * @returns {boolean} True if running on iOS, false otherwise
 */
export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}; 