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
    background-color: ${({ theme }) => theme.colors.bgInvoiceItem};
    border-radius: 12px;
    border: 1px solid rgba(223, 227, 250, 0.1);
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    }
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
            "client client"
            "date price";
        grid-template-columns: 1fr auto;
        gap: 12px;
        padding: 20px;
    }

    @media (min-width: 768px) {
        display: grid;
        grid-template-areas: "date client project id price status arrow";
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

export const PaymentDue = styled.p`
    grid-area: date;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 13px;
    transition: color 200ms ease-in-out;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 767px) {
        font-size: 12px;
    }
`;

export const Description = styled.p`
    grid-area: project;
    color: ${({ theme }) => theme.colors.textTertiary};
    font-size: 13px;
    transition: color 200ms ease-in-out;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;

    @media (max-width: 767px) {
        font-size: 12px;
        white-space: normal;
        line-height: 1.3;
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
    color: ${({ theme }) => theme.colors.blueGrayish};
    margin-right: 4px;
    opacity: 0.7;
`;

export const ClientName = styled.p`
    grid-area: client;
    font-size: 13px;
    font-weight: 700;
    transition: color 200ms ease-in-out;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;

    @media (max-width: 767px) {
        font-size: 12px;
        white-space: normal;
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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    border-radius: 24px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.2px;
    transition: all 0.3s ease;
    min-width: 90px;
    text-transform: capitalize;
    margin-right: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
    
    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
    }
`;

export const StatusDot = styled.div`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 6px;
    flex-shrink: 0;
    transition: all 0.3s ease;
    background-color: ${({ currStatus }) => {
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
                return '#DFE3FA';
        }
    }};
    box-shadow: 0 0 0 2px ${({ currStatus }) => {
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