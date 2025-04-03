import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  width: 100%;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${({ theme }) => `${theme.colors.purple}20`};
  border-top: 4px solid ${({ theme }) => theme.colors.purple};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem;
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.textTertiary};
  font-size: 14px;
  margin: 0;
`;

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <SpinnerContainer>
      <Spinner />
      <LoadingText>{text}</LoadingText>
    </SpinnerContainer>
  );
};

export default LoadingSpinner; 