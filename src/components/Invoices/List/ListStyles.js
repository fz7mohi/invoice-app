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
`;

export const Item = styled(motion.li)`
    background-color: ${({ theme }) => theme.colors.bgInvoiceItem};
    border-radius: 8px;
     border: 1px solid rgba(223, 227, 250, 0.1);
    transition: transform 200ms ease-in-out;
    
    &:hover {
        transform: translateY(-1px);
    }
`;

export const Link = styled(RouterLink)`
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 24px;
    padding: 24px;
    border: 1px solid transparent;
    border-radius: 8px;
    transition: border 200ms ease-in-out;
    text-decoration: none;

    @media (max-width: 767px) {
        grid-template-areas:
            "id status"
            "project project"
            "client client"
            "date price";
        gap: 8px;
    }

    @media (min-width: 768px) {
        grid-template-columns: 110px 140px 100px 1fr 140px 100px 20px;
        grid-template-areas: "date project id client price status arrow";
        align-items: center;
        padding: 16px 24px;
        gap: 16px;
    }

    @media (min-width: 1024px) {
        grid-template-columns: 120px 180px 120px 1fr 160px 140px 20px;
    }

    @media (min-width: 1440px) {
        grid-template-columns: 140px 200px 140px 1fr 180px 160px 20px;
    }

    &:focus {
        outline: none;
    }

    &:focus-visible {
        border: 1px solid ${({ theme }) => theme.colors.purple};
    }

    &:hover {
        border: 1px solid ${({ theme }) => theme.colors.purple};
    }
`;

export const PaymentDue = styled.p`
    grid-area: date;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    transition: color 200ms ease-in-out;

    @media (max-width: 767px) {
        font-size: 13px;
    }
`;

export const Description = styled.p`
    grid-area: project;
    color: ${({ theme }) => theme.colors.textTertiary};
    font-size: 14px;
    transition: color 200ms ease-in-out;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 767px) {
        font-size: 13px;
        white-space: normal;
        line-height: 1.4;
    }
`;

export const Uid = styled.p`
    ${headingExtraSmall}
    grid-area: id;
    font-size: 14px;
    display: flex;
    align-items: center;

    @media (max-width: 767px) {
        font-size: 13px;
    }
`;

export const Hashtag = styled.span`
    color: ${({ theme }) => theme.colors.blueGrayish};
    margin-right: 4px;
`;

export const ClientName = styled.p`
    grid-area: client;
    color: ${({ theme }) => theme.colors.textTertiary};
    font-size: 14px;
    transition: color 200ms ease-in-out;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 767px) {
        font-size: 13px;
        white-space: normal;
    }
`;

export const TotalPrice = styled.p`
    ${headingMedium}
    grid-area: price;
    font-size: 16px;
    font-weight: 700;
    justify-self: end;
    white-space: nowrap;

    @media (max-width: 767px) {
        font-size: 15px;
    }
`;

export const StatusBadge = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    transition: all 0.2s ease;
    min-width: 104px;
    text-transform: capitalize;
    background-color: ${({ currStatus, theme }) => {
        switch (currStatus) {
            case 'paid':
                return 'rgba(51, 214, 159, 0.15)';
            case 'partially_paid':
                return 'rgba(73, 97, 255, 0.15)';
            case 'pending':
                return 'rgba(255, 143, 0, 0.15)';
            case 'void':
                return 'rgba(236, 87, 87, 0.15)';
            default:
                return 'rgba(223, 227, 250, 0.15)';
        }
    }};
    color: ${({ currStatus, theme }) => {
        switch (currStatus) {
            case 'paid':
                return '#33D69F';
            case 'partially_paid':
                return '#4961FF';
            case 'pending':
                return '#FF8F00';
            case 'void':
                return '#EC5757';
            default:
                return theme.colors.textTertiary;
        }
    }};
    border: 1px solid ${({ currStatus, theme }) => {
        switch (currStatus) {
            case 'paid':
                return 'rgba(51, 214, 159, 0.3)';
            case 'partially_paid':
                return 'rgba(73, 97, 255, 0.3)';
            case 'pending':
                return 'rgba(255, 143, 0, 0.3)';
            case 'void':
                return 'rgba(236, 87, 87, 0.3)';
            default:
                return 'rgba(223, 227, 250, 0.3)';
        }
    }};
`;

export const StatusDot = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 8px;
    flex-shrink: 0;
    transition: all 0.2s ease;
    background-color: #DFE3FA;
    box-shadow: 0 0 0 2px rgba(223, 227, 250, 0.2);
`;
