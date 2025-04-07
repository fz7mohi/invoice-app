import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const ActionButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 24px;
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    font-weight: 700;
    border: 1px solid ${({ theme }) => theme.colors.border};
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;

    svg {
        flex-shrink: 0;
    }

    &:hover {
        background-color: ${({ theme }) => theme.colors.backgroundItemHover};
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    @media (min-width: 768px) {
        padding: 8px 24px;
        font-size: 15px;
    }
`;

export const DownloadButton = styled(ActionButton)`
    // Inherit all styles from ActionButton
`;

export const StyledQuotationView = styled.main`
    padding: 28px 24px 0;
    width: 100%;
    min-height: 100%;
    margin-bottom: 180px;
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    transition: background-color 0.3s ease;

    @media (min-width: 768px) {
        padding: 40px 0 0;
        margin-bottom: 0;
    }
`;

export const Container = styled.div`
    width: 100%;
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    max-width: 780px;
    margin: 0 auto;
`;

export const MotionLink = styled(motion(Link))`
    display: inline-flex;
    align-items: center;
    margin-bottom: 28px;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;

    svg {
        margin-right: 12px;
        transition: transform 0.2s ease;
    }

    &:hover {
        color: ${({ theme }) => theme.colors.purple};
        
        svg {
            transform: translateX(-4px);
        }
    }

    &:active {
        transform: scale(0.98);
    }
`;

export const Controller = styled(motion.div)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    width: 100%;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
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

export const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    background: ${({ theme }) => theme.colors.background};
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-top: 1px solid ${({ theme }) => theme.colors.border};

    @media (min-width: 768px) {
        flex-direction: row;
        justify-content: flex-end;
        padding: 16px 24px;
        gap: 12px;
        border-radius: 8px;
        margin: 0 24px 24px;
        width: auto;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    button {
        width: 100%;
        height: 56px;
        padding: 0 16px;
        border-radius: 0;
        font-size: 15px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;

        &:not(:last-child) {
            border-bottom: 1px solid ${({ theme }) => theme.colors.border};
        }

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        svg {
            width: 18px;
            height: 18px;
            transition: transform 0.2s ease;
        }

        &:active:not(:disabled) {
            transform: scale(0.98);
        }
    }

    button[data-action="duplicate"] {
        background-color: ${({ theme }) => theme.colors.purple};
        color: white;
        border: none;

        &:hover:not(:disabled) {
            background-color: ${({ theme }) => theme.colors.purpleHover};
        }
    }

    button[data-action="edit"] {
        background-color: ${({ theme }) => theme.colors.background};
        color: ${({ theme }) => theme.colors.text};
        border: none;

        &:hover:not(:disabled) {
            background-color: ${({ theme }) => theme.colors.backgroundAlt};
        }
    }

    button[data-action="delete"] {
        background-color: ${({ theme }) => theme.colors.background};
        color: ${({ theme }) => theme.colors.red};
        border: none;

        &:hover:not(:disabled) {
            background-color: ${({ theme }) => theme.colors.red};
            color: white;
        }
    }

    button[data-action="invoice"] {
        background-color: ${({ theme }) => theme.colors.purple};
        color: white;
        border: none;

        &:hover:not(:disabled) {
            background-color: ${({ theme }) => theme.colors.purpleHover};
        }
    }

    @media (min-width: 768px) {
        button {
            width: auto;
            min-width: 120px;
            height: 44px;
            border-radius: 8px;
            border: 1px solid transparent;
            
            &:not(:last-child) {
                border-bottom: none;
            }
        }

        button[data-action="edit"] {
            background-color: transparent;
            border: 1px solid ${({ theme }) => theme.colors.border};

            &:hover:not(:disabled) {
                background-color: transparent;
                border-color: ${({ theme }) => theme.colors.purple};
                color: ${({ theme }) => theme.colors.purple};
            }
        }

        button[data-action="delete"] {
            background-color: transparent;
            border: 1px solid ${({ theme }) => theme.colors.red};

            &:hover:not(:disabled) {
                background-color: ${({ theme }) => theme.colors.red};
                color: white;
            }
        }
    }
`;

export const InfoCard = styled(motion.div)`
    width: 100%;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    padding: 28px 20px;
    transition: all 0.3s ease;
    
    @media (min-width: 768px) {
        padding: 32px;
    }
`;

export const InfoHeader = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    margin-bottom: 32px;
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
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textTertiary};
    margin: 6px 0 0;
    line-height: 1.5;
`;

export const InfoGroup = styled.div`
    text-align: ${({ $right }) => ($right ? 'right' : 'left')};
`;

export const InfoAddresses = styled.div`
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
    margin-bottom: 32px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.backgroundItem || theme.colors.background};
    padding: 20px;
    border-radius: 8px;
    
    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        padding: 24px;
    }
`;

export const AddressGroup = styled.div`
    margin-bottom: 16px;
    text-align: ${props => props.align === 'right' ? 'right' : 'left'};

    &:last-child {
        margin-bottom: 0;
    }

    @media (min-width: 768px) {
        margin-bottom: 0;
    }
`;

export const AddressTitle = styled.h2`
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textTertiary};
    margin: 0 0 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

export const AddressText = styled.p`
    font-size: 14px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
`;

export const Details = styled.div`
    margin-top: 32px;
    background-color: ${({ theme }) => theme.colors.backgroundItem || theme.colors.background};
    border: 1px solid ${({ theme }) => theme.colors.secondary};
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

export const HeaderCell = styled.p`
    font-size: 12px;
    font-weight: 600;
    color: white;
    margin: 0;
    
    &:nth-child(3), &:nth-child(4), &:nth-child(5) {
        text-align: left;
    }
    
    &:last-child {
        text-align: left;
    }
