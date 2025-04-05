/**
 * Check if the app is running as an installed PWA
 * @returns {boolean} True if running as PWA, false otherwise
 */
export const isRunningAsPWA = () => {
  // Check if the app is running in standalone mode (installed PWA)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('App is running in standalone mode');
    return true;
  }
  
  // Check if running in fullscreen mode
  if (window.matchMedia('(display-mode: fullscreen)').matches) {
    console.log('App is running in fullscreen mode');
    return true;
  }
  
  // Check if running in a browser that supports the display-mode media query
  if (window.matchMedia('(display-mode: browser)').matches) {
    console.log('App is running in browser mode');
    return false;
  }
  
  // For browsers that don't support display-mode media query
  // Check if the app is running in a standalone window
  if (window.navigator.standalone === true) {
    console.log('App is running in standalone mode (iOS)');
    return true;
  }
  
  // Check if the app is running in a standalone window (Android)
  if (window.matchMedia('(display-mode: standalone)').matches || 
      window.matchMedia('(display-mode: fullscreen)').matches) {
    console.log('App is running in standalone/fullscreen mode (Android)');
    return true;
  }
  
  // Default to false if we can't determine
  console.log('Could not determine if app is running as PWA');
  return false;
};

/**
 * Check if the app can be installed
 * @returns {boolean} True if the app can be installed, false otherwise
 */
export const canInstallPWA = () => {
  // Check if the app is already installed
  if (isRunningAsPWA()) {
    console.log('App is already installed as PWA');
    return false;
  }
  
  // Check if the browser supports the beforeinstallprompt event
  const hasBeforeInstallPrompt = 'BeforeInstallPromptEvent' in window;
  console.log(`Browser supports beforeinstallprompt: ${hasBeforeInstallPrompt}`);
  
  // For testing purposes, always return true if we're in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Development environment, allowing installation');
    return true;
  }
  
  return hasBeforeInstallPrompt;
};

/**
 * Check if the app is running on a mobile device
 * @returns {boolean} True if running on mobile, false otherwise
 */
export const isMobileDevice = () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  console.log(`Is mobile device: ${isMobile}`);
  return isMobile;
};

/**
 * Check if the app is running on iOS
 * @returns {boolean} True if running on iOS, false otherwise
 */
export const isIOS = () => {
  const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  console.log(`Is iOS device: ${isIOSDevice}`);
  return isIOSDevice;
};

/**
 * Check if the app is running on Safari
 * @returns {boolean} True if running on Safari, false otherwise
 */
export const isSafari = () => {
  const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  console.log(`Is Safari browser: ${isSafariBrowser}`);
  return isSafariBrowser;
}; 