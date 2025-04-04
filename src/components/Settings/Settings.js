import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../App/context';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import CompanyProfile from './CompanyProfile';
import ColorTheme from './ColorTheme';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { headingTitle } from '../../utilities/typographyStyles';

const Settings = () => {
  const { windowWidth, theme, toggleTheme, fortuneGiftsTheme } = useGlobalContext();
  const [activeTab, setActiveTab] = useState('profile');
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  console.log('Current theme:', theme);
  console.log('Fortune Gifts theme:', fortuneGiftsTheme);

  // Fetch companies when component mounts
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const companiesRef = collection(db, 'companies');
        const snapshot = await getDocs(companiesRef);
        const companiesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <Container>
      <Header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Info>
          <Title>Settings</Title>
          <Text>Manage your application preferences and company profiles.</Text>
        </Info>
      </Header>
      
      <TabsContainer>
        <Tab 
          onClick={() => setActiveTab('profile')} 
          active={activeTab === 'profile'}
        >
          Company Profile
        </Tab>
        <Tab 
          onClick={() => setActiveTab('theme')} 
          active={activeTab === 'theme'}
        >
          Color Theme
        </Tab>
      </TabsContainer>
      
      <ContentArea>
        <AnimatePresence mode="wait">
          {activeTab === 'profile' ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <CompanyProfile companies={companies} setCompanies={setCompanies} isLoading={isLoading} />
            </motion.div>
          ) : (
            <motion.div
              key="theme"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ColorTheme />
            </motion.div>
          )}
        </AnimatePresence>
      </ContentArea>
    </Container>
  );
};

// Styled components
const Container = styled.section`
  padding: 0 24px;
  margin-bottom: 40px;

  @media (min-width: 768px) {
    width: 100%;
    max-width: 95%;
    margin: 0 auto 40px auto;
    padding: 0;
  }
  
  @media (min-width: 1024px) {
    max-width: 90%;
  }
  
  @media (min-width: 1440px) {
    max-width: 1300px;
  }
`;

const Header = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin: 32px 0;

  @media (min-width: 768px) {
    gap: 12px;
  }

  @media (min-width: 1024px) {
    margin: 72px 0 64px 0;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  ${headingTitle}
  margin-bottom: 4px;
  color: ${({ theme }) => theme?.text?.primary || '#ffffff'};
`;

const Text = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme?.text?.secondary || '#7e88c3'};
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 32px;
  border-bottom: 1px solid ${({ theme }) => theme?.borders || '#dfe3fa'};
  background-color: ${({ theme }) => theme?.backgrounds?.card || '#ffffff'};
  border-radius: 8px;
  padding: 0 24px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.04);
`;

const Tab = styled.div`
  padding: 16px 24px;
  cursor: pointer;
  font-weight: ${props => props.active ? '700' : '500'};
  color: ${props => props.active ? 
    props.theme?.text?.primary || '#ffffff' : 
    props.theme?.text?.secondary || '#7e88c3'};
  border-bottom: 2px solid ${props => props.active ? 
    props.theme?.colors?.purple || '#7c5dfa' : 
    'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => !props.active && (props.theme?.text?.primary || '#ffffff')};
  }
`;

const ContentArea = styled.div`
  background-color: ${({ theme }) => theme?.backgrounds?.card || '#ffffff'};
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.04);
  min-height: 400px;
`;

export default Settings; 