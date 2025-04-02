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
`;

export const Container = styled.div`
    max-width: 1000px;
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

export const Controller = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    gap: 16px;
    flex-wrap: wrap;

    @media (min-width: 768px) {
        flex-wrap: nowrap;
    }
`;

export const InfoCard = styled(motion.div)`
    background-color: ${({ theme }) => theme?.backgrounds?.card || '#1E2139'};
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    border: 1px solid ${({ theme }) => theme?.borders || '#252945'};
    transition: all 0.3s ease;

    @media (min-width: 768px) {
        padding: 48px;
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
    grid-template-columns: 1fr;
    gap: 32px;
    margin-bottom: 32px;

    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
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
    background-color: ${({ theme }) => theme?.backgrounds?.card || '#1E2139'};
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 32px;
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
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
`;

export const Item = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr ${({ showVat }) => showVat ? '1fr' : ''} 1fr;
    gap: 16px;
    align-items: center;
    padding: 16px;
    background-color: ${({ theme }) => theme?.backgrounds?.card || '#1E2139'};
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
        background-color: ${({ theme }) => theme?.backgrounds?.hover || '#252945'};
    }

    .item-details {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .item-mobile-details {
        display: none;
        font-size: 13px;
        color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 8px;

        .item-mobile-details {
            display: block;
        }

        > div:not(.item-details) {
            display: none;
        }
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px;
    background-color: ${({ theme }) => theme?.backgrounds?.card || '#1E2139'};
    border-top: 1px solid ${({ theme }) => theme?.borders || '#252945'};
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
    gap: 24px;
    margin-top: 8px;
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

    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
    }
`;

export const PaymentDetailsSection = styled.div`
    background-color: ${({ theme }) => theme?.backgrounds?.card || '#1E2139'};
    border-radius: 12px;
    padding: 24px;
    border: 1px solid ${({ theme }) => theme?.borders || '#252945'};
`;

export const PaymentDetailsHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
`;

export const PaymentDetailsTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    margin: 0;
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

export const PaymentDetailsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
`;

export const PaymentDetailItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
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
    padding-top: 32px;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const TermsTitle = styled.h3`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.25px;
    margin: 0 0 8px;
`;

export const TermsText = styled.p`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    line-height: 1.25;
    margin: 0;
    white-space: pre-wrap;
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: 8px;
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