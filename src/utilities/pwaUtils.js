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
  
  // For iOS devices
  if (window.navigator.standalone === true) {
    console.log('App is running in standalone mode (iOS)');
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
  // Use a more reliable method to detect mobile devices
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Regular expression to identify mobile devices
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  const isMobile = mobileRegex.test(userAgent.toLowerCase());
  
  console.log(`Is mobile device: ${isMobile}`);
  return isMobile;
};

/**
 * Check if the app is running on iOS
 * @returns {boolean} True if running on iOS, false otherwise
 */
export const isIOS = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // More accurate iOS detection
  // Check for iOS-specific features
  const isIOSDevice = (
    // Check for iOS devices in user agent
    /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream &&
    // Additional check to avoid false positives
    !/Chrome/.test(userAgent) && !/Firefox/.test(userAgent) && !/Edge/.test(userAgent)
  );
  
  console.log(`Is iOS device: ${isIOSDevice}`);
  return isIOSDevice;
};

/**
 * Check if the app is running on Safari
 * @returns {boolean} True if running on Safari, false otherwise
 */
export const isSafari = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // More accurate Safari detection
  // Safari is the only browser that includes 'Safari' but not 'Chrome' in its user agent
  const isSafariBrowser = (
    /Safari/.test(userAgent) && 
    !/Chrome/.test(userAgent) && 
    !/Firefox/.test(userAgent) && 
    !/Edge/.test(userAgent) &&
    !/OPR/.test(userAgent) && // Opera
    !/Edg/.test(userAgent)    // Edge
  );
  
  console.log(`Is Safari browser: ${isSafariBrowser}`);
  return isSafariBrowser;
}; 