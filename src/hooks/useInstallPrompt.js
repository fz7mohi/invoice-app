import { useState, useEffect, useCallback } from 'react';
import { isIOS, isMobileDevice, isSafari, isRunningAsPWA } from '../utilities/pwaUtils';

/**
 * Check if the browser is Chrome
 * @returns {boolean} True if the browser is Chrome, false otherwise
 */
const isChrome = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /Chrome/.test(userAgent);
};

/**
 * Custom hook to handle PWA installation logic
 * @returns {Object} Installation state and handlers
 */
const useInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isSafariBrowser, setIsSafariBrowser] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installPromptShown, setInstallPromptShown] = useState(false);
  const [userEngagement, setUserEngagement] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Check if the prompt has been dismissed by the user
  const isPromptDismissed = localStorage.getItem('pwaPromptDismissed') === 'true';

  // Log debug information
  const logDebugInfo = useCallback(() => {
    // Get the actual values from the utility functions
    const actualIsIOS = isIOS();
    const actualIsSafari = isSafari();
    const actualIsMobile = isMobileDevice();
    const actualIsRunningAsPWA = isRunningAsPWA();
    const actualIsChrome = isChrome();
    
    const info = {
      isRunningAsPWA: actualIsRunningAsPWA,
      isFullscreen: window.matchMedia('(display-mode: fullscreen)').matches,
      isBrowser: window.matchMedia('(display-mode: browser)').matches,
      isStandalone: window.navigator.standalone === true,
      hasBeforeInstallPrompt: 'BeforeInstallPromptEvent' in window,
      isIOS: actualIsIOS,
      isSafari: actualIsSafari,
      isMobile: actualIsMobile,
      isChrome: actualIsChrome,
      userAgent: navigator.userAgent,
      serviceWorker: 'serviceWorker' in navigator,
      manifest: !!document.querySelector('link[rel="manifest"]'),
      themeColor: !!document.querySelector('meta[name="theme-color"]'),
      appleCapable: !!document.querySelector('meta[name="apple-mobile-web-app-capable"]'),
      mobileCapable: !!document.querySelector('meta[name="mobile-web-app-capable"]'),
      isInstalled,
      canInstall,
      installPromptShown,
      userEngagement,
      isPromptDismissed,
      hasDeferredPrompt: !!deferredPrompt,
      // Add more detailed browser info
      browser: {
        chrome: actualIsChrome,
        firefox: /Firefox/.test(navigator.userAgent),
        safari: /Safari/.test(navigator.userAgent),
        edge: /Edge/.test(navigator.userAgent) || /Edg/.test(navigator.userAgent),
        opera: /OPR/.test(navigator.userAgent),
        platform: navigator.platform,
        vendor: navigator.vendor
      }
    };
    
    console.log('Debug Info:', info);
    
    // Log a warning if there's a mismatch between state and actual values
    if (isIOSDevice !== actualIsIOS) {
      console.warn(`iOS detection mismatch: state=${isIOSDevice}, actual=${actualIsIOS}`);
    }
    
    if (isSafariBrowser !== actualIsSafari) {
      console.warn(`Safari detection mismatch: state=${isSafariBrowser}, actual=${actualIsSafari}`);
    }
  }, [isInstalled, canInstall, installPromptShown, userEngagement, isPromptDismissed, isIOSDevice, isSafariBrowser, deferredPrompt]);

  // Check if we should show the prompt
  const shouldShowPrompt = useCallback(() => {
    // If the prompt has been dismissed by the user, don't show it
    if (isPromptDismissed) {
      console.log('Prompt has been dismissed by the user');
      setShowPrompt(false);
      return;
    }

    // If the app is already installed, don't show the prompt
    if (isInstalled) {
      console.log('App is already installed, not showing prompt');
      setShowPrompt(false);
      return;
    }

    // Get the actual values from the utility functions
    const actualIsMobile = isMobileDevice();
    const actualIsIOS = isIOS();
    const actualIsSafari = isSafari();
    const actualIsChrome = isChrome();

    console.log('Installation check:', {
      canInstall,
      isMobile: actualIsMobile,
      isIOSDevice: actualIsIOS,
      isSafariBrowser: actualIsSafari,
      isChrome: actualIsChrome,
      userEngagement,
      hasDeferredPrompt: !!deferredPrompt
    });

    // Special case for Chrome - always show the install button if we have a deferred prompt
    if (actualIsChrome && deferredPrompt) {
      console.log('Showing prompt for Chrome browser with deferred prompt');
      setCanInstall(true);
      setShowPrompt(true);
      return;
    }

    // Always show on iOS/Safari for manual installation instructions
    if (actualIsIOS || actualIsSafari) {
      console.log('Showing prompt for iOS/Safari');
      setShowPrompt(true);
      return;
    }

    // Show on mobile devices that can install and have sufficient user engagement
    if (actualIsMobile && canInstall && userEngagement >= 2) {
      console.log('Showing prompt for mobile device with sufficient engagement');
      setShowPrompt(true);
      return;
    }

    // Show on desktop if it can be installed and have sufficient user engagement
    if (canInstall && userEngagement >= 3) {
      console.log('Showing prompt for desktop with sufficient engagement');
      setShowPrompt(true);
      return;
    }

    console.log('Not showing prompt - no conditions met');
    setShowPrompt(false);
  }, [isInstalled, canInstall, isPromptDismissed, userEngagement, deferredPrompt]);

  // Track user engagement
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserEngagement(prev => Math.min(prev + 1, 5));
    };

    // Listen for user interactions
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('scroll', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  // Set up event listeners and initial checks
  useEffect(() => {
    // Initial debug info
    logDebugInfo();

    // Check if we're on iOS
    const actualIsIOS = isIOS();
    const actualIsSafari = isSafari();
    
    setIsIOSDevice(actualIsIOS);
    setIsSafariBrowser(actualIsSafari);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('BeforeInstallPrompt event received');
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Update UI to notify the user they can install the PWA
      setCanInstall(true);
      // Log debug info
      logDebugInfo();
      // Check if we should show the prompt
      shouldShowPrompt();
    };

    // Listen for service worker ready event
    const handleServiceWorkerReady = (event) => {
      console.log('Service worker ready event received:', event.detail);
      if (event.detail && event.detail.isInstalled) {
        setIsInstalled(true);
      }
      logDebugInfo();
    };

    // Listen for can install event
    const handleCanInstall = (event) => {
      console.log('Can install event received:', event.detail);
      setCanInstall(true);
      logDebugInfo();
    };

    // Listen for install prompt shown event
    const handleInstallPromptShown = (event) => {
      console.log('Install prompt shown event received:', event.detail);
      setInstallPromptShown(true);
      logDebugInfo();
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('App installed event received');
      setIsInstalled(true);
      setShowPrompt(false);
      logDebugInfo();
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('serviceWorkerReady', handleServiceWorkerReady);
    window.addEventListener('canInstall', handleCanInstall);
    window.addEventListener('installPromptShown', handleInstallPromptShown);
    window.addEventListener('appInstalled', handleAppInstalled);

    // Initial check
    shouldShowPrompt();

    // Check again when user engagement changes
    shouldShowPrompt();

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('serviceWorkerReady', handleServiceWorkerReady);
      window.removeEventListener('canInstall', handleCanInstall);
      window.removeEventListener('installPromptShown', handleInstallPromptShown);
      window.removeEventListener('appInstalled', handleAppInstalled);
    };
  }, [logDebugInfo, shouldShowPrompt, userEngagement]);

  // Handle install button click
  const handleInstallClick = useCallback(() => {
    console.log('Install button clicked');
    
    // If we have a deferred prompt, use it
    if (deferredPrompt) {
      console.log('Using deferred prompt to install');
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          setIsInstalled(true);
        } else {
          console.log('User dismissed the install prompt');
        }
        // Clear the deferred prompt
        setDeferredPrompt(null);
        setCanInstall(false);
      });
    } else if (window.triggerInstallPrompt) {
      console.log('Using window.triggerInstallPrompt');
      window.triggerInstallPrompt();
    } else {
      console.log('No installation method available');
    }
  }, [deferredPrompt]);

  // Handle close button click
  const handleClose = useCallback(() => {
    setShowPrompt(false);
  }, []);

  // Handle permanent dismiss
  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
    localStorage.setItem('pwaPromptDismissed', 'true');
  }, []);

  return {
    showPrompt,
    canInstall,
    isIOSDevice,
    isSafariBrowser,
    isInstalled,
    installPromptShown,
    handleInstallClick,
    handleClose,
    handleDismiss
  };
};

export default useInstallPrompt; 