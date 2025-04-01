import styled from 'styled-components';

export const Container = styled.div`
    padding: 1.5rem 2rem;
    background-color: ${({ theme }) => theme.colors.background};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    position: sticky;
    bottom: 0;
    z-index: 10;
`;

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    max-width: 616px;
    margin: 0 auto;

    @media (min-width: 768px) {
        max-width: 720px;
    }

    @media (min-width: 1440px) {
        max-width: 730px;
    }
`; 