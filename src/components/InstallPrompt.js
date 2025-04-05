import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTimes } from '@fortawesome/free-solid-svg-icons';
import { canInstallPWA, isIOS, isMobileDevice } from '../utilities/pwaUtils';

const PromptContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 1000;
  max-width: 90%;
  width: 400px;
  animation: slideUp 0.3s ease-out;
  
  @keyframes slideUp {
    from {
      transform: translate(-50%, 100%);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
`;

const PromptContent = styled.div`
  flex: 1;
`;

const PromptTitle = styled.h3`
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
`;

const PromptDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
`;

const InstallButton = styled.button`
  background-color: #7C5DFA;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #6B4DE6;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #666;
  }
`;

const IOSInstructions = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: #666;
`;

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  
  useEffect(() => {
    // Check if the app is already installed
    const isInstalled = localStorage.getItem('pwaInstalled') === 'true';
    
    if (isInstalled) return;
    
    // Check if running on iOS
    const ios = isIOS();
    setIsIOSDevice(ios);
    
    // For iOS, we can't use the beforeinstallprompt event
    // Instead, we'll show a custom prompt with instructions
    if (ios) {
      setShowPrompt(true);
      return;
    }
    
    // Check if the app can be installed
    if (!canInstallPWA()) {
      return;
    }
    
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show our custom prompt
      setShowPrompt(true);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
    
    // Mark as installed if accepted
    if (outcome === 'accepted') {
      localStorage.setItem('pwaInstalled', 'true');
    }
  };
  
  const handleClose = () => {
    setShowPrompt(false);
  };
  
  if (!showPrompt) return null;
  
  return (
    <PromptContainer>
      <PromptContent>
        <PromptTitle>Install ForDox</PromptTitle>
        <PromptDescription>
          {isIOSDevice 
            ? "Add this app to your home screen for quick access" 
            : "Install our app for a better experience"}
        </PromptDescription>
        {isIOSDevice && (
          <IOSInstructions>
            Tap the share button <FontAwesomeIcon icon={faDownload} /> in your browser, then select "Add to Home Screen"
          </IOSInstructions>
        )}
      </PromptContent>
      {!isIOSDevice && (
        <InstallButton onClick={handleInstallClick}>
          <FontAwesomeIcon icon={faDownload} />
          Install
        </InstallButton>
      )}
      <CloseButton onClick={handleClose}>
        <FontAwesomeIcon icon={faTimes} />
      </CloseButton>
    </PromptContainer>
  );
};

export default InstallPrompt; 