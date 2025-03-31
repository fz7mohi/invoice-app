import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

export const StyledList = styled(motion.ul)`
    display: flex;
    flex-flow: column;
    gap: 16px;
    width: 100%;
    margin-bottom: 104px;

    @media (min-width: 768px) {
        gap: 16px;
        margin-bottom: 56px;
    }
`;

export const Item = styled(motion.li)`
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    border-radius: 8px;
    box-shadow: ${({ theme }) => theme.colors.boxShadow};
    transition: outline 0.2s;

    &:hover {
        outline: 1px solid ${({ theme }) => theme.colors.purple};
    }
    
    @media (min-width: 1024px) {
        min-height: 80px;
    }
`;

export const Link = styled(RouterLink)`
    display: grid;
    grid-template-areas:
        'date id'
        'client description'
        'price status';
    grid-template-columns: 1fr 1fr;
    text-decoration: none;
    padding: 24px;
    gap: 15px 10px;

    @media (min-width: 768px) {
        grid-template-areas: 'date id client description price status icon';
        grid-template-columns: 110px 110px 150px 1fr 120px 120px 20px;
        align-items: center;
        padding: 16px 24px;
        gap: 0;
    }

    @media (min-width: 1024px) {
        grid-template-columns: 120px 120px 180px 1fr 150px 140px 20px;
        padding: 16px 32px;
    }
    
    @media (min-width: 1440px) {
        grid-template-columns: 140px 140px 220px 1fr 180px 160px 20px;
    }
`;

export const Uid = styled.div`
    grid-area: id;
    font-weight: 700;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Hashtag = styled.span`
    color: ${({ theme }) => theme.colors.textQuaternary};
`;

export const PaymentDue = styled.div`
    grid-area: date;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textSecondary};

    @media (min-width: 768px) {
        justify-self: start;
    }
`;

export const ClientName = styled.div`
    grid-area: client;
    font-size: 12px;
    text-align: right;
    color: ${({ theme }) => theme.colors.textSecondary};

    @media (min-width: 768px) {
        text-align: left;
    }
`;

export const TotalPrice = styled.div`
    grid-area: price;
    font-size: 16px;
    font-weight: 700;
    text-align: right;
    color: ${({ theme }) => theme.colors.textPrimary};

    @media (min-width: 768px) {
        text-align: right;
    }
`;

export const Description = styled.div`
    grid-area: description;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textSecondary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
    padding-right: 10px;

    @media (min-width: 768px) {
        text-align: left;
        font-size: 13px;
        white-space: normal;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }
    
    @media (min-width: 1024px) {
        -webkit-line-clamp: 2;
        line-height: 1.4;
    }
`; 