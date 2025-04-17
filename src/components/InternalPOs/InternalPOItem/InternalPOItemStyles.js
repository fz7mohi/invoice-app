import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const StyledInternalPOItem = styled(motion.li)`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr auto auto;
    align-items: center;
    padding: 16px 24px;
    background-color: ${({ theme }) => theme.backgrounds.card};
    border: 1px solid ${({ theme }) => theme.borders};
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.3s ease;

    &:hover {
        border-color: ${({ theme }) => theme.colors.purple};
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
        gap: 16px;
        padding: 24px;
    }
`;

export const Id = styled.span`
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};

    span {
        color: ${({ theme }) => theme.colors.textTertiary};
    }

    @media (max-width: 768px) {
        grid-column: 1;
        grid-row: 1;
    }
`;

export const DueDate = styled.span`
    color: ${({ theme }) => theme.colors.textTertiary};

    @media (max-width: 768px) {
        grid-column: 2;
        grid-row: 1;
        text-align: right;
    }
`;

export const ClientName = styled.span`
    color: ${({ theme }) => theme.colors.textTertiary};

    @media (max-width: 768px) {
        grid-column: 1;
        grid-row: 2;
    }
`;

export const Total = styled.span`
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};

    @media (max-width: 768px) {
        grid-column: 2;
        grid-row: 2;
        text-align: right;
    }
`;

export const Status = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    border-radius: 6px;
    font-weight: 700;
    color: ${({ $color }) => $color};
    background-color: ${({ $background }) => $background};

    @media (max-width: 768px) {
        grid-column: 1 / -1;
        grid-row: 3;
        margin-top: 8px;
    }
`;

export const ArrowIcon = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 768px) {
        display: none;
    }
`; 