`;

export const Items = styled.div`
    padding: 20px;
    
    @media (min-width: 768px) {
        padding: 16px 24px 24px;
    }
`;

export const Item = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.divider || theme.colors.backgroundAlt || '#f0f0f0'};
    
    .item-mobile-details {
        display: flex;
        margin-top: 6px;
        font-size: 12px;
        color: ${({ theme }) => theme.colors.textTertiary};
        
        @media (min-width: 768px) {
            display: none;
        }
    }
    
    @media (min-width: 768px) {
        grid-template-columns: 2.5fr 0.7fr 1fr ${props => props.showVat ? '1fr' : ''} 1.2fr;
        grid-column-gap: 24px;
        margin-bottom: 12px;
    }
    
    &:last-child {
        margin-bottom: 0;
        border-bottom: none;
        padding-bottom: 0;
    }
`;

export const ItemName = styled.p`
    font-weight: 600;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0 0 6px;

    @media (min-width: 768px) {
        margin: 0;
    }
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

export const ItemQty = styled.p`
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textTertiary};
    margin: 0;
    display: none;
    
    @media (min-width: 768px) {
        display: block;
    }
`;

export const ItemPrice = styled.p`
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textTertiary};
    margin: 0;
    text-align: left;
    display: none;
    
    @media (min-width: 768px) {
        display: block;
    }
`;

export const ItemTotal = styled.p`
    font-weight: 600;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
    text-align: left;
`;

export const ItemVat = styled.p`
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textTertiary};
    margin: 0;
    text-align: left;
    display: none;
    
    @media (min-width: 768px) {
        display: block;
    }
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
    font-size: 12px;
    font-weight: 500;
    margin: 0;
    color: white;
`;

export const TotalAmount = styled.p`
    font-size: 20px;
    font-weight: 700;
    margin: 0;
    color: white;
`;

export const TermsSection = styled.div`
    margin-top: 28px;
    padding: 20px;
    background-color: ${({ theme }) => theme.colors.backgroundItem || theme.colors.background};
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);

    @media (min-width: 768px) {
        padding: 24px;
        margin-top: 32px;
    }
`;

export const TermsTitle = styled.h2`
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textTertiary};
    margin: 0 0 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

export const TermsText = styled.p`
    font-size: 14px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
    white-space: pre-wrap;
`;

export const StatusDot = styled.span`
    width: 6px;
    height: 6px;
    background: currentColor;
    border-radius: 50%;
    box-shadow: 0 0 8px currentColor;
`;

export const StatusBadge = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.3px;
    box-shadow: 0 0 0 1px ${props => {
        switch (props.status) {
            case 'approved':
                return 'rgba(0, 200, 83, 0.2)';
            case 'pending':
                return 'rgba(255, 171, 0, 0.2)';
            default:
                return 'rgba(130, 143, 163, 0.2)';
        }
    }};
    background: ${props => {
        switch (props.status) {
            case 'approved':
                return 'rgba(0, 200, 83, 0.1)';
            case 'pending':
                return 'rgba(255, 171, 0, 0.1)';
            default:
                return 'rgba(130, 143, 163, 0.1)';
        }
    }};
    color: ${props => {
        switch (props.status) {
            case 'approved':
                return '#00C853';
            case 'pending':
                return '#FFAB00';
            default:
                return '#828FA3';
        }
    }};
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${props => {
            switch (props.status) {
                case 'approved':
                    return 'radial-gradient(circle at center, rgba(0, 200, 83, 0.2) 0%, transparent 70%)';
                case 'pending':
                    return 'radial-gradient(circle at center, rgba(255, 171, 0, 0.2) 0%, transparent 70%)';
                default:
                    return 'radial-gradient(circle at center, rgba(130, 143, 163, 0.2) 0%, transparent 70%)';
            }
        }};
        filter: blur(4px);
        z-index: -1;
    }
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
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textTertiary};
    
    svg {
        margin-right: 6px;
        color: ${({ theme }) => theme.colors.purple};
    }
`;

export const PrintButton = styled.button`
    background-color: ${({ theme }) => theme.colors.purple};
    border: none;
    color: white;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-left: auto;
    transition: all 0.2s ease;
    
    svg {
        margin-right: 6px;
    }
    
    &:hover {
        background-color: ${({ theme }) => theme.colors.purpleLight || '#9277FF'};
    }
    
    @media (max-width: 767px) {
        display: none;
    }
`;

export const ActionButtons = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 4px;
    margin: 0 -24px;
    padding-left: 24px;
    padding-right: 24px;
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar {
        display: none;
    }
    
    -ms-overflow-style: none;
    scrollbar-width: none;
    
    @media (min-width: 768px) {
        gap: 12px;
        margin: 0;
        padding: 0;
        overflow: visible;
    }
`;

export const HeaderSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};

    @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 32px;
        padding-bottom: 20px;
        gap: 24px;
    }
`;

export const HeaderTitle = styled.h1`
    font-size: 20px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
    letter-spacing: -0.3px;
    display: flex;
    align-items: center;
    gap: 12px;

    @media (min-width: 768px) {
        font-size: 24px;
    }
`;

// Add the Fortune Gifts colors to the theme
export const fortuneGiftsTheme = {
    primary: '#004359',
    secondary: '#000000',
    accent: '#FF4806',
    primaryLight: '#005E7C',
    accentLight: '#FF6D3C'
};