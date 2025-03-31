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
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    min-width: 0;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        width: 100%;
    }
`;

export const Uid = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    color: #FFFFFF;
    font-weight: 600;
    font-size: 14px;
    min-width: 100px;
    padding: 4px 8px;
    background-color: rgba(124, 93, 250, 0.1);
    border-radius: 6px;

    @media (max-width: 768px) {
        font-size: 13px;
        padding: 3px 6px;
    }
`;

export const Hashtag = styled.span`
    color: #888EB0;
`;

export const PaymentDue = styled.div`
    color: #DFE3FA;
    font-size: 13px;
    min-width: 100px;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 4px;
        background-color: #888EB0;
        border-radius: 50%;
    }

    @media (max-width: 768px) {
        font-size: 12px;
        width: 100%;
    }
`;

export const ClientName = styled.div`
    color: #DFE3FA;
    font-size: 13px;
    min-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;

    @media (max-width: 768px) {
        font-size: 12px;
        min-width: 100px;
        width: 100%;
    }
`;

export const TotalPrice = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    color: #FFFFFF;
    font-weight: 600;
    font-size: 14px;
    padding: 6px 12px;
    background-color: rgba(124, 93, 250, 0.1);
    border-radius: 6px;

    @media (max-width: 768px) {
        font-size: 13px;
        width: 100%;
        justify-content: space-between;
        padding: 4px 8px;
    }
`;

export const Description = styled.div`
    display: none;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    margin-top: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    
    @media (min-width: 768px) {
        display: block;
        grid-area: description;
    }
    
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

export const StatusBadge = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    min-width: 100px;
    justify-content: center;
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
    border: 1px solid ${({ status }) => {
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

    @media (max-width: 768px) {
        font-size: 11px;
        padding: 4px 8px;
        min-width: 80px;
    }
`;

export const StatusDot = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
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