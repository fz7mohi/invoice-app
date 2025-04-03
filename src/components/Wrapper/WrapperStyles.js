import styled from 'styled-components';

export const StyledWrapper = styled.main`
    position: relative;
    display: flex;
    flex-flow: column;
    min-height: 100vh;
    background-color: ${(props) => props.theme?.backgrounds?.main || (props.theme?.mode === 'dark' ? '#141625' : '#f8f8fb')};
    transition: background-color 400ms ease-in-out;

    @media (min-width: 1024px) {
        flex-flow: row;
    }
`;

export const ContentContainer = styled.div`
    flex: 1;
    width: 100%;
    padding-bottom: 60px; /* Space for mobile tab bar */
    
    @media (min-width: 768px) {
        padding-bottom: 0; /* No padding needed on larger screens */
    }
`;
