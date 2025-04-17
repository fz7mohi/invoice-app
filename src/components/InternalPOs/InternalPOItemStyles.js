import styled from 'styled-components';

export const StyledInternalPOItem = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto;
    align-items: center;
    gap: 16px;
    padding: 16px 24px;
    background-color: ${({ theme }) => theme.colors.bgInvoiceItem};
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
`;

export const Id = styled.span`
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
`;

export const DueDate = styled.span`
    color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ClientName = styled.span`
    color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Total = styled.span`
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Status = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background-color: ${({ theme }) => theme.colors.bgStatus};
    border-radius: 6px;
`;

export const StatusDot = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ color }) => color};
`;

export const StatusText = styled.span`
    text-transform: capitalize;
    color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Buttons = styled.div`
    display: flex;
    gap: 8px;
`;

export const Button = styled.button`
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    ${({ variant }) => {
        switch (variant) {
            case 'edit':
                return `
                    background-color: ${({ theme }) => theme.colors.bgEdit};
                    color: ${({ theme }) => theme.colors.textEdit};
                    
                    &:hover {
                        background-color: ${({ theme }) => theme.colors.bgEditHover};
                    }
                `;
            case 'delete':
                return `
                    background-color: ${({ theme }) => theme.colors.bgDelete};
                    color: ${({ theme }) => theme.colors.textDelete};
                    
                    &:hover {
                        background-color: ${({ theme }) => theme.colors.bgDeleteHover};
                    }
                `;
            case 'markAsPaid':
                return `
                    background-color: ${({ theme }) => theme.colors.purple};
                    color: ${({ theme }) => theme.colors.white};
                    
                    &:hover {
                        background-color: ${({ theme }) => theme.colors.purpleDark};
                    }
                `;
            default:
                return '';
        }
    }}
`; 