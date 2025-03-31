import styled from 'styled-components';
import { motion } from 'framer-motion';

export const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    width: 100%;
`;

export const QuotationItem = styled(motion.div)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 7.2rem;
    border-radius: 0.8rem;
    box-shadow: 0 10px 10px -10px rgba(72, 84, 159, 0.1);
    background-color: ${({ theme }) => theme.invoiceItem};
    padding: 0 2.4rem;
    text-decoration: none;
    transition: border 0.2s ease;
    border: 1px solid transparent;

    &:hover {
        border: 1px solid ${({ theme }) => theme.btnPrimary};
    }

    @media (max-width: 768px) {
        height: 13.4rem;
        flex-direction: column;
        padding: 2.4rem;
        align-items: flex-start;
    }
`;

export const QuotationInfo = styled.div`
    display: flex;
    gap: 4.4rem;

    @media (max-width: 768px) {
        width: 100%;
        justify-content: space-between;
        gap: 0;
        margin-bottom: 2.4rem;
    }
`;

export const QuotationId = styled.h3`
    font-size: 1.2rem;
    color: ${({ theme }) => theme.textPrimary};

    span {
        color: #7e88c3;
    }
`;

export const ClientName = styled.p`
    font-size: 1.2rem;
    color: ${({ theme }) => theme.textTertiary};
    min-width: 11rem;

    @media (max-width: 768px) {
        grid-column: 1 / 2;
        grid-row: 2 / 3;
    }
`;

export const DueDate = styled.p`
    font-size: 1.2rem;
    color: ${({ theme }) => theme.textSecondary};
    min-width: 14rem;

    @media (max-width: 768px) {
        text-align: right;
    }
`;

export const Total = styled.div`
    display: flex;
    align-items: center;
    gap: 4rem;

    h3 {
        font-size: 1.6rem;
        min-width: 10rem;
        color: ${({ theme }) => theme.textPrimary};
        text-align: right;
    }

    @media (max-width: 768px) {
        width: 100%;
        justify-content: space-between;
    }
`;

export const StatusContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 2rem;
`;

export const Status = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 10.4rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-weight: 700;
    font-size: 1.2rem;

    span {
        margin-right: 0.8rem;
        font-size: 1.8rem;
    }

    ${({ status, theme }) => {
        switch (status) {
            case 'draft':
                return `
                    color: ${theme.textDraft};
                    background-color: ${theme.backgroundDraft};
                `;
            case 'pending':
                return `
                    color: ${theme.textPending};
                    background-color: ${theme.backgroundPending};
                `;
            case 'invoiced':
                return `
                    color: ${theme.textPaid};
                    background-color: ${theme.backgroundPaid};
                `;
            default:
                return '';
        }
    }}
`;

export const ShowMore = styled.div`
    &:hover {
        transform: translateX(0.4rem);
    }
`; 