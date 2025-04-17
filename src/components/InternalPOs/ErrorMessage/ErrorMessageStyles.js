import styled from 'styled-components';

export const ErrorMessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
    background-color: ${({ theme }) => theme.colors.bgInvoiceItem};
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin: 32px 0;
`;

export const Title = styled.h3`
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Text = styled.p`
    margin: 0;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textSecondary};
    max-width: 400px;
`; 