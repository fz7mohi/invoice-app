import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { headingTitle } from '../../utilities/typographyStyles';

export const Container = styled.section`
    width: 100%;
    max-width: 1020px;
    margin: 0 auto;
    padding: 32px 24px;

    @media (min-width: 768px) {
        padding: 56px 48px;
    }

    @media (min-width: 1024px) {
        padding: 72px 48px;
        max-width: 1100px;
    }
`;

export const Header = styled(motion.header)`
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 32px;

    @media (min-width: 768px) {
        margin-bottom: 40px;
    }
`;

export const HeaderTop = styled.div`
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: 24px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr auto auto;
        gap: 16px;
    }
`;

export const SearchBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    background-color: #252945;
    border-radius: 8px;
    border: 1px solid #252945;
    transition: all 0.2s ease;

    @media (min-width: 768px) {
        padding: 16px 32px;
    }
`;

export const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    max-width: 400px;
`;

export const SearchInput = styled.input`
    background: none;
    border: none;
    color: #FFFFFF;
    font-size: 14px;
    width: 100%;
    padding: 0;
    margin: 0;
    outline: none;

    &::placeholder {
        color: #888EB0;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
        -webkit-text-fill-color: #FFFFFF;
        -webkit-box-shadow: 0 0 0px 1000px #252945 inset;
        transition: background-color 5000s ease-in-out 0s;
    }
`;

export const SearchIcon = styled.span`
    color: #888EB0;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;

    ${SearchContainer}:focus-within & {
        color: #7C5DFA;
    }
`;

export const Info = styled.div``;

export const Title = styled.h1`
    ${headingTitle}
    margin-bottom: 4px;
`;

export const Text = styled.p`
    color: ${({ theme }) => theme.colors.textTertiary};
    transition: color 400ms ease-in;
`;

export const Content = styled.div`
    background-color: ${({ theme }) => theme.colors.surface};
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

export const TableHeader = styled.thead`
    background-color: ${({ theme }) => theme.colors.background};
`;

export const HeaderCell = styled.th`
    padding: 16px;
    text-align: left;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 500;
    font-size: 14px;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: ${({ theme }) => theme.colors.background};
    }
`;

export const TableCell = styled.td`
    padding: 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
`;

export const StatusBadge = styled.div`
    display: inline-flex;
    align-items: center;
`;

export const ActionButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

export const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
    background-color: ${({ theme }) => theme.colors.surface};
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    h3 {
        margin: 0 0 16px 0;
        font-size: 18px;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.text};
    }
    
    p {
        margin: 0;
        font-size: 14px;
        color: ${({ theme }) => theme.colors.textSecondary};
        max-width: 400px;
    }
`;

export const LoadingState = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    text-align: center;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.surface};
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    @media (max-width: 767px) {
        padding: 32px 16px;
    }
`;

export const Pagination = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 20px;
`;

export const PageButton = styled.button`
    background-color: ${({ theme }) => theme.colors.background};
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
        background-color: ${({ theme }) => theme.colors.primary};
        color: white;
        border-color: ${({ theme }) => theme.colors.primary};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const PageInfo = styled.span`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
`;

export const MobileList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const MobileItem = styled(motion.div)`
    background-color: ${({ theme }) => theme.colors.surface};
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: translateY(-2px);
    }
`;

export const MobileItemHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
`;

export const MobileItemTitle = styled.h3`
    font-size: 16px;
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
`;

export const MobileItemStatus = styled.div``;

export const MobileItemContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const MobileItemRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const MobileItemLabel = styled.span`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
`;

export const MobileItemValue = styled.span`
    color: ${({ theme }) => theme.colors.text};
    font-size: 14px;
    font-weight: 500;
`;

export const MobileItemActions = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
`;