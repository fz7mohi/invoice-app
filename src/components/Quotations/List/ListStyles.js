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
    width: 100%;
    padding: 0;
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

    a {
        padding: 20px 32px;
        width: 100%;
    }

    @media (max-width: 767px) {
        a {
            padding: 16px;
            flex-direction: column;
            gap: 16px;

            > div {
                grid-template-areas:
                    "id status"
                    "project project"
                    "client client"
                    "date price"
                    "arrow arrow";
                grid-template-columns: 1fr auto;
                gap: 12px;
            }
        }
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
    color: ${({ theme }) => theme.colors.textTertiary};
    margin-right: 4px;
`;

export const ClientName = styled.p`
    grid-area: client;
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
    }
`;

export const TotalPrice = styled.p`
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
    background-color: ${({ status }) => {
        switch (status) {
            case 'pending':
                return 'rgba(255, 143, 0, 0.1)';
            case 'invoiced':
                return 'rgba(51, 214, 159, 0.1)';
            case 'draft':
                return 'rgba(223, 227, 250, 0.1)';
            default:
                return 'rgba(223, 227, 250, 0.1)';
        }
    }};
    color: ${({ status }) => {
        switch (status) {
            case 'pending':
                return '#FF8F00';
            case 'invoiced':
                return '#33D69F';
            case 'draft':
                return '#DFE3FA';
            default:
                return '#DFE3FA';
        }
    }};
`;

export const StatusDot = styled.div`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 6px;
    flex-shrink: 0;
    background-color: ${({ status }) => {
        switch (status) {
            case 'pending':
                return '#FF8F00';
            case 'invoiced':
                return '#33D69F';
            case 'draft':
                return '#DFE3FA';
            default:
                return '#DFE3FA';
        }
    }};
    box-shadow: 0 0 0 2px ${({ status }) => {
        switch (status) {
            case 'pending':
                return 'rgba(255, 143, 0, 0.2)';
            case 'invoiced':
                return 'rgba(51, 214, 159, 0.2)';
            case 'draft':
                return 'rgba(223, 227, 250, 0.2)';
            default:
                return 'rgba(223, 227, 250, 0.2)';
        }
    }};
`; 