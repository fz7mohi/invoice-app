import styled from 'styled-components';
import { headingTitle, headingMedium } from '../../utilities/typographyStyles';

export const Container = styled.div`
    padding: 32px 24px;
    width: 100%;
    margin: 0 auto;
    max-width: 100%;
    min-height: 100vh;
    background-color: ${({ theme }) => theme.colors.backgroundPrimary};

    @media (min-width: 768px) {
        width: 100%;
        max-width: 95%;
        margin: 0 auto;
        padding: 56px 24px;
    }
    
    @media (min-width: 1024px) {
        max-width: 90%;
        padding: 72px 32px 40px;
    }
    
    @media (min-width: 1440px) {
        max-width: 1300px;
        padding: 72px 40px 40px;
    }
`;

export const Header = styled.div`
    margin-bottom: 40px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    @media (min-width: 768px) {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 48px;
    }
`;

export const Title = styled.h1`
    ${headingTitle}
    margin: 0;
    font-size: 28px;
    color: ${({ theme }) => theme.colors.textPrimary};
    letter-spacing: -0.5px;

    @media (min-width: 768px) {
        font-size: 36px;
    }
`;

export const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 40px;

    @media (min-width: 480px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
        margin-bottom: 48px;
    }

    @media (min-width: 1024px) {
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
    }
`;

export const StatCard = styled.div`
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    border-radius: 16px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
    border: 1px solid ${({ theme }) => `${theme.colors.purple}35`};
    height: 100%;
    min-height: 100px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, ${({ theme }) => theme.colors.purple}, ${({ theme }) => theme.colors.blueGrayish});
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    @media (min-width: 768px) {
        padding: 28px;
        min-height: 120px;
    }

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.08);
        border-color: ${({ theme }) => `${theme.colors.purple}30`};

        &::before {
            opacity: 1;
        }
    }
`;

export const StatIcon = styled.div`
    width: 48px;
    height: 48px;
    min-width: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => `${theme.colors.purple}10`};
    border: 1px solid ${({ theme }) => `${theme.colors.purple}15`};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, ${({ theme }) => `${theme.colors.purple}10`}, transparent);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    @media (min-width: 768px) {
        width: 56px;
        height: 56px;
        min-width: 56px;
        border-radius: 16px;
    }

    ${StatCard}:hover & {
        transform: scale(1.05) rotate(-5deg);
        background-color: ${({ theme }) => `${theme.colors.purple}15`};
        border-color: ${({ theme }) => `${theme.colors.purple}25`};

        &::after {
            opacity: 1;
        }
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
    margin-bottom: 6px;
    line-height: 1.2;
    letter-spacing: -0.5px;

    @media (min-width: 768px) {
        font-size: 24px;
    }
`;

export const StatLabel = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textTertiary};
    font-weight: 500;
    letter-spacing: 0.2px;

    @media (min-width: 768px) {
        font-size: 15px;
    }
`;

export const RecentActivity = styled.div`
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid ${({ theme }) => `${theme.colors.purple}15`};
    margin-bottom: 32px;

    h2 {
        ${headingMedium}
        margin-bottom: 32px;
        font-size: 20px;
        color: ${({ theme }) => theme.colors.textPrimary};

        @media (min-width: 768px) {
            font-size: 24px;
        }
    }
`;

export const ActivityList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const ActivityItem = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 16px;
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    border-radius: 12px;
    border: 1px solid ${({ theme }) => `${theme.colors.purple}10`};
    transition: all 0.2s ease-in-out;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.05);
        border-color: ${({ theme }) => `${theme.colors.purple}20`};
    }
`;

export const ActivityIcon = styled.div`
    width: 36px;
    height: 36px;
    min-width: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => `${theme.colors.purple}10`};
    border: 1px solid ${({ theme }) => `${theme.colors.purple}15`};
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

export const ActivityDate = styled.div`
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
    border-radius: 16px;
    border: 1px dashed ${({ theme }) => `${theme.colors.purple}20`};
    margin: 32px 0;
`;

