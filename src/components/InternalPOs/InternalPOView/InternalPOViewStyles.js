import styled, { keyframes } from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buttonDefault } from '../../shared/Button/ButtonStyles';
import { primaryFontStyles } from '../../../utilities/typographyStyles';
import Button from '../../shared/Button/Button';

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

export const StyledInternalPOView = styled.main`
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
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
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

export const InfoCard = styled(motion.div)`
    padding: 24px;
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
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
    gap: 16px;

    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
        gap: 24px;
    }
`;

export const InfoGroup = styled.div`
    text-align: ${({ $right }) => ($right ? 'right' : 'left')};
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const InfoID = styled.h1`
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
    letter-spacing: -0.3px;
    display: flex;
    align-items: center;
    gap: 8px;
    
    span {
        color: ${({ theme }) => theme.colors.textQuaternary};
    }
    
    @media (min-width: 768px) {
        font-size: 18px;
    }
`;

export const InfoDesc = styled.p`
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
    font-size: 13px;
    margin: 8px 0;
`;

export const InvoiceLink = styled(RouterLink)`
    color: white;
    font-weight: bold;
    font-size: 13px;
    text-decoration: none;
    margin: 4px 0;
    display: block;
    
    &:hover {
        text-decoration: underline;
    }
`;

export const LPONumber = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 14px;
    font-weight: 500;
    margin-top: 4px;

    &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 4px;
        background-color: ${({ theme }) => theme.colors.textTertiary};
        border-radius: 50%;
    }
`;

export const InfoAddresses = styled.div`
    display: grid;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.backgroundItem || theme.colors.background};
    padding: 24px;
    border-radius: 8px;
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
    background-color: ${({ theme }) => theme.colors.backgroundItem || theme.colors.background};
    border: 1px solid ${({ theme }) => theme.colors.secondary};
    border-radius: 8px 8px 0 0;
    overflow: hidden;
`;

export const SupplierSection = styled.div`
    padding: 24px;
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const SupplierGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

export const SupplierItem = styled.div`
    padding: 16px;
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border-color: ${({ theme }) => theme.colors.purple};
    }

    &::after {
        content: '';
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        width: 8px;
        height: 8px;
        border-top: 2px solid ${({ theme }) => theme.colors.textSecondary};
        border-right: 2px solid ${({ theme }) => theme.colors.textSecondary};
        transform: translateY(-50%) rotate(45deg);
        opacity: 0;
        transition: all 0.2s ease;
    }

    &:hover::after {
        opacity: 1;
        right: 12px;
    }
`;

export const SupplierHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
`;

export const SupplierTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
`;

