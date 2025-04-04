import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const StyledReceiptView = styled(motion.div)`
    min-height: 100vh;
    background-color: ${({ theme }) => theme?.backgrounds?.main || '#141625'};
    padding: 32px 24px;
    transition: all 0.3s ease;

    @media (min-width: 768px) {
        padding: 48px 32px;
    }
    
    @media (min-width: 1024px) {
        padding: 32px 48px;
        margin-left: 103px;
        width: calc(100% - 103px);
    }
`;

export const Container = styled.div`
    width: 100%;
    max-width: 780px;
    margin: 0 auto;
`;

export const Text = styled.span`
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
    font-size: 13px;
    font-weight: 500;
`;

export const StyledLink = styled(motion.div)`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    text-decoration: none;
    font-weight: 500;
    font-size: 15px;
    margin-bottom: 32px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        color: ${({ theme }) => theme?.colors?.purple || '#7C5DFA'};
    }
`;

export const HeaderSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
`;

export const HeaderTitle = styled.h1`
    font-size: 32px;
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    margin: 0;
`;

export const Controller = styled(motion.div)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    width: 100%;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.backgroundAlt || '#1E2139'};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    margin-bottom: 24px;
    transition: all 0.3s ease;

    @media (min-width: 768px) {
        padding: 20px 24px;
        margin-bottom: 24px;
    }
`;

export const InfoCard = styled(motion.div)`
    background-color: ${({ theme }) => theme?.backgrounds?.card || '#1E2139'};
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    border: 1px solid ${({ theme }) => theme?.borders || '#252945'};
    transition: all 0.3s ease;
    margin-bottom: 24px;

    @media (min-width: 768px) {
        padding: 32px;
    }
`;

export const InfoHeader = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 32px;
`;

export const InfoGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const InfoID = styled.div`
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    display: flex;
    align-items: center;
    gap: 8px;

    span {
        color: ${({ theme }) => theme?.colors?.purple || '#7C5DFA'};
    }
`;

export const InfoDesc = styled.div`
    font-size: 15px;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
`;

export const InfoAddresses = styled.div`
    display: grid;
    border: 1px solid ${({ theme }) => theme.colors.border || '#252945'};
    background-color: ${({ theme }) => theme.colors.backgroundItem || theme.colors.background || '#1E2139'};
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
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: ${({ align }) => align || 'left'};
`;

export const AddressTitle = styled.div`
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
    text-transform: uppercase;
    letter-spacing: 1px;
`;

export const AddressText = styled.div`
    font-size: 15px;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    line-height: 1.5;
`;

export const Details = styled.div`
    margin-top: 32px;
    background-color: ${({ theme }) => theme.colors.backgroundItem || theme.colors.background || '#1E2139'};
    border: 1px solid ${({ theme }) => theme.colors.secondary || '#252945'};
    border-radius: 8px 8px 0 0;
    overflow: hidden;
`;

export const ItemsHeader = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr ${({ showVat }) => showVat ? '1fr' : ''} 1fr;
    gap: 16px;
    padding: 24px;
    background-color: ${({ theme }) => theme?.backgrounds?.card || '#1E2139'};
    border-bottom: 1px solid ${({ theme }) => theme?.borders || '#252945'};
`;

export const HeaderCell = styled.div`
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
    text-transform: uppercase;
    letter-spacing: 1px;
    text-align: ${({ align }) => align || 'left'};
`;

export const Items = styled.div`
    padding: 24px;
`;

export const Item = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 24px 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border || '#252945'};

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

export const ItemName = styled.div`
    font-size: 15px;
    font-weight: 500;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
`;

export const ItemDescription = styled.div`
    font-size: 13px;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
`;

export const ItemQty = styled.div`
    font-size: 15px;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    text-align: center;
`;

export const ItemPrice = styled.div`
    font-size: 15px;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    text-align: right;
`;

export const ItemVat = styled.div`
    font-size: 15px;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    text-align: right;
`;

export const ItemTotal = styled.div`
    font-size: 15px;
    font-weight: 500;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
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
    font-size: 15px;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
`;

export const TotalAmount = styled.div`
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
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
    font-size: 13px;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
`;

