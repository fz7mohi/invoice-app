import React from 'react';
import { StyledWrapper, ContentContainer } from './WrapperStyles';
import MobileTabBar from '../Navigation/MobileTabBar';

const Wrapper = ({ children }) => {
    return (
        <StyledWrapper>
            <ContentContainer>
                {children}
            </ContentContainer>
            <MobileTabBar />
        </StyledWrapper>
    );
};

export default Wrapper;