export const SupplierName = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;

    .supplier-icon {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

export const SupplierDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const SupplierImageThumbnail = styled.div`
    width: 100%;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    background-color: ${({ theme }) => theme.colors.background};
    border: 1px solid ${({ theme }) => theme.colors.border};
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border-color: ${({ theme }) => theme.colors.purple};
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

export const SupplierRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
`;

export const SupplierLabel = styled.span`
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textTertiary};
`;

export const SupplierValue = styled.span`
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textPrimary};
`;

export const SupplierTotal = styled.div`
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
`;

export const ItemsSection = styled.div`
    padding: 24px;
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
    padding: 24px 0;
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

    .item-details {
        display: flex;
        flex-direction: column;
        gap: 4px;
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
    display: block;
    line-height: 1.4;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
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
    border-radius: 0 0 8px 8px;
    color: white;

    > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 0;

        &.grand-total {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
    }
`;

export const TotalText = styled.div`
    font-size: 13px;
    color: white;
    opacity: 0.7;

    .grand-total & {
        font-size: 14px;
        opacity: 0.8;
    }
`;

export const TotalAmount = styled.div`
    font-size: 13px;
    font-weight: 500;
    color: white;
    opacity: 0.9;

    .grand-total & {
        font-size: 20px;
        font-weight: 700;
        opacity: 1;
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
    padding-bottom: 76px;
    background-color: rgba(30, 33, 57, 0.95);
    backdrop-filter: blur(8px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 10;
    transition: all 0.3s ease;

    @media (min-width: 768px) {
        position: static;
        padding: 0;
        padding-bottom: 0;
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
    background-color: ${({ theme }) => theme.colors.backgroundItem || theme.colors.background};
    border: 1px solid ${({ theme }) => theme.colors.border};
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
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
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
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
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
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    padding: 2rem;
    border-radius: 16px;
    max-width: 460px;
    width: 90%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
    border: 1px solid ${({ theme }) => theme.colors.border};
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
    background-color: ${({ theme }) => theme.colors.primary};
    display: flex;
    align-items: center;
    justify-content: center;
     border: 1px solid ${({ theme }) => `${theme.colors.purple}35`};
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
    background-color: ${({ theme }) => theme.colors.backgroundItem || theme.colors.background};
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
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
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

export const PaymentDetailsSection = styled.div`
    background-color: ${({ theme }) => theme?.backgrounds?.card || '#1E2139'};
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 24px;
    border: 1px solid ${({ theme }) => theme?.borders || '#252945'};
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 100%;
    overflow: hidden;

    @media (max-width: 767px) {
        padding: 16px;
        margin-bottom: 20px;
    }
`;

export const PaymentDetailsHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;

    @media (max-width: 767px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
`;

export const PaymentDetailsTitle = styled.h2`
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    margin: 0;

    @media (max-width: 767px) {
        font-size: 14px;
    }
`;

export const PaymentDetailsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 16px;

    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

export const PaymentDetailItem = styled.div`
    background: ${({ theme }) => theme.colors.background};
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-2px);
    }
`;

export const PaymentDetailLabel = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 8px;
`;

export const PaymentDetailValue = styled.div`
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
`;

export const CreateReceiptButton = styled(Button)`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background-color: ${({ theme }) => theme?.colors?.purple || '#7C5DFA'};
    color: white;
    border: none;
    border-radius: 20px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.3s ease;
    width: fit-content;
    min-width: 120px;
    justify-content: center;

    &:hover {
        background-color: ${({ theme }) => theme?.colors?.purpleLight || '#9277FF'};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    svg {
        width: 14px;
        height: 14px;
    }

    @media (max-width: 767px) {
        width: 100%;
        padding: 8px 12px;
        font-size: 12px;
        min-width: unset;
    }
`;

export const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const ReceiptTimeline = styled.div`
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid ${({ theme }) => theme?.borders || '#252945'};
`;

export const ReceiptTimelineTitle = styled.h3`
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
        content: '';
        display: block;
        width: 4px;
        height: 16px;
        background-color: ${({ theme }) => theme?.colors?.purple || '#7C5DFA'};
        border-radius: 2px;
    }
`;

export const ReceiptItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background-color: ${({ theme }) => theme?.backgrounds?.card || '#1E2139'};
    border: 1px solid ${({ theme }) => theme?.borders || '#252945'};
    border-radius: 8px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border-color: ${({ theme }) => theme?.colors?.purple || '#7C5DFA'};
    }

    &:last-child {
        margin-bottom: 0;
    }

    &::after {
        content: '';
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        width: 8px;
        height: 8px;
        border-top: 2px solid ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
        border-right: 2px solid ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
        transform: translateY(-50%) rotate(45deg);
        opacity: 0;
        transition: all 0.2s ease;
    }

    &:hover::after {
        opacity: 1;
        right: 12px;
    }
`;

export const ReceiptInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

export const ReceiptNumber = styled.span`
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
        content: '';
        display: block;
        width: 8px;
        height: 8px;
        background-color: ${({ theme }) => theme?.colors?.purple || '#7C5DFA'};
        border-radius: 50%;
    }
`;

export const ReceiptDetails = styled.span`
    font-size: 13px;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
        content: '';
        display: block;
        width: 4px;
        height: 4px;
        background-color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
        border-radius: 50%;
    }
`;

export const ReceiptAmount = styled.span`
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme?.colors?.green || '#33D69F'};
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
        content: '';
        display: block;
        width: 8px;
        height: 8px;
        background-color: ${({ theme }) => theme?.colors?.green || '#33D69F'};
        border-radius: 50%;
    }
`;

export const PaymentModalContent = styled(ModalContent)`
    max-width: 480px;
`;

export const PaymentForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

export const FormRow = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const PaymentFormLabel = styled.label`
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
`;

export const FormInput = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid ${({ theme }) => theme?.borders || '#252945'};
    border-radius: 4px;
    background-color: ${({ theme }) => theme?.backgrounds?.input || '#1E2139'};
    color: #FFFFFF;
    font-size: 14px;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme?.colors?.purple || '#7C5DFA'};
    }

    &::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }
`;

export const FormSelect = styled.select`
    width: 100%;
    padding: 12px;
    border: 1px solid ${({ theme }) => theme?.borders || '#252945'};
    border-radius: 4px;
    background-color: ${({ theme }) => theme?.backgrounds?.input || '#1E2139'};
    color: ${({ theme }) => theme?.colors?.text || '#DFE3FA'};
    font-size: 14px;
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme?.colors?.purple || '#7C5DFA'};
    }
`;

export const FormTextArea = styled.textarea`
    width: 100%;
    min-height: 100px;
    padding: 12px;
    border: 1px solid ${({ theme }) => theme?.borders || '#252945'};
    border-radius: 4px;
    background-color: ${({ theme }) => theme?.backgrounds?.input || '#1E2139'};
    color: ${({ theme }) => theme?.colors?.text || '#DFE3FA'};
    font-size: 14px;
    line-height: 1.5;
    resize: vertical;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme?.colors?.purple || '#7C5DFA'};
    }
`;

export const SupplierEditModal = styled(ModalContent)`
    max-width: 480px;
    width: 90%;
    padding: 24px;
`;

export const SupplierEditForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

export const SupplierFormSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const SupplierFormTitle = styled.h4`
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
        content: '';
        display: block;
        width: 4px;
        height: 16px;
        background-color: ${({ theme }) => theme.colors.purple};
        border-radius: 2px;
    }
`;

export const SupplierFormRow = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

export const SupplierFormLabel = styled.label`
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textSecondary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

export const SupplierFormInput = styled.input`
    width: 100%;
    padding: 10px 12px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    background-color: ${({ theme }) => theme.colors.background};
    color: #FFFFFF;
    font-size: 14px;
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.purple};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.purple}20;
    }

    &::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }
`;

export const SupplierFormActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 8px;
`;

export const CostBreakdown = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const CostItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textSecondary};
`;

export const CostLabel = styled.span`
    display: flex;
    align-items: center;
    gap: 6px;
`;

export const CostValue = styled.span`
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textPrimary};
`;

export const ImageUploadContainer = styled.div`
    width: 100%;
    min-height: 200px;
    border: 2px dashed ${props => props.theme.borders || '#252945'};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: ${props => props.theme.backgrounds.input || '#1E2139'};
    position: relative;
    overflow: hidden;
    margin-top: 8px;

    &:hover {
        border-color: ${props => props.theme.colors.purple || '#7c5dfa'};
        background-color: ${props => props.theme.backgrounds.hoveredItem || '#252945'};
    }

    ${props => props.hasImage && `
        border-style: solid;
        padding: 0;
    `}
`;

export const ImagePreview = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.backgrounds.input || '#1E2139'};
    padding: 16px;

    img {
        max-width: 100%;
        max-height: 200px;
        object-fit: contain;
        border-radius: 4px;
    }
`;

export const RemoveImageButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: ${props => props.theme.colors.red || '#EC5757'};
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 1;

    &:hover {
        background-color: ${props => props.theme.colors.red || '#EC5757'}90;
    }
`;

export const ImageUploadPlaceholder = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 24px;
    text-align: center;

    span {
        color: ${props => props.theme.colors.textSecondary || '#DFE3FA'};
        font-size: 14px;
    }
`;

export const ImageUploadHint = styled.div`
    margin-top: 8px;
    font-size: 12px;
    color: ${props => props.theme.colors.textTertiary || '#888eb0'};
    text-align: center;
`;

export const ImagePreviewModal = styled(ModalContent)`
    max-width: 90%;
    max-height: 90vh;
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: none;
`;

export const ImagePreviewModalContent = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    border-radius: 8px;
    overflow: hidden;

    img {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
    }
`;

export const ClosePreviewButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.red};
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 1;

    &:hover {
        background-color: ${({ theme }) => theme.colors.red}90;
    }
`; 