export const StatusBadge = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    background-color: ${({ status, theme }) => {
        switch (status) {
            case 'paid':
                return 'rgba(51, 214, 159, 0.1)';
            case 'pending':
                return 'rgba(255, 143, 0, 0.1)';
            case 'partially_paid':
                return 'rgba(255, 143, 0, 0.1)';
            case 'void':
                return 'rgba(255, 72, 6, 0.1)';
            default:
                return 'rgba(223, 227, 250, 0.1)';
        }
    }};
    color: ${({ status, theme }) => {
        switch (status) {
            case 'paid':
                return '#33D69F';
            case 'pending':
                return '#FF8F00';
            case 'partially_paid':
                return '#FF8F00';
            case 'void':
                return '#FF4806';
            default:
                return '#DFE3FA';
        }
    }};
`;

export const DownloadButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    background-color: ${({ theme }) => theme?.colors?.purple || '#7C5DFA'};
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: ${({ theme }) => theme?.colors?.purpleHover || '#9277FF'};
    }
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
    width: 100%;

    @media (max-width: 1024px) {
        gap: 12px;
    }

    @media (max-width: 767px) {
        grid-template-columns: 1fr;
        gap: 8px;
    }
`;

export const PaymentDetailItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px;
    background-color: ${({ theme }) => theme?.backgrounds?.input || '#1E2139'};
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme?.borders || '#252945'};
    transition: all 0.2s ease;
    min-width: 0;

    &:hover {
        background-color: ${({ theme }) => theme?.backgrounds?.hover || '#252945'};
    }

    @media (max-width: 767px) {
        padding: 10px;
    }
`;

export const PaymentDetailLabel = styled.div`
    font-size: 13px;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
`;

export const PaymentDetailValue = styled.div`
    font-size: 15px;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    font-weight: 500;
`;

export const BankDetailsSection = styled.div`
    background-color: ${({ theme }) => theme?.backgrounds?.card || '#1E2139'};
    border-radius: 12px;
    padding: 24px;
    border: 1px solid ${({ theme }) => theme?.borders || '#252945'};
`;

export const BankDetailsTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    margin: 0 0 24px;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 16px;
        background-color: ${({ theme }) => theme?.colors?.purple || '#7C5DFA'};
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
`;

export const BankDetailLabel = styled.div`
    font-size: 13px;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
`;

export const BankDetailValue = styled.div`
    font-size: 15px;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    font-weight: 500;
`;

export const TermsSection = styled.div`
    margin-top: 32px;
    padding: 24px;
    background-color: ${({ theme }) => theme.colors.backgroundItem || theme.colors.background || '#1E2139'};
    border: 1px solid ${({ theme }) => theme.colors.border || '#252945'};
    border-radius: 8px;
`;

export const TermsHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

export const TermsText = styled.div`
    font-size: 14px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.textSecondary || '#DFE3FA'};
    white-space: pre-line;
    padding: 8px;
    background-color: ${({ theme }) => theme.colors.backgroundAlt || '#1E2139'};
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.colors.border || '#252945'};
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 32px;

    @media (min-width: 768px) {
        margin-top: 0;
    }
`;

export const StatusDot = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
`;

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;
`;

export const ModalContent = styled.div`
    background: ${({ theme }) => theme.colors.cardBg};
    border-radius: 8px;
    padding: 32px;
    max-width: 480px;
    width: 90%;
    animation: slideIn 0.3s ease-out;
`;

export const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
`;

export const ModalIconWrapper = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.purple};
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ModalTitle = styled.h2`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 24px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.5px;
    margin: 0;
`;

export const ModalText = styled.p`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    line-height: 1.25;
    margin: 0 0 24px;
`;

export const FormGroup = styled.div`
    margin-bottom: 24px;
`;

export const FormLabel = styled.label`
    display: block;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.25px;
    margin-bottom: 8px;
`;

export const TextArea = styled.textarea`
    width: 100%;
    min-height: 120px;
    padding: 12px;
    background: ${({ theme }) => theme.colors.inputBg};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 12px;
    line-height: 1.25;
    resize: vertical;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.purple};
    }
`;

export const ModalActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
`;

export const StatusContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`; 