export const EmptyIcon = styled.div`
    margin-bottom: 16px;
`;

export const EmptyText = styled.div`
    font-size: 16px;
    color: ${({ theme }) => theme.colors.textTertiary};
    font-weight: 500;
`;

export const ClientsStatement = styled.div`
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
    border: 1px solid ${({ theme }) => `${theme.colors.purple}35`};
    margin-bottom: 40px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
        box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.08);
        border-color: ${({ theme }) => `${theme.colors.purple}25`};
    }

    @media (min-width: 768px) {
        padding: 36px;
        margin-bottom: 56px;
    }
`;

export const ClientsHeader = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;

    @media (min-width: 768px) {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
        gap: 24px;
    }
`;

export const ClientsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
`;

export const ClientItem = styled.div`
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid ${({ theme }) => `${theme.colors.purple}10`};
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(180deg, ${({ theme }) => theme.colors.purple}, ${({ theme }) => theme.colors.blueGrayish});
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
        padding: 28px;
    }

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.08);
        border-color: ${({ theme }) => `${theme.colors.purple}20`};

        &::before {
            opacity: 1;
        }
    }
`;

export const ClientInfo = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
`;

export const ClientName = styled.div`
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: -0.3px;

    @media (min-width: 768px) {
        font-size: 20px;
    }
`;

export const ClientEmail = styled.div`
    font-size: 15px;
    color: ${({ theme }) => theme.colors.textTertiary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: 0.2px;
`;

export const ClientStats = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    width: 100%;

    @media (min-width: 768px) {
        display: flex;
        gap: 16px;
        width: auto;
    }
`;

export const StatItem = styled.div`
    text-align: center;
    padding: 16px;
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    border-radius: 12px;
    border: 1px solid ${({ theme }) => `${theme.colors.purple}10`};
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, ${({ theme }) => `${theme.colors.purple}05`}, transparent);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.08);
        border-color: ${({ theme }) => `${theme.colors.purple}20`};

        &::after {
            opacity: 1;
        }
    }
`;

export const ClientStatValue = styled.div`
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: -0.3px;

    @media (min-width: 768px) {
        font-size: 20px;
        margin-bottom: 8px;
    }
`;

export const ClientStatLabel = styled.div`
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textTertiary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: 0.2px;

    @media (min-width: 768px) {
        font-size: 14px;
    }
`;

export const Pagination = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-top: 16px;

    @media (min-width: 768px) {
        flex-direction: row;
        justify-content: center;
        gap: 16px;
        margin-top: 24px;
    }
`;

export const PageButton = styled.button`
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    border: 1px solid ${({ theme }) => `${theme.colors.purple}15`};
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textPrimary};
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    min-width: 100px;
    text-align: center;

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
    font-weight: 500;
`;

export const SearchBar = styled.div`
    display: flex;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    border-radius: 12px;
    padding: 12px 16px;
    border: 1px solid ${({ theme }) => `${theme.colors.purple}15`};
    width: 100%;
    max-width: 320px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);

    &:focus-within {
        transform: translateY(-2px);
        box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.08);
        border-color: ${({ theme }) => `${theme.colors.purple}30`};
    }
`;

export const SearchInput = styled.input`
    border: none;
    background: transparent;
    outline: none;
    width: 100%;
    font-size: 15px;
    color: ${({ theme }) => theme.colors.textPrimary};
    padding: 4px 8px;
    letter-spacing: 0.2px;

    &::placeholder {
        color: ${({ theme }) => theme.colors.textTertiary};
    }
`;

export const SearchIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.textTertiary};
    transition: color 0.3s ease;

    ${SearchBar}:focus-within & {
        color: ${({ theme }) => theme.colors.purple};
    }
`;

export const ErrorMessage = styled.div`
    color: ${({ theme }) => theme.colors.error};
    background-color: ${({ theme }) => `${theme.colors.error}15`};
    border: 1px solid ${({ theme }) => `${theme.colors.error}30`};
    border-radius: 12px;
    padding: 20px;
    margin: 20px 0;
    font-size: 15px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
`; 