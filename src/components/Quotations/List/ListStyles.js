import styled from 'styled-components';
import { motion } from 'framer-motion';

export const StyledList = styled(motion.div)`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
`;

export const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;

    img {
        width: 240px;
        height: 200px;
        margin-bottom: 32px;
    }
`;

export const EmptyHeading = styled.h2`
    font-size: 20px;
    font-weight: 700;
    color: #FFFFFF;
    margin-bottom: 8px;
`;

export const EmptyText = styled.p`
    font-size: 12px;
    color: #888EB0;
    max-width: 240px;
    line-height: 1.5;
`;

export const Item = styled(motion.div)`
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    background-color: #252945;
    border: 1px solid #252945;
    border-radius: 8px;
    padding: 16px;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
        border-color: #7C5DFA;
    }

    @media (min-width: 768px) {
        padding: 20px 24px;
        grid-template-columns: 1fr 1fr auto;
        gap: 24px;
    }
`;

export const Link = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-decoration: none;
    color: inherit;
`;

export const Uid = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #FFFFFF;
`;

export const Hashtag = styled.span`
    color: #888EB0;
`;

export const PaymentDue = styled.div`
    font-size: 12px;
    color: #888EB0;
`;

export const ClientName = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: #FFFFFF;
    margin-top: 4px;
`;

export const TotalPrice = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: right;

    h3 {
        font-size: 16px;
        font-weight: 600;
        color: #FFFFFF;
        margin: 0;
    }

    @media (max-width: 767px) {
        text-align: left;
        margin-top: 8px;
    }
`;

export const Description = styled.div`
    font-size: 12px;
    color: #888EB0;
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