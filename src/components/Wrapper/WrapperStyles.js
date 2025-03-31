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
