import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    headingExtraSmall,
    headingMedium,
} from '../../../utilities/typographyStyles';

export const StyledList = styled.ul`
    display: flex;
    flex-flow: column;
    gap: 16px;
    width: 100%;
    max-width: 100%;
    padding: 0;
    margin: 0;
    list-style: none;
`;

export const Item = styled(motion.li)`
    background-color: ${({ theme }) => theme.colors.surface};
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
`;

export const Link = styled(RouterLink)`
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 24px;
    padding: 24px;
    border: 1px solid transparent;
    border-radius: 12px;
    transition: all 0.3s ease;
    text-decoration: none;
    position: relative;

    @media (max-width: 767px) {
        grid-template-areas:
            "id status"
            "project project"
            "supplier supplier"
            "date price";
        grid-template-columns: 1fr auto;
        gap: 12px;
        padding: 20px;
    }

    @media (min-width: 768px) {
        display: grid;
        grid-template-areas: "date supplier project id price status arrow";
        grid-template-columns: 100px 130px 130px 90px 130px 90px 20px;
        align-items: center;
        padding: 20px 32px;
        gap: 16px;
    }

    @media (min-width: 1024px) {
        grid-template-columns: 110px 160px 160px 100px 150px 120px 20px;
        padding: 20px 32px;
    }

    @media (min-width: 1440px) {
        grid-template-columns: 120px 180px 180px 120px 160px 140px 20px;
    }

    &:focus {
        outline: none;
    }

    &:focus-visible {
        border: 1px solid ${({ theme }) => theme.colors.purple};
        box-shadow: 0 0 0 3px rgba(124, 93, 250, 0.2);
    }

    &:hover {
        border: 1px solid ${({ theme }) => theme.colors.purple};
    }
    
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 5%;
        width: 90%;
        height: 1px;
        background: linear-gradient(to right, 
            transparent, 
            rgba(223, 227, 250, 0.3), 
            transparent);
    }
`;

export const Uid = styled.p`
    ${headingExtraSmall}
    grid-area: id;
    font-size: 13px;
    display: flex;
    align-items: center;
    font-weight: 600;
    letter-spacing: 0.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 767px) {
        font-size: 12px;
    }
`;

export const Hashtag = styled.span`
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-right: 4px;
`;

export const PaymentDue = styled.p`
    ${headingExtraSmall}
    grid-area: date;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textSecondary};
    white-space: nowrap;

    @media (max-width: 767px) {
        font-size: 12px;
    }
`;

export const SupplierName = styled.p`
    ${headingExtraSmall}
    grid-area: supplier;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 767px) {
        font-size: 12px;
    }
`;

export const Description = styled.p`
    ${headingExtraSmall}
    grid-area: project;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textSecondary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 767px) {
        font-size: 12px;
    }
`;

export const TotalPrice = styled.p`
    ${headingMedium}
    grid-area: price;
    font-size: 14px;
    font-weight: 700;
    justify-self: end;
    white-space: nowrap;
    letter-spacing: 0.5px;
    padding-right: 24px;

    @media (max-width: 767px) {
        font-size: 13px;
        padding-right: 0;
    }
`;

export const StatusBadge = styled.div`
    grid-area: status;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    background-color: ${({ theme, currStatus }) => {
        switch (currStatus) {
            case 'pending':
                return theme.colors.pendingBg;
            case 'approved':
                return theme.colors.paidBg;
            case 'rejected':
                return theme.colors.voidBg;
            case 'void':
                return theme.colors.voidBg;
            default:
                return theme.colors.draftBg;
        }
    }};
    color: ${({ theme, currStatus }) => {
        switch (currStatus) {
            case 'pending':
                return theme.colors.pending;
            case 'approved':
                return theme.colors.paid;
            case 'rejected':
                return theme.colors.void;
            case 'void':
                return theme.colors.void;
            default:
                return theme.colors.draft;
        }
    }};

    @media (max-width: 767px) {
        justify-self: end;
    }
`;

export const StatusDot = styled.span`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${({ theme, currStatus }) => {
        switch (currStatus) {
            case 'pending':
                return theme.colors.pending;
            case 'approved':
                return theme.colors.paid;
            case 'rejected':
                return theme.colors.void;
            case 'void':
                return theme.colors.void;
            default:
                return theme.colors.draft;
        }
    }};
`;

export const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px;
    text-align: center;
`;

export const EmptyStateIcon = styled.div`
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 24px;
`;

export const EmptyStateText = styled.p`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 16px;
    margin: 0;
`;

export const LoadingState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px;
    text-align: center;
`;

export const LoadingSpinner = styled.div`
    width: 40px;
    height: 40px;
    border: 4px solid ${({ theme }) => theme.colors.border};
    border-top-color: ${({ theme }) => theme.colors.purple};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

export const LoadingText = styled.p`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 16px;
    margin: 0;
`; 