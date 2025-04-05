import React from 'react';
import styled from 'styled-components';
import useInstallPrompt from '../hooks/useInstallPrompt';
import { isIOS, isSafari } from '../utilities/pwaUtils';

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
  animation: slideUp 0.3s ease-out;
  
  @keyframes slideUp {
    from {
      transform: translate(-50%, 20px);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
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
  transition: background-color 0.2s;
  
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
  transition: color 0.2s;
  
  &:hover {
    color: #333;
  }
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 12px;
  padding: 4px;
  align-self: flex-end;
  transition: color 0.2s;
  
  &:hover {
    color: #333;
  }
`;

/**
 * Check if the browser is Chrome
 * @returns {boolean} True if the browser is Chrome, false otherwise
 */
const isChrome = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /Chrome/.test(userAgent);
};

const InstallPrompt = () => {
  const {
    showPrompt,
    canInstall,
    handleInstallClick,
    handleClose,
    handleDismiss
  } = useInstallPrompt();

  const actualIsIOS = isIOS();
  const actualIsSafari = isSafari();
  const actualIsChrome = isChrome();

  if (!showPrompt) {
    return null;
  }

  if (actualIsIOS || actualIsSafari) {
    return (
      <PromptContainer>
        <CloseButton onClick={handleClose} aria-label="Close">&times;</CloseButton>
        <Title>Install ForDox</Title>
        <Description>
          {actualIsIOS ? (
            <>
              To install ForDox on your iOS device:
              1. Tap the Share button in Safari
              2. Scroll down and tap "Add to Home Screen"
              3. Tap "Add" to install
            </>
          ) : actualIsSafari ? (
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
        {!actualIsIOS && (
          <Button onClick={handleInstallClick}>
            Install ForDox
          </Button>
        )}
        <DismissButton onClick={handleDismiss}>
          Don't show again
        </DismissButton>
      </PromptContainer>
    );
  }

  return (
    <PromptContainer>
      <CloseButton onClick={handleClose} aria-label="Close">&times;</CloseButton>
      <Title>Install ForDox</Title>
      <Description>
        Install ForDox on your device for quick and easy access when you're on the go.
      </Description>
      <Button onClick={handleInstallClick}>
        Install ForDox
      </Button>
      <DismissButton onClick={handleDismiss}>
        Don't show again
      </DismissButton>
    </PromptContainer>
  );
};

export default InstallPrompt; 