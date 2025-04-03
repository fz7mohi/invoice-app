import styled from 'styled-components';
import { headingTitle, headingMedium } from '../../utilities/typographyStyles';

export const Container = styled.div`
    padding: 24px 16px;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;

    @media (min-width: 768px) {
        padding: 32px 24px;
    }

    @media (min-width: 1024px) {
        padding: 40px 32px;
    }
`;

export const Header = styled.div`
    margin-bottom: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;

    @media (min-width: 768px) {
        margin-bottom: 48px;
    }
`;

export const Title = styled.h1`
    ${headingTitle}
    margin: 0;
`;

export const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 24px;
    margin-bottom: 48px;

    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
    }

    @media (min-width: 1024px) {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 24px;

        & > * {
            flex: 1;
            min-width: 240px;
            max-width: 320px;
        }

        & > *:nth-last-child(-n+2) {
            margin-left: auto;
            margin-right: auto;
        }
    }
`;

export const StatCard = styled.div`
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease-in-out;
    border: 1px solid ${({ theme }) => `${theme.colors.purple}30`};
    height: 100%;
    min-height: 100px;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.08);
        border-color: ${({ theme }) => `${theme.colors.purple}60`};
    }
`;

export const StatIcon = styled.div`
    width: 40px;
    height: 40px;
    min-width: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-in-out;
    border: 1px solid ${({ theme }) => `${theme.colors.purple}10`};

    ${StatCard}:hover & {
        transform: scale(1.05);
        border-color: ${({ theme }) => `${theme.colors.purple}20`};
    }
`;

export const StatContent = styled.div`
    flex: 1;
    min-width: 0;
`;

export const StatValue = styled.div`
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 4px;
    line-height: 1.2;

    @media (min-width: 768px) {
        font-size: 24px;
    }
`;

export const StatLabel = styled.div`
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textTertiary};
    font-weight: 500;
`;

export const RecentActivity = styled.div`
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid ${({ theme }) => `${theme.colors.purple}15`};

    h2 {
        ${headingMedium}
        margin-bottom: 32px;
        font-size: 20px;

        @media (min-width: 768px) {
            font-size: 24px;
        }
    }
`;

export const ActivityList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

export const ActivityItem = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 16px;
    border-radius: 12px;
    transition: all 0.2s ease-in-out;
    border: 1px solid transparent;

    &:hover {
        background-color: ${({ theme }) => theme.colors.backgroundAlt};
        border-color: ${({ theme }) => `${theme.colors.purple}20`};
    }
`;

export const ActivityIcon = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease-in-out;
    border: 1px solid ${({ theme }) => `${theme.colors.purple}10`};

    ${ActivityItem}:hover & {
        transform: scale(1.05);
        border-color: ${({ theme }) => `${theme.colors.purple}20`};
    }
`;

export const ActivityContent = styled.div`
    flex: 1;
`;

export const ActivityTitle = styled.div`
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 6px;
`;

export const ActivityTime = styled.div`
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textTertiary};
`;

export const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 64px 32px;
    text-align: center;
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    border-radius: 12px;
    border: 1px dashed ${({ theme }) => `${theme.colors.purple}20`};
`;

export const EmptyIcon = styled.div`
    margin-bottom: 24px;
    opacity: 0.5;
`;

export const EmptyText = styled.div`
    font-size: 16px;
    color: ${({ theme }) => theme.colors.textTertiary};
    font-weight: 500;
`;

export const ClientsStatement = styled.div`
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid ${({ theme }) => `${theme.colors.purple}15`};
    margin-bottom: 48px;
`;

export const ClientsHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 16px;

    @media (min-width: 768px) {
        margin-bottom: 40px;
    }
`;

export const SearchBar = styled.div`
    display: flex;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    border-radius: 12px;
    padding: 8px 16px;
    border: 1px solid ${({ theme }) => `${theme.colors.purple}10`};
    transition: all 0.2s ease-in-out;

    &:focus-within {
        border-color: ${({ theme }) => `${theme.colors.purple}30`};
        box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.purple}10`};
    }
`;

export const SearchIcon = styled.div`
    margin-right: 12px;
    opacity: 0.6;
`;

export const SearchInput = styled.input`
    background: none;
    border: none;
    outline: none;
    font-size: 15px;
    color: ${({ theme }) => theme.colors.textPrimary};
    width: 200px;

    &::placeholder {
        color: ${({ theme }) => theme.colors.textTertiary};
    }

    @media (min-width: 768px) {
        width: 300px;
    }
`;

export const ClientsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 32px;
`;

export const ClientItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    border-radius: 12px;
    border: 1px solid ${({ theme }) => `${theme.colors.purple}10`};
    transition: all 0.2s ease-in-out;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
        border-color: ${({ theme }) => `${theme.colors.purple}20`};
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }
`;

export const ClientInfo = styled.div`
    flex: 1;
`;

export const ClientName = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 4px;
`;

export const ClientEmail = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textTertiary};
`;

export const ClientStats = styled.div`
    display: flex;
    gap: 32px;
    align-items: center;

    @media (max-width: 768px) {
        width: 100%;
        justify-content: space-between;
    }
`;

export const StatItem = styled.div`
    text-align: center;
`;

export const ClientStatValue = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 4px;
`;

export const ClientStatLabel = styled.div`
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textTertiary};
`;

export const Pagination = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 32px;
`;

export const PageButton = styled.button`
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    border: 1px solid ${({ theme }) => `${theme.colors.purple}15`};
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textPrimary};
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover:not(:disabled) {
        background-color: ${({ theme }) => `${theme.colors.purple}10`};
        border-color: ${({ theme }) => `${theme.colors.purple}30`};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const PageInfo = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textTertiary};
`;

export const ErrorMessage = styled.div`
    background-color: ${({ theme }) => `${theme.colors.statusDraft}15`};
    color: ${({ theme }) => theme.colors.statusDraft};
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    font-size: 14px;
    border: 1px solid ${({ theme }) => `${theme.colors.statusDraft}30`};
    display: flex;
    align-items: center;
    gap: 12px;

    &::before {
        content: "⚠️";
        font-size: 16px;
    }
`; 