import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const StyledReceiptView = styled.main`
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

export const MotionLink = styled(motion(Link))`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.colors.textPrimary};
    text-decoration: none;
    font-weight: 700;
    font-size: 12px;
    line-height: 1.25;
    letter-spacing: -0.25px;
    margin-bottom: 28px;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
        color: ${({ theme }) => theme.colors.purple};
    }
`;

export const Controller = styled(motion.div)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    @media (min-width: 768px) {
        margin-bottom: 32px;
    }
`;

export const Text = styled.span`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    line-height: 1.25;
`;

export const ButtonWrapper = styled.div`
    display: flex;
    gap: 8px;
`;

export const InfoCard = styled(motion.div)`
    background: ${({ theme }) => theme.colors.cardBg};
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 24px;

    @media (min-width: 768px) {
        padding: 32px;
        margin-bottom: 32px;
    }
`;

export const InfoHeader = styled.div`
    margin-bottom: 32px;
`;

export const InfoID = styled.h2`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 20px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.5px;
    margin: 0 0 8px;

    span {
        color: ${({ theme }) => theme.colors.textTertiary};
    }
`;

export const InfoDesc = styled.p`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    line-height: 1.25;
    margin: 0 0 24px;
`;

export const InfoGroup = styled.div`
    display: flex;
    flex-direction: column;
`;

export const InfoAddresses = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    margin-bottom: 32px;

    @media (min-width: 768px) {
        gap: 48px;
    }
`;

export const AddressGroup = styled.div`
    text-align: ${({ align }) => align || 'left'};
`;

export const AddressTitle = styled.h3`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.25px;
    margin: 0 0 8px;
`;

export const AddressText = styled.p`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 12px;
    line-height: 1.25;
    margin: 0;
`;

export const Details = styled.div`
    margin-top: 32px;
    padding: 24px;
    background: ${({ theme }) => theme.colors.itemBg};
    border-radius: 8px;
`;

export const ItemsHeader = styled.div`
    display: grid;
    grid-template-columns: ${({ showVat }) => showVat ? '2fr 1fr 1fr 1fr 1fr' : '2fr 1fr 1fr 1fr'};
    gap: 16px;
    margin-bottom: 24px;
    padding: 0 16px;
`;

export const HeaderCell = styled.div`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.25px;
    text-align: ${({ align }) => align || 'left'};
`;

export const Items = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

export const Item = styled.div`
    display: grid;
    grid-template-columns: ${({ showVat }) => showVat ? '2fr 1fr 1fr 1fr 1fr' : '2fr 1fr 1fr 1fr'};
    gap: 16px;
    padding: 16px;
    background: ${({ theme }) => theme.colors.itemBg};
    border-radius: 8px;

    .item-details {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .item-mobile-details {
        display: none;
        color: ${({ theme }) => theme.colors.textSecondary};
        font-size: 11px;
        line-height: 1.25;
    }

    @media (max-width: 767px) {
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

export const ItemName = styled.span`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 12px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.25px;
`;

export const ItemDescription = styled.span`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 11px;
    line-height: 1.25;
`;

export const ItemQty = styled.span`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 12px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.25px;
    text-align: center;
`;

export const ItemPrice = styled.span`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 12px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.25px;
    text-align: right;
`;

export const ItemVat = styled.span`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 12px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.25px;
    text-align: right;
`;

export const ItemTotal = styled.span`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 12px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.25px;
    text-align: right;
`;

export const Total = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    background: ${({ theme }) => theme.colors.totalBg};
    border-radius: 8px;
`;

export const TotalText = styled.span`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.25px;
`;

export const TotalAmount = styled.span`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 24px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.5px;
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

export const StatusBadge = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 6px;
    background: ${({ status, theme }) => {
        switch (status) {
            case 'paid':
                return theme.colors.statusPaidBg;
            case 'pending':
                return theme.colors.statusPendingBg;
            default:
                return theme.colors.statusDraftBg;
        }
    }};
    color: ${({ status, theme }) => {
        switch (status) {
            case 'paid':
                return theme.colors.statusPaidText;
            case 'pending':
                return theme.colors.statusPendingText;
            default:
                return theme.colors.statusDraftText;
        }
    }};
    font-weight: 700;
    font-size: 12px;
    line-height: 1.25;
    text-transform: capitalize;
`;

export const MetaInfo = styled.div`
    display: flex;
    gap: 16px;
`;

export const MetaItem = styled.span`
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    line-height: 1.25;
`;

export const DownloadButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: ${({ theme }) => theme.colors.purple};
    border: none;
    border-radius: 6px;
    color: white;
    font-weight: 700;
    font-size: 12px;
    line-height: 1.25;
    cursor: pointer;
    transition: opacity 0.3s ease;

    &:hover {
        opacity: 0.8;
    }
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

export const HeaderSection = styled.div`
    margin-bottom: 24px;
`;

export const HeaderTitle = styled.h1`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 32px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.8px;
    margin: 0;
`; 