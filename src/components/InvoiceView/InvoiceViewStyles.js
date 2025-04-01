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

const modalSlideIn = keyframes`
    from {
        opacity: 0;
        transform: scale(0.95) translateY(10px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
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
    flex-wrap: wrap;
    gap: 8px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px;
    background-color: rgba(30, 33, 57, 0.95);
    backdrop-filter: blur(8px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 10;
    transition: all 0.3s ease;

    @media (min-width: 768px) {
        position: static;
        padding: 0;
        border: none;
        backdrop-filter: none;
        background: none;
        flex-wrap: nowrap;
        gap: 8px;
    }

    button {
        flex: 1;
        min-width: calc(50% - 4px);
        max-width: none;
        height: 38px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 0.2px;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 0 12px;
        white-space: nowrap;
        
        svg {
            flex-shrink: 0;
            width: 14px;
            height: 14px;
        }
        
        &:active {
            transform: scale(0.98);
        }

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        @media (min-width: 375px) {
            font-size: 12px;
            gap: 6px;
            padding: 0 14px;
        }

        @media (min-width: 768px) {
            flex: 0 1 auto;
            min-width: auto;
            padding: 0 16px;
            height: 34px;
        }

        @media (min-width: 1024px) {
            min-width: 120px;
        }
    }

    /* Adjust button order on mobile */
    @media (max-width: 767px) {
        button {
            order: 2;
            
            /* Make Mark Paid and Void buttons full width */
            &[data-action="mark-paid"],
            &[data-action="void"] {
                flex: 1 0 100%;
                order: 1;
            }
        }
    }
`;

export const StatusBadge = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.2px;
    transition: all 0.2s ease;
    min-width: 90px;
    text-transform: capitalize;
    background-color: ${({ currStatus, theme }) => {
        switch (currStatus) {
            case 'paid':
                return 'rgba(51, 214, 159, 0.1)';
            case 'partially_paid':
                return 'rgba(73, 97, 255, 0.1)';
            case 'pending':
                return 'rgba(255, 143, 0, 0.1)';
            case 'void':
                return 'rgba(236, 87, 87, 0.1)';
            default:
                return 'rgba(223, 227, 250, 0.1)';
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
                return 'rgba(51, 214, 159, 0.2)';
            case 'partially_paid':
                return 'rgba(73, 97, 255, 0.2)';
            case 'pending':
                return 'rgba(255, 143, 0, 0.2)';
            case 'void':
                return 'rgba(236, 87, 87, 0.2)';
            default:
                return 'rgba(223, 227, 250, 0.2)';
        }
    }};
`;

export const StatusDot = styled.div`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 6px;
    flex-shrink: 0;
    transition: all 0.2s ease;
    background-color: #DFE3FA;
    opacity: 0.8;
`;

export const StatusContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;

    ${Text} {
        font-size: 12px;
        font-weight: 500;
        color: ${({ theme }) => theme.colors.textTertiary};
        margin: 0;
        opacity: 0.8;
    }
`;

export const TermsSection = styled.div`
    margin-top: 32px;
    padding: 24px;
    background-color: ${({ theme }) => theme.colors.backgroundAlt || theme.colors.background};
    border-radius: 8px;
`;

export const TermsHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

export const TermsTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 16px;
        background-color: ${({ theme }) => theme.colors.purple};
        border-radius: 2px;
    }
`;

export const TermsText = styled.div`
    font-size: 14px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.textSecondary};
    white-space: pre-line;
    padding: 8px;
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const TermsTextArea = styled.textarea`
    width: 100%;
    min-height: 120px;
    padding: 12px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    font-size: 14px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.background};
    resize: vertical;
    margin-bottom: 12px;
    font-family: inherit;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.purple};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.purple}20;
    }
`;

export const TermsActions = styled.div`
    display: flex;
    gap: 8px;
    justify-content: flex-end;
`;

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
`;

export const ModalContent = styled.div`
    background-color: #1E2139;
    padding: 2rem;
    border-radius: 16px;
    max-width: 460px;
    width: 90%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
    border: 1px solid #252945;
    animation: ${modalSlideIn} 0.3s ease-out;
`;

export const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
    gap: 12px;
`;

export const ModalIconWrapper = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background-color: #2B2C37;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #FF4806;
`;

export const ModalTitle = styled.h2`
    margin: 0;
    font-size: 1.25rem;
    color: #fff;
    font-weight: 600;
`;

export const ModalText = styled.p`
    margin-bottom: 1.5rem;
    color: #DFE3FA;
    font-size: 0.95rem;
    line-height: 1.5;
    opacity: 0.9;
`;

export const FormGroup = styled.div`
    margin-bottom: 1.5rem;
`;

export const FormLabel = styled.label`
    display: block;
    margin-bottom: 0.75rem;
    color: #DFE3FA;
    font-size: 0.9rem;
    font-weight: 500;
`;

export const TextArea = styled.textarea`
    width: 100%;
    padding: 0.875rem;
    border-radius: 8px;
    border: 1px solid #252945;
    background-color: #1E2139;
    color: #fff;
    font-size: 0.9rem;
    min-height: 100px;
    resize: vertical;
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: #7C5DFA;
        box-shadow: 0 0 0 2px rgba(124, 93, 250, 0.1);
    }

    &::placeholder {
        color: #888EB0;
    }
`;

export const ModalActions = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
`;

export const HeaderSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
`;

export const HeaderTitle = styled.h1`
    font-size: 24px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
`;

export const DownloadButton = styled.button`
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

export const BankDetailsSection = styled.div`
    margin-top: 32px;
    padding: 24px;
    background-color: ${({ theme }) => theme.colors.backgroundAlt || theme.colors.background};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    height: 100%;
`;

export const BankDetailsTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0 0 16px;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 16px;
        background-color: ${({ theme }) => theme.colors.purple};
        border-radius: 2px;
    }
`;

export const BankDetailsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
`;

export const BankDetailItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const BankDetailLabel = styled.span`
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textTertiary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

export const BankDetailValue = styled.span`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 500;
`;

export const InfoSectionsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    margin-top: 32px;

    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
    }
`;
