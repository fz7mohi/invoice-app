import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from '../shared/Button/Button';

export const StyledPurchaseOrderView = styled.div`
    padding: 20px;
    background-color: ${({ theme }) => theme.colors.background};
    min-height: 100vh;
`;

export const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
`;

export const MotionLink = styled(motion(Link))`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;
    margin-bottom: 20px;
    font-weight: 500;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

export const Controller = styled(motion.div)`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
`;

export const Text = styled.p`
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
`;

export const ButtonWrapper = styled.div`
    display: flex;
    gap: 10px;
`;

export const InfoCard = styled(motion.div)`
    background-color: ${({ theme }) => theme.colors.surface};
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const InfoHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const InfoID = styled.h2`
    font-size: 24px;
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
`;

export const InfoDesc = styled.p`
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
`;

export const InfoGroup = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 20px;
`;

export const InfoAddresses = styled.div`
    flex: 1;
    min-width: 300px;
`;

export const AddressGroup = styled.div`
    margin-bottom: 20px;
`;

export const AddressTitle = styled.h3`
    font-size: 18px;
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 10px 0;
`;

export const AddressText = styled.div`
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
`;

export const Details = styled.div`
    flex: 1;
    min-width: 300px;
`;

export const ItemsHeader = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    gap: 10px;
    padding: 15px;
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
    margin-bottom: 10px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};

    @media (max-width: 768px) {
        display: none;
    }
`;

export const HeaderCell = styled.div`
    text-align: ${({ align }) => align || 'left'};
`;

export const Items = styled.div`
    margin-bottom: 20px;
`;

export const Item = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    gap: 10px;
    padding: 15px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};

    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
`;

export const ItemName = styled.div`
    color: ${({ theme }) => theme.colors.text};
`;

export const ItemDescription = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-top: 5px;
`;

export const ItemQty = styled.div`
    text-align: center;
    color: ${({ theme }) => theme.colors.text};
`;

export const ItemPrice = styled.div`
    text-align: right;
    color: ${({ theme }) => theme.colors.text};
`;

export const ItemVat = styled.div`
    text-align: right;
    color: ${({ theme }) => theme.colors.text};
`;

export const ItemTotal = styled.div`
    text-align: right;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
`;

export const Total = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
    margin-bottom: 10px;
`;

export const TotalText = styled.span`
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
`;

export const TotalAmount = styled.span`
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
`;

export const TermsSection = styled.div`
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const TermsTitle = styled.h3`
    font-size: 18px;
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 10px 0;
`;

export const TermsText = styled.p`
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
    white-space: pre-wrap;
`;

export const StatusBadge = styled.div`
    display: inline-flex;
    align-items: center;
`;

export const MetaInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const MetaItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${({ theme }) => theme.colors.text};
`;

export const DownloadButton = styled(Button)`
    margin-right: 10px;
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: 10px;
`;

export const StatusDot = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ status, theme }) => {
        switch (status) {
            case 'draft':
                return theme.colors.warning;
            case 'pending':
                return theme.colors.info;
            case 'approved':
                return theme.colors.success;
            case 'rejected':
                return theme.colors.error;
            default:
                return theme.colors.textSecondary;
        }
    }};
    margin-right: 8px;
`;

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

export const ModalContent = styled.div`
    background-color: ${({ theme }) => theme.colors.surface};
    border-radius: 8px;
    padding: 20px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
`;

export const ModalIconWrapper = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.error}20;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.colors.error};
`;

export const ModalTitle = styled.h3`
    font-size: 18px;
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
`;

export const ModalText = styled.p`
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 20px;
`;

export const FormGroup = styled.div`
    margin-bottom: 20px;
`;

export const FormLabel = styled.label`
    display: block;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.text};
`;

export const TextArea = styled.textarea`
    width: 100%;
    padding: 10px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    resize: vertical;
    min-height: 100px;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
    }
`;

export const ModalActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;

export const StatusContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

export const HeaderSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

export const HeaderTitle = styled.h1`
    font-size: 24px;
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
`;

export const ActionButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`; 