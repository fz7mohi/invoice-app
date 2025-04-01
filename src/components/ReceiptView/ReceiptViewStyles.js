import styled from 'styled-components';
import { motion } from 'framer-motion';

export const StyledReceiptView = styled.main`
    padding: 32px 24px;
    max-width: 1020px;
    margin: 0 auto;

    @media (min-width: 768px) {
        padding: 48px;
    }

    @media (min-width: 1024px) {
        padding: 72px 48px;
        max-width: 1100px;
    }
`;

export const Container = styled.div`
    width: 100%;
`;

export const GoBack = styled.button`
    background: none;
    border: none;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 24px;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 12px;
    font-weight: 700;
    line-height: 1.25;
    margin-bottom: 32px;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
        color: ${({ theme }) => theme.colors.purple};
    }
`;

export const Card = styled.div`
    background: ${({ theme }) => theme.colors.cardBg};
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 32px;

    @media (min-width: 768px) {
        padding: 32px;
    }
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;

    h2 {
        color: ${({ theme }) => theme.colors.textPrimary};
        font-size: 16px;
        font-weight: 700;
        line-height: 1.5;
        letter-spacing: -0.5px;
        margin-bottom: 4px;

        span {
            color: ${({ theme }) => theme.colors.textTertiary};
        }
    }

    p {
        color: ${({ theme }) => theme.colors.textSecondary};
        font-size: 12px;
        line-height: 1.25;
    }
`;

export const Status = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 6px;
    background: ${({ status, theme }) => {
        switch (status) {
            case 'paid':
                return theme.colors.statusPaidBg;
            case 'pending':
                return theme.colors.statusPendingBg;
            default:
                return theme.colors.statusDraftBg;
        }
    }};
    color: ${({ status, theme }) => {
        switch (status) {
            case 'paid':
                return theme.colors.statusPaidText;
            case 'pending':
                return theme.colors.statusPendingText;
            default:
                return theme.colors.statusDraftText;
        }
    }};
    font-weight: 700;
    font-size: 12px;
    line-height: 1.25;
    text-transform: capitalize;
`;

export const StatusDot = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ status, theme }) => {
        switch (status) {
            case 'paid':
                return theme.colors.statusPaidText;
            case 'pending':
                return theme.colors.statusPendingText;
            default:
                return theme.colors.statusDraftText;
        }
    }};
`;

export const Body = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
`;

export const Row = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
`;

export const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const Label = styled.span`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    line-height: 1.25;
    margin-bottom: 4px;
`;

export const Value = styled.span`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 14px;
    font-weight: 700;
    line-height: 1.25;
`;

export const Table = styled.div`
    width: 100%;
    background: ${({ theme }) => theme.colors.tableBg};
    border-radius: 8px 8px 0 0;
    padding: 32px;
`;

export const TableHeader = styled.div`
    margin-bottom: 32px;
`;

export const TableBody = styled.div``;

export const TableRow = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 16px;
    align-items: center;
    padding: 12px 0;

    &:not(:last-child) {
        border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
    }
`;

export const TableCell = styled.div`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 12px;
    font-weight: 700;
    line-height: 1.25;
    text-align: ${({ align }) => align || 'left'};

    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4) {
        text-align: right;
    }
`;

export const Total = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: ${({ theme }) => theme.colors.totalBg};
    border-radius: 0 0 8px 8px;
    padding: 32px;

    span:first-child {
        color: ${({ theme }) => theme.colors.white};
        font-size: 12px;
        line-height: 1.25;
    }

    span:last-child {
        color: ${({ theme }) => theme.colors.white};
        font-size: 24px;
        font-weight: 700;
        line-height: 1.25;
    }
`;

export const Actions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 32px;
`;

export const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    padding: 48px;
    text-align: center;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
`; 