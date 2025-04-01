import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Backdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
`;

export const StyledInvoiceFormController = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: 616px;
    background-color: ${({ theme }) => theme.colors.background};
    z-index: 1001;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    box-shadow: -10px 10px 10px -10px rgba(72, 84, 159, 0.1);

    @media (min-width: 768px) {
        padding: 0 2rem;
    }

    @media (min-width: 1440px) {
        max-width: 730px;
    }
`;

export const BackLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    padding: 2rem 0;
    color: ${({ theme }) => theme.colors.textSecondary};
    transition: color 0.2s ease;

    &:hover {
        color: ${({ theme }) => theme.colors.text};
    }
`;

export const BackIcon = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const BackText = styled.span`
    font-size: 0.875rem;
    font-weight: 700;
`; 