import React, { useContext } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../App/context';

const ToggleContainer = styled.button`
  position: relative;
  width: 48px;
  height: 24px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  transition: all 0.3s ease;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.purple};
    outline-offset: 2px;
  }
`;

const ToggleCircle = styled.span`
  position: absolute;
  top: 2px;
  left: ${({ isDark }) => (isDark ? '26px' : '2px')};
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.purple};
  transition: all 0.2s ease;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 24px;
  color: ${({ theme, active }) => active ? theme.colors.purple : theme.colors.textTertiary};
  z-index: 1;
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
  </svg>
);

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useGlobalContext();
  
  return (
    <ToggleContainer onClick={toggleDarkMode} aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
      <IconContainer active={!darkMode}>
        <SunIcon />
      </IconContainer>
      <IconContainer active={darkMode}>
        <MoonIcon />
      </IconContainer>
      <ToggleCircle isDark={darkMode} />
    </ToggleContainer>
  );
};

export default ThemeToggle; 