import styled from 'styled-components';
import { motion } from 'framer-motion';

export const StyledList = styled(motion.div)`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
`;

export const Item = styled(motion.div)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background-color: #252945;
    border: 1px solid #252945;
    border-radius: 8px;
    padding: 16px 24px;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
        border-color: #7C5DFA;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        padding: 20px;
    }
`;

export const Link = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    min-width: 0;

    @media (max-width: 768px) {
        width: 100%;
        justify-content: space-between;
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

    @media (max-width: 768px) {
        font-size: 13px;
    }
`;

export const Hashtag = styled.span`
    color: #888EB0;
`;

export const PaymentDue = styled.div`
    color: #DFE3FA;
    font-size: 13px;
    min-width: 100px;

    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

export const ClientName = styled.div`
    color: #DFE3FA;
    font-size: 13px;
    min-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media (max-width: 768px) {
        font-size: 12px;
        min-width: 100px;
    }
`;

export const TotalPrice = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    color: #FFFFFF;
    font-weight: 600;
    font-size: 14px;

    @media (max-width: 768px) {
        font-size: 13px;
        width: 100%;
        justify-content: space-between;
    }
`;

export const Description = styled.div`
    color: #DFE3FA;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;

    @media (max-width: 768px) {
        font-size: 12px;
        max-width: 100%;
        white-space: normal;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
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
`; 