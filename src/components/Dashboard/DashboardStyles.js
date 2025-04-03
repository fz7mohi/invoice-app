import styled from 'styled-components';
import { headingTitle, headingMedium } from '../../utilities/typographyStyles';

export const Container = styled.div`
    padding: 16px;
    width: 100%;
    margin: 0 auto;
    max-width: 1400px;

    @media (min-width: 768px) {
        padding: 24px;
    }

    @media (min-width: 1024px) {
        padding: 32px;
    }
`;

export const Header = styled.div`
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    @media (min-width: 768px) {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
    }
`;

export const Title = styled.h1`
    ${headingTitle}
    margin: 0;
    font-size: 24px;

    @media (min-width: 768px) {
        font-size: 32px;
    }
`;

export const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 32px;

    @media (min-width: 480px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
    }

    @media (min-width: 1024px) {
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
    }
`;

export const StatCard = styled.div`
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease-in-out;
    border: 1px solid ${({ theme }) => `${theme.colors.purple}30`};
    height: 100%;
    min-height: 80px;

    @media (min-width: 768px) {
        padding: 20px;
        min-height: 100px;
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
        border-color: ${({ theme }) => `${theme.colors.purple}60`};
    }
`;

export const StatIcon = styled.div`
    width: 36px;
    height: 36px;
    min-width: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-in-out;
    border: 1px solid ${({ theme }) => `${theme.colors.purple}10`};

    @media (min-width: 768px) {
        width: 40px;
        height: 40px;
        min-width: 40px;
        border-radius: 10px;
    }

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
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 4px;
    line-height: 1.2;

    @media (min-width: 768px) {
        font-size: 20px;
    }
`;

export const StatLabel = styled.div`
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textTertiary};
    font-weight: 500;

    @media (min-width: 768px) {
        font-size: 13px;
    }
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
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
    border: 1px solid ${({ theme }) => `${theme.colors.purple}15`};
    margin-bottom: 24px;
    overflow: hidden;

    @media (min-width: 768px) {
        padding: 32px;
        border-radius: 16px;
        margin-bottom: 48px;
    }
`;

export const ClientsHeader = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;

    @media (min-width: 768px) {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
        gap: 16px;
    }
`;

export const SearchBar = styled.div`
    display: flex;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    border-radius: 8px;
    padding: 8px 12px;
    border: 1px solid ${({ theme }) => `${theme.colors.purple}10`};
    width: 100%;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.05);

    @media (min-width: 768px) {
        width: auto;
        min-width: 280px;
        padding: 8px 16px;
        border-radius: 12px;
    }
`;

export const SearchInput = styled.input`
    border: none;
    background: none;
    padding: 0;
    margin-left: 8px;
    flex: 1;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textPrimary};
    outline: none;

    &::placeholder {
        color: ${({ theme }) => theme.colors.textTertiary};
    }
`;

export const SearchIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ClientsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
    max-height: 70vh;
    overflow-y: auto;
    padding-right: 4px;

    @media (min-width: 768px) {
        gap: 20px;
        margin-bottom: 32px;
        max-height: none;
        overflow-y: visible;
        padding-right: 0;
    }

    /* Custom scrollbar for mobile */
    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.colors.backgroundAlt};
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => `${theme.colors.purple}30`};
        border-radius: 4px;
    }
`;

export const ClientItem = styled.div`
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    transition: all 0.2s ease-in-out;
    border: 1px solid ${({ theme }) => `${theme.colors.purple}10`};
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.05);

    @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        border-radius: 12px;
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
        border-color: ${({ theme }) => `${theme.colors.purple}20`};
    }
`;

export const ClientInfo = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

export const ClientName = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const ClientEmail = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textTertiary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const ClientStats = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    width: 100%;

    @media (min-width: 768px) {
        display: flex;
        gap: 24px;
        width: auto;
    }
`;

export const StatItem = styled.div`
    text-align: center;
    padding: 8px 4px;
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    border-radius: 6px;
    border: 1px solid ${({ theme }) => `${theme.colors.purple}10`};
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);

    @media (min-width: 768px) {
        padding: 12px;
        border-radius: 8px;
    }
`;

export const ClientStatValue = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (min-width: 768px) {
        font-size: 16px;
        margin-bottom: 4px;
    }
`;

export const ClientStatLabel = styled.div`
    font-size: 11px;
    color: ${({ theme }) => theme.colors.textTertiary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (min-width: 768px) {
        font-size: 12px;
    }
`;

export const Pagination = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-top: 8px;

    @media (min-width: 768px) {
        flex-direction: row;
        justify-content: center;
        gap: 24px;
        margin-top: 0;
    }
`;

export const PageButton = styled.button`
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    border: 1px solid ${({ theme }) => `${theme.colors.purple}20`};
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textPrimary};
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    width: 100%;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.05);

    @media (min-width: 768px) {
        width: auto;
        padding: 8px 16px;
    }

    &:hover:not(:disabled) {
        background-color: ${({ theme }) => theme.colors.backgroundItem};
        border-color: ${({ theme }) => `${theme.colors.purple}40`};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const PageInfo = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textTertiary};
    text-align: center;
    padding: 4px 0;
`;

export const ErrorMessage = styled.div`
    color: ${({ theme }) => theme.colors.error};
    font-size: 14px;
    padding: 16px;
    background-color: ${({ theme }) => `${theme.colors.error}15`};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => `${theme.colors.error}30`};
    margin-bottom: 24px;
    text-align: center;
`; 