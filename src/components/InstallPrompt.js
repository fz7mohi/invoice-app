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
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-width: 90%;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: slideUp 0.3s ease-out;
  border: 1px solid rgba(0, 0, 0, 0.1);
  
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
  color: #1a1a1a;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;

  &:before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 24px;
    background: url('/logo192.png') no-repeat center;
    background-size: contain;
  }
`;

const Description = styled.div`
  margin: 0;
  color: #4a4a4a;
  font-size: 14px;
  line-height: 1.6;
`;

const StepsList = styled.ol`
  margin: 12px 0 0;
  padding-left: 20px;
  
  li {
    margin-bottom: 8px;
    padding-left: 4px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    background-color: #0056b3;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 20px;
  padding: 4px;
  transition: all 0.2s;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: #333;
  }
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 13px;
  padding: 8px;
  transition: color 0.2s;
  text-decoration: underline;
  align-self: center;
  margin-top: 4px;
  
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
              Add ForDox to your Home Screen for quick access to your invoices and quotes:
              <StepsList>
                <li>Tap the <strong>Share</strong> button in Safari's menu bar</li>
                <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
                <li>Tap <strong>Add</strong> to complete installation</li>
              </StepsList>
            </>
          ) : actualIsSafari ? (
            <>
              Add ForDox to your Dock for quick access:
              <StepsList>
                <li>Click the <strong>Share</strong> button in Safari's toolbar</li>
                <li>Select <strong>Add to Dock</strong> from the menu</li>
                <li>Click <strong>Add</strong> to complete installation</li>
              </StepsList>
            </>
          ) : (
            'Install ForDox for a better experience with offline access and quick launch.'
          )}
        </Description>
        <ButtonContainer>
          {!actualIsIOS && (
            <Button onClick={handleInstallClick}>
              Install ForDox
            </Button>
          )}
          <DismissButton onClick={handleDismiss}>
            Don't show this again
          </DismissButton>
        </ButtonContainer>
      </PromptContainer>
    );
  }

  return (
    <PromptContainer>
      <CloseButton onClick={handleClose} aria-label="Close">&times;</CloseButton>
      <Title>Install ForDox</Title>
      <Description>
        Install ForDox on your device for quick access to your invoices and quotes, even when you're offline. Get started in seconds!
      </Description>
      <ButtonContainer>
        <Button onClick={handleInstallClick}>
          Install ForDox
        </Button>
        <DismissButton onClick={handleDismiss}>
          Don't show this again
        </DismissButton>
      </ButtonContainer>
    </PromptContainer>
  );
};

export default InstallPrompt; 