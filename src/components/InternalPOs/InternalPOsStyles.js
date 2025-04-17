import styled from 'styled-components';
import { motion } from 'framer-motion';

export const StyledInternalPOs = styled(motion.div)`
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
`;

export const Header = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 32px;
`;

export const HeaderTop = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const Info = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const Title = styled.h1`
    font-size: 32px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
`;

export const Subtitle = styled.p`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
`;

export const Filter = styled.select`
    padding: 8px 16px;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.bgPrimary};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 14px;
    cursor: pointer;
    outline: none;
    transition: all 0.2s ease;

    &:hover {
        border-color: ${({ theme }) => theme.colors.purple};
    }

    &:focus {
        border-color: ${({ theme }) => theme.colors.purple};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.purpleLight};
    }
`;

export const SearchBar = styled.div`
    width: 100%;
`;

export const SearchContainer = styled.div`
    position: relative;
    width: 100%;
`;

export const SearchIcon = styled.div`
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textSecondary};
`;

export const SearchInput = styled.input`
    width: 100%;
    padding: 12px 16px 12px 40px;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.bgPrimary};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;

    &:hover {
        border-color: ${({ theme }) => theme.colors.purple};
    }

    &:focus {
        border-color: ${({ theme }) => theme.colors.purple};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.purpleLight};
    }

    &::placeholder {
        color: ${({ theme }) => theme.colors.textSecondary};
    }
`;

export const List = styled(motion.div)`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const EmptyList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
    background-color: ${({ theme }) => theme.colors.bgInvoiceItem};
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const EmptyListImage = styled.img`
    width: 200px;
    height: 200px;
    margin-bottom: 24px;
`;

export const EmptyListTitle = styled.h3`
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
`;

export const EmptyListText = styled.p`
    margin: 0;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textSecondary};
    max-width: 400px;
`;

export const NewButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    background-color: ${({ theme }) => theme.colors.purple};
    color: ${({ theme }) => theme.colors.white};
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: ${({ theme }) => theme.colors.purpleDark};
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.purpleLight};
    }
`;

export const StyledInternalPOItem = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr auto;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: translateY(-2px);
    }

    .id {
        font-weight: 700;
        color: ${({ theme }) => theme.colors.text.primary};

        span {
            color: ${({ theme }) => theme.colors.text.secondary};
        }
    }

    .due-date,
    .client-name,
    .total {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: ${({ theme }) => theme.colors.text.secondary};

        svg {
            color: ${({ theme }) => theme.colors.text.tertiary};
        }
    }

    .status {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-weight: 600;
        text-transform: capitalize;
        color: white;
    }

    .chevron {
        color: ${({ theme }) => theme.colors.primary};
    }
`; 