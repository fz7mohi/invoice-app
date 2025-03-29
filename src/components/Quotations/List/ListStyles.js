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
`;

export const Link = styled(RouterLink)`
    display: grid;
    grid-template-areas:
        'id client'
        'date price'
        'status status';
    grid-template-columns: 1fr 1fr;
    text-decoration: none;
    padding: 24px;
    gap: 30px 10px;

    @media (min-width: 768px) {
        grid-template-areas: 'id date client price status icon';
        grid-template-columns: 80px 140px 1fr 100px 104px 20px;
        align-items: center;
        padding: 16px 32px;
        gap: 0;
    }

    @media (min-width: 1024px) {
        grid-template-columns: 100px 140px 1fr 120px 140px 20px;
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