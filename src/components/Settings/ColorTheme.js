import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useGlobalContext } from '../App/context';
import { headingTitle } from '../../utilities/typographyStyles';

const ColorTheme = () => {
  const { theme, toggleTheme } = useGlobalContext();
  
  const handleThemeChange = (selectedTheme) => {
    if (selectedTheme !== theme) {
      toggleTheme();
    }
  };

  return (
    <ThemeContainer>
      <ThemeHeader>
        <Title>Color Theme</Title>
        <Description>Choose your preferred color theme for the application.</Description>
        <CurrentTheme>
          Currently using: <strong>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</strong>
        </CurrentTheme>
      </ThemeHeader>

      <ThemeOptions>
        <ThemeOption 
          active={theme === 'light'} 
          onClick={() => handleThemeChange('light')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ThemePreview $light>
            <PreviewHeader $light />
            <PreviewContent $light>
              <PreviewItem $light />
              <PreviewItem $light />
              <PreviewItem $light />
            </PreviewContent>
          </ThemePreview>
          <ThemeName>Light Mode</ThemeName>
          {theme === 'light' && (
            <ActiveIndicator>
              <ActiveDot />
              Active
            </ActiveIndicator>
          )}
        </ThemeOption>

        <ThemeOption 
          active={theme === 'dark'} 
          onClick={() => handleThemeChange('dark')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ThemePreview>
            <PreviewHeader />
            <PreviewContent>
              <PreviewItem />
              <PreviewItem />
              <PreviewItem />
            </PreviewContent>
          </ThemePreview>
          <ThemeName>Dark Mode</ThemeName>
          {theme === 'dark' && (
            <ActiveIndicator>
              <ActiveDot />
              Active
            </ActiveIndicator>
          )}
        </ThemeOption>
      </ThemeOptions>
    </ThemeContainer>
  );
};

// Styled components
const ThemeContainer = styled.div`
  padding: 24px;
`;

const ThemeHeader = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h2`
  ${headingTitle}
  margin-bottom: 8px;
`;

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme?.text?.secondary || '#7e88c3'};
  margin: 0 0 16px 0;
`;

const CurrentTheme = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme?.text?.secondary || '#7e88c3'};
  
  strong {
    color: ${({ theme }) => theme?.text?.primary || '#004359'};
  }
`;

const ThemeOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ThemeOption = styled(motion.div)`
  cursor: pointer;
  padding: 24px;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: 2px solid ${props => props.active ? 
    props.theme?.colors?.purple || '#7c5dfa' : 
    props.theme?.borders || '#dfe3fa'};
  background-color: ${props => props.active ? 
    props.theme?.backgrounds?.card || '#ffffff' : 
    props.theme?.backgrounds?.main || '#f8f8fb'};
  position: relative;
  
  &:hover {
    border-color: ${({ theme }) => theme?.colors?.purple || '#7c5dfa'};
  }
`;

const ThemePreview = styled.div`
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  background-color: ${props => props.$light ? 
    props.theme?.backgrounds?.main || '#f8f8fb' : 
    props.theme?.backgrounds?.card || '#1e2139'};
  border: 1px solid ${props => props.$light ? 
    props.theme?.borders || '#dfe3fa' : 
    props.theme?.borders || '#252945'};
`;

const PreviewHeader = styled.div`
  height: 48px;
  background-color: ${props => props.$light ? 
    props.theme?.backgrounds?.card || '#ffffff' : 
    props.theme?.backgrounds?.main || '#141625'};
  border-bottom: 1px solid ${props => props.$light ? 
    props.theme?.borders || '#dfe3fa' : 
    props.theme?.borders || '#252945'};
`;

const PreviewContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PreviewItem = styled.div`
  height: 32px;
  border-radius: 4px;
  background-color: ${props => props.$light ? 
    props.theme?.backgrounds?.card || '#ffffff' : 
    props.theme?.backgrounds?.main || '#252945'};
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05);
`;

const ThemeName = styled.div`
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme?.text?.primary || '#004359'};
  margin-bottom: 8px;
`;

const ActiveIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: ${({ theme }) => theme?.colors?.purple || '#7c5dfa'};
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 4px;
`;

const ActiveDot = styled.div`
  width: 6px;
  height: 6px;
  background-color: white;
  border-radius: 50%;
`;

export default ColorTheme; 