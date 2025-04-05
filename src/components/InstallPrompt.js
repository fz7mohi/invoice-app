import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { canInstallPWA, isIOS, isMobileDevice, isSafari } from '../utilities/pwaUtils';

const PromptContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: 90%;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h3`
  margin: 0;
  color: #333;
  font-size: 18px;
`;

const Description = styled.p`
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  
  &:hover {
    color: #333;
  }
`;

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isSafariBrowser, setIsSafariBrowser] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installPromptShown, setInstallPromptShown] = useState(false);

  useEffect(() => {
    const logDebugInfo = () => {
      const info = {
        isRunningAsPWA: window.matchMedia('(display-mode: standalone)').matches,
        isFullscreen: window.matchMedia('(display-mode: fullscreen)').matches,
        isBrowser: window.matchMedia('(display-mode: browser)').matches,
        isStandalone: window.navigator.standalone === true,
        hasBeforeInstallPrompt: 'BeforeInstallPromptEvent' in window,
        isIOS: isIOS(),
        isSafari: isSafari(),
        isMobile: isMobileDevice(),
        userAgent: navigator.userAgent,
        serviceWorker: 'serviceWorker' in navigator,
        manifest: !!document.querySelector('link[rel="manifest"]'),
        themeColor: !!document.querySelector('meta[name="theme-color"]'),
        appleCapable: !!document.querySelector('meta[name="apple-mobile-web-app-capable"]'),
        mobileCapable: !!document.querySelector('meta[name="mobile-web-app-capable"]'),
        isInstalled,
        canInstall,
        installPromptShown
      };
      
      console.log('Debug Info:', info);
    };

    // Initial debug info
    logDebugInfo();

    // Check if we're on iOS
    setIsIOSDevice(isIOS());
    setIsSafariBrowser(isSafari());

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
      // Always show the prompt when we can install
      setShowPrompt(true);
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

    window.addEventListener('serviceWorkerReady', handleServiceWorkerReady);
    window.addEventListener('canInstall', handleCanInstall);
    window.addEventListener('installPromptShown', handleInstallPromptShown);
    window.addEventListener('appInstalled', handleAppInstalled);

    // Check if we should show the prompt
    const shouldShowPrompt = () => {
      // If the app is already installed, don't show the prompt
      if (isInstalled) {
        console.log('App is already installed, not showing prompt');
        setShowPrompt(false);
        return;
      }

      const isMobile = isMobileDevice();
      const isIOSDevice = isIOS();
      const isSafariBrowser = isSafari();

      console.log('Installation check:', {
        canInstall,
        isMobile,
        isIOSDevice,
        isSafariBrowser
      });

      // Always show on iOS/Safari for manual installation instructions
      if (isIOSDevice || isSafariBrowser) {
        console.log('Showing prompt for iOS/Safari');
        setShowPrompt(true);
        return;
      }

      // Show on mobile devices that can install
      if (isMobile && canInstall) {
        console.log('Showing prompt for mobile device');
        setShowPrompt(true);
        return;
      }

      // Show on desktop if it can be installed
      if (canInstall) {
        console.log('Showing prompt for desktop');
        setShowPrompt(true);
        return;
      }

      console.log('Not showing prompt - no conditions met');
      setShowPrompt(false);
    };

    // Initial check
    shouldShowPrompt();

    // Set up a timeout to force show the prompt if needed
    const timeoutId = setTimeout(() => {
      if (!showPrompt) {
        console.log('Timeout reached, checking prompt again');
        shouldShowPrompt();
      }
    }, 2000);

    // Cleanup
    return () => {
      window.removeEventListener('serviceWorkerReady', handleServiceWorkerReady);
      window.removeEventListener('canInstall', handleCanInstall);
      window.removeEventListener('installPromptShown', handleInstallPromptShown);
      window.removeEventListener('appInstalled', handleAppInstalled);
      clearTimeout(timeoutId);
    };
  }, [isInstalled, canInstall, installPromptShown]);

  // Force show the prompt after a delay if it's not showing
  useEffect(() => {
    const forceShowPrompt = setTimeout(() => {
      if (!showPrompt) {
        console.log('Force showing prompt after delay');
        setShowPrompt(true);
      }
    }, 3000);

    return () => clearTimeout(forceShowPrompt);
  }, []);

  // Always show the prompt after a longer delay, regardless of other conditions
  useEffect(() => {
    const alwaysShowPrompt = setTimeout(() => {
      console.log('Always showing prompt after longer delay');
      setShowPrompt(true);
    }, 5000);

    return () => clearTimeout(alwaysShowPrompt);
  }, []);

  const handleInstallClick = () => {
    console.log('Install button clicked');
    if (window.triggerInstallPrompt) {
      window.triggerInstallPrompt();
    } else {
      console.log('triggerInstallPrompt function not available');
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <PromptContainer>
      <CloseButton onClick={handleClose}>&times;</CloseButton>
      <Title>Install ForDox</Title>
      <Description>
        {isIOSDevice ? (
          <>
            To install ForDox on your iOS device:
            1. Tap the Share button in Safari
            2. Scroll down and tap "Add to Home Screen"
            3. Tap "Add" to install
          </>
        ) : isSafariBrowser ? (
          <>
            To install ForDox on your Mac:
            1. Click the Share button in Safari
            2. Select "Add to Dock"
            3. Click "Add" to install
          </>
        ) : (
          'Install ForDox for a better experience with offline access and quick launch.'
        )}
      </Description>
      {!isIOSDevice && !isSafariBrowser && (
        <Button onClick={handleInstallClick}>
          Install ForDox
        </Button>
      )}
    </PromptContainer>
  );
};

export default InstallPrompt; 