import { useState, useEffect, useCallback } from 'react';
import { isIOS, isMobileDevice, isSafari, isRunningAsPWA } from '../utilities/pwaUtils';

const isChrome = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /Chrome/.test(userAgent);
};

const useInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isSafariBrowser, setIsSafariBrowser] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installPromptShown, setInstallPromptShown] = useState(false);
  const [userEngagement, setUserEngagement] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const isPromptDismissed = localStorage.getItem('pwaPromptDismissed') === 'true';

  const shouldShowPrompt = useCallback(() => {
    if (isPromptDismissed || isInstalled) {
      setShowPrompt(false);
      return;
    }

    const actualIsMobile = isMobileDevice();
    const actualIsIOS = isIOS();
    const actualIsSafari = isSafari();
    const actualIsChrome = isChrome();

    if (actualIsChrome && deferredPrompt) {
      setCanInstall(true);
      setShowPrompt(true);
      return;
    }

    if (actualIsIOS || actualIsSafari) {
      setShowPrompt(true);
      return;
    }

    if (actualIsMobile && canInstall && userEngagement >= 2) {
      setShowPrompt(true);
      return;
    }

    if (canInstall && userEngagement >= 3) {
      setShowPrompt(true);
      return;
    }

    setShowPrompt(false);
  }, [isInstalled, canInstall, isPromptDismissed, userEngagement, deferredPrompt]);

  useEffect(() => {
    const handleUserInteraction = () => {
      setUserEngagement(prev => Math.min(prev + 1, 5));
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('scroll', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    const actualIsIOS = isIOS();
    const actualIsSafari = isSafari();
    
    setIsIOSDevice(actualIsIOS);
    setIsSafariBrowser(actualIsSafari);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
      shouldShowPrompt();
    };

    const handleServiceWorkerReady = (event) => {
      if (event.detail && event.detail.isInstalled) {
        setIsInstalled(true);
      }
    };

    const handleCanInstall = () => {
      setCanInstall(true);
    };

    const handleInstallPromptShown = () => {
      setInstallPromptShown(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('serviceWorkerReady', handleServiceWorkerReady);
    window.addEventListener('canInstall', handleCanInstall);
    window.addEventListener('installPromptShown', handleInstallPromptShown);
    window.addEventListener('appInstalled', handleAppInstalled);

    shouldShowPrompt();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('serviceWorkerReady', handleServiceWorkerReady);
      window.removeEventListener('canInstall', handleCanInstall);
      window.removeEventListener('installPromptShown', handleInstallPromptShown);
      window.removeEventListener('appInstalled', handleAppInstalled);
    };
  }, [shouldShowPrompt]);

  const handleInstallClick = useCallback(() => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
        setCanInstall(false);
      });
    } else if (window.triggerInstallPrompt) {
      window.triggerInstallPrompt();
    }
  }, [deferredPrompt]);

  const handleClose = useCallback(() => {
    setShowPrompt(false);
  }, []);

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