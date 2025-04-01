import styled, { keyframes } from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buttonDefault } from '../shared/Button/ButtonStyles';
import { primaryFontStyles } from '../../utilities/typographyStyles';

const pulseAnimation = keyframes`
    0% {
        transform: translateX(0);
    }
    50% {
        transform: translateX(-5px);
    }
    100% {
        transform: translateX(0px);
    }
`;

export const StyledInvoiceView = styled.main`
    padding: 28px 24px 0;
    width: 100%;
    min-height: 100%;
    margin-bottom: 120px;
    background-color: ${({ theme }) => theme.colors.background};
    transition: background-color 0.3s ease;

    @media (min-width: 768px) {
        padding: 40px 0 0;
        margin-bottom: 0;
    }
`;

export const Container = styled.div`
    width: 100%;
    max-width: 780px;
    margin: 0 auto;
`;

export const Link = styled(RouterLink)`
    ${buttonDefault}
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 0;
    margin-bottom: 32px;
    line-height: 1;
    max-width: max-content;

    & svg {
        transition: transform 350ms ease-in-out;
    }

    @media (min-width: 768px) {
        &:hover {
            color: ${({ theme }) => theme.colors.blueGrayish};
            & svg {
                animation: ${pulseAnimation} 2s ease infinite;
            }
        }
    }
`;

export const MotionLink = styled(motion(RouterLink))`
    display: flex;
    align-items: center;
    gap: 16px;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 500;
    text-decoration: none;
    margin-bottom: 32px;
    width: fit-content;
    
    &:hover {
        color: ${({ theme }) => theme.colors.purple};
    }
`;

export const Controller = styled(motion.div)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    width: 100%;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    margin-bottom: 24px;
    transition: all 0.3s ease;

    @media (min-width: 768px) {
        padding: 20px 24px;
        margin-bottom: 24px;
    }
`;

export const Text = styled.span`
    color: ${({ theme }) => theme.colors.textTertiary};
    margin-right: auto;
    font-size: 14px;
`;

export const InfoCard = styled(motion.div)`
    padding: 24px;
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    
    @media (min-width: 768px) {
        padding: 32px;
    }
`;

export const InfoHeader = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    margin-bottom: 32px;
`;

export const InfoGroup = styled.div`
    text-align: ${({ $right }) => ($right ? 'right' : 'left')};
`;

export const InfoID = styled.h1`
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
    letter-spacing: -0.3px;
    
    span {
        color: ${({ theme }) => theme.colors.textQuaternary};
    }
    
    @media (min-width: 768px) {
        font-size: 18px;
    }
`;

export const InfoDesc = styled.p`
    color: ${({ theme }) => theme.colors.textTertiary};
    margin: 8px 0 0;
    font-size: 14px;
`;

export const InfoAddresses = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
    margin-bottom: 32px;

    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 40px;
    }
`;

export const AddressGroup = styled.div`
    text-align: ${({ align }) => align || 'left'};
`;

export const AddressTitle = styled.h2`
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textTertiary};
    margin: 0 0 8px;
`;

export const AddressText = styled.p`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
    line-height: 1.5;
`;

export const Details = styled.div`
    margin-top: 32px;
    background-color: ${({ theme }) => theme.colors.backgroundAlt || theme.colors.background};
    border-radius: 8px 8px 0 0;
    overflow: hidden;
`;

export const ItemsHeader = styled.div`
    display: none;
    
    @media (min-width: 768px) {
        display: grid;
        grid-template-columns: 2.5fr 0.7fr 1fr ${props => props.showVat ? '1fr' : ''} 1.2fr;
        grid-column-gap: 24px;
        padding: 16px 24px;
        background-color: #004359;
        color: white;
        border-radius: 8px 8px 0 0;
    }
`;

export const HeaderCell = styled.div`
    font-size: 13px;
    font-weight: 500;
`;

export const Items = styled.div`
    padding: 24px;
`;

export const Item = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 24px 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};

    &:last-child {
        border-bottom: none;
    }

    @media (min-width: 768px) {
        grid-template-columns: 2.5fr 0.7fr 1fr ${props => props.showVat ? '1fr' : ''} 1.2fr;
        gap: 24px;
        align-items: center;
        padding: 16px 0;
    }
`;

export const ItemName = styled.h3`
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
`;

export const ItemDescription = styled.p`
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textTertiary};
    margin: 4px 0 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

export const ItemQty = styled.div`
    display: none;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 500;
    
    @media (min-width: 768px) {
        display: block;
    }
`;

export const ItemPrice = styled.div`
    display: none;
    color: ${({ theme }) => theme.colors.textPrimary};
    
    @media (min-width: 768px) {
        display: block;
    }
`;

export const ItemVat = styled.div`
    display: none;
    color: ${({ theme }) => theme.colors.textPrimary};

    @media (min-width: 768px) {
        display: block;
    }
`;

export const ItemTotal = styled.div`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 500;
    text-align: right;
`;

export const Total = styled.div`
    background-color: #004359;
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    border-radius: 0 0 8px 8px;
`;

export const TotalText = styled.p`
    font-size: 14px;
    margin: 0;
    color: white;
`;

export const TotalAmount = styled.p`
    font-size: 20px;
    font-weight: 700;
    margin: 0;
    color: white;
`;

export const MetaInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
    margin-bottom: 16px;
    
    @media (min-width: 768px) {
        flex-direction: row;
        gap: 20px;
        margin-bottom: 24px;
    }
`;

export const MetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.colors.textTertiary};
    font-size: 13px;
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 32px;

    @media (min-width: 768px) {
        margin-top: 0;
    }
`;

export const ButtonWrapper = styled.div`
    display: flex;
    gap: 8px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px 24px;
    background-color: ${({ theme }) => theme.colors.background};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    z-index: 10;

    @media (min-width: 768px) {
        position: static;
        padding: 0;
        border: none;
    }
`;

export const StatusBadge = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 700;
    background-color: ${({ theme, currStatus }) => {
        switch (currStatus) {
            case 'paid':
                return 'rgba(51, 214, 159, 0.06)';
            case 'pending':
                return 'rgba(255, 143, 0, 0.06)';
            default:
                return 'rgba(55, 59, 83, 0.06)';
        }
    }};
    color: ${({ theme, currStatus }) => {
        switch (currStatus) {
            case 'paid':
                return '#33D69F';
            case 'pending':
                return '#FF8F00';
            default:
                return '#373B53';
        }
    }};
    transition: all 0.3s ease-in-out;
`;

export const StatusDot = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ theme, currStatus }) => {
        switch (currStatus) {
            case 'paid':
                return '#33D69F';
            case 'pending':
                return '#FF8F00';
            default:
                return '#373B53';
        }
    }};
`;

export const TermsSection = styled.div`
    margin-top: 32px;
    padding: 24px;
    background-color: ${({ theme }) => theme.colors.backgroundAlt || theme.colors.background};
    border-radius: 8px;
`;

export const TermsTitle = styled.h3`
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0 0 16px;
`;

export const TermsText = styled.p`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textTertiary};
    margin: 0;
    line-height: 1.5;
    white-space: pre-wrap;
`;
