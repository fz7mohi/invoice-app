import styled from 'styled-components';
import { motion } from 'framer-motion';

export const StyledList = styled(motion.div)`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    padding: 0 16px;

    @media (min-width: 768px) {
        padding: 0 24px;
    }
`;

export const Item = styled(motion.div)`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    padding: 20px;
    border-radius: 12px;
    background-color: ${({ theme }) => theme.invoiceItem};
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: all 0.2s ease;
    border: 1px solid rgba(223, 227, 250, 0.1);
    position: relative;
    overflow: hidden;

    &:hover {
        border-color: rgba(124, 93, 250, 0.3);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        transform: translateY(-1px);
    }

    @media (max-width: 767px) {
        flex-direction: column;
        gap: 16px;
        padding: 16px;
    }
`;

export const Link = styled.div`
    display: grid;
    grid-template-areas:
        'date id client'
        'amount status arrow';
    gap: 8px;
    width: 100%;

    @media (min-width: 768px) {
        grid-template-areas: 'date id client amount status arrow';
        grid-template-columns: 120px 100px 140px 120px 100px 20px;
        align-items: center;
        gap: 16px;
    }

    @media (min-width: 1024px) {
        grid-template-columns: 140px 120px 160px 140px 120px 20px;
    }
`;

export const PaymentDue = styled.span`
    grid-area: date;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    line-height: 1.25;
`;

export const Uid = styled.span`
    grid-area: id;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 12px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.25px;
    display: flex;
    align-items: center;
    gap: 4px;
`;

export const Hashtag = styled.span`
    color: ${({ theme }) => theme.colors.textTertiary};
`;

export const ClientName = styled.span`
    grid-area: client;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    line-height: 1.25;
    text-align: right;

    @media (min-width: 768px) {
        text-align: left;
    }
`;

export const Description = styled.span`
    grid-area: description;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    line-height: 1.25;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    
    @media (max-width: 767px) {
        display: block;
        margin-top: 4px;
        color: ${({ theme }) => theme.colors.text};
        font-size: 13px;
        line-height: 1.4;
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
        width: 100%;
        padding: 8px 12px;
        background-color: rgba(223, 227, 250, 0.1);
        border-radius: 6px;
    }
`;

export const AmountPaid = styled.span`
    grid-area: amount;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 16px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.8px;
    display: flex;
    align-items: center;
    gap: 16px;

    @media (min-width: 768px) {
        font-size: 14px;
        letter-spacing: -0.7px;
    }
`;

export const StatusBadge = styled.div`
    grid-area: status;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px;
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

export const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    color: ${({ theme }) => theme.colors.textTertiary};
    font-size: 14px;
`; 