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

const DebugInfo = styled.div`
  margin-top: 12px;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  white-space: pre-wrap;
`;

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isSafariBrowser, setIsSafariBrowser] = useState(false);

  useEffect(() => {
    const updateDebugInfo = () => {
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
      };
      
      setDebugInfo(JSON.stringify(info, null, 2));
    };

    // Initial debug info
    updateDebugInfo();

    // Check if we're on iOS
    setIsIOSDevice(isIOS());
    setIsSafariBrowser(isSafari());

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
      updateDebugInfo();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if we should show the prompt
    const shouldShowPrompt = () => {
      const canInstall = canInstallPWA();
      const isMobile = isMobileDevice();
      const isIOSDevice = isIOS();
      const isSafariBrowser = isSafari();

      // Always show on iOS/Safari for manual installation instructions
      if (isIOSDevice || isSafariBrowser) {
        setShowPrompt(true);
        return;
      }

      // Show on mobile devices that can install
      if (isMobile && canInstall) {
        setShowPrompt(true);
        return;
      }

      // Show on desktop if it can be installed
      if (canInstall) {
        setShowPrompt(true);
        return;
      }

      setShowPrompt(false);
    };

    // Initial check
    shouldShowPrompt();

    // Set up a timeout to force show the prompt if needed
    const timeoutId = setTimeout(() => {
      if (!showPrompt) {
        shouldShowPrompt();
      }
    }, 2000);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowPrompt(false);
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
      <Title>Install Invoice App</Title>
      <Description>
        {isIOSDevice ? (
          <>
            To install this app on your iOS device:
            1. Tap the Share button in Safari
            2. Scroll down and tap "Add to Home Screen"
            3. Tap "Add" to install
          </>
        ) : isSafariBrowser ? (
          <>
            To install this app on your Mac:
            1. Click the Share button in Safari
            2. Select "Add to Dock"
            3. Click "Add" to install
          </>
        ) : (
          'Install our app for a better experience with offline access and quick launch.'
        )}
      </Description>
      {!isIOSDevice && !isSafariBrowser && (
        <Button onClick={handleInstallClick}>
          Install App
        </Button>
      )}
      <DebugInfo>{debugInfo}</DebugInfo>
    </PromptContainer>
  );
};

export default InstallPrompt; 