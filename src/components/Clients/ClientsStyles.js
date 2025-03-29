import styled from 'styled-components';

export const StyledClients = styled.main`
    padding: 32px 24px;
    
    @media (min-width: 768px) {
        padding: 56px 48px;
    }
    
    @media (min-width: 1024px) {
        padding: 72px;
        padding-left: 175px;
    }
`;

export const Header = styled.header`
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-bottom: 32px;
    
    @media (min-width: 768px) {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 56px;
    }
`;

export const TitleContainer = styled.div``;

export const Title = styled.h1`
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
    
    @media (min-width: 768px) {
        font-size: 32px;
    }
`;

export const ClientCount = styled.p`
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 4px 0 0 0;
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const NewClientButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: ${({ theme }) => theme.colors.purple};
    color: white;
    border: none;
    border-radius: 24px;
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    
    &:hover {
        background-color: ${({ theme }) => theme.colors.purpleLight};
    }
    
    &:disabled {
        background-color: ${({ theme }) => theme.colors.purpleLight};
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    @media (min-width: 768px) {
        padding: 8px 16px;
        font-size: 14px;
    }
`;

export const EmptyState = styled.div`
    max-width: 220px;
    margin: 0 auto;
    text-align: center;
    margin-top: 100px;
    
    img {
        width: 180px;
        height: auto;
        margin-bottom: 40px;
    }
    
    @media (min-width: 768px) {
        max-width: 250px;
        
        img {
            width: 200px;
        }
    }
`;

export const EmptyHeading = styled.h2`
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0 0 16px 0;
`;

export const EmptyText = styled.p`
    font-size: 13px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
`;

export const ClientList = styled.div`
    display: grid;
    gap: 16px;
    
    @media (min-width: 768px) {
        gap: 24px;
    }
`;

export const ClientItem = styled.div`
    background-color: ${({ theme }) => theme.colors.bgInvoiceItem};
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 10px 10px -10px rgba(72, 84, 159, 0.1);
    border: 1px solid transparent;
    transition: border-color 0.2s;
    
    &:hover {
        border-color: ${({ theme }) => theme.colors.purple};
    }
    
    @media (min-width: 768px) {
        display: grid;
        grid-template-columns: 2fr 3fr 1fr;
        align-items: center;
        padding: 16px 24px;
        gap: 16px;
    }
`;

export const CompanyName = styled.h3`
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0 0 8px 0;
    
    @media (min-width: 768px) {
        margin: 0;
    }
`;

export const ClientInfo = styled.div`
    margin-bottom: 16px;
    
    @media (min-width: 768px) {
        margin-bottom: 0;
    }
`;

export const InfoItem = styled.p`
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 4px 0;
    
    strong {
        font-weight: 700;
        color: ${({ theme }) => theme.colors.textPrimary};
    }
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: 8px;
`;

export const Button = styled.button`
    padding: 8px 16px;
    border-radius: 24px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

export const EditButton = styled(Button)`
    background-color: ${({ theme }) => theme.colors.btnEdit};
    color: ${({ theme }) => theme.colors.btnEditText};
    border: none;
    
    &:hover:not(:disabled) {
        background-color: ${({ theme }) => theme.colors.btnEditHover};
    }
`;

export const DeleteButton = styled(Button)`
    background-color: ${({ theme }) => theme.colors.red};
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
        background-color: ${({ theme }) => theme.colors.redLight};
    }
`; 