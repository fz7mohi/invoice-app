import styled from 'styled-components';

export const StyledInternalPOView = styled.div`
    max-width: 730px;
    margin: 0 auto;
    padding: 24px;
    color: ${({ theme }) => theme?.colors?.text || '#DFE3FA'};
`;

export const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
`;

export const BackButton = styled.button`
    display: flex;
    align-items: center;
    gap: 24px;
    background: none;
    border: none;
    color: ${({ theme }) => theme?.colors?.text || '#DFE3FA'};
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.3s ease;

    &:hover {
        opacity: 0.8;
    }
`;

export const Status = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background-color: ${({ theme, status }) => {
        switch (status) {
            case 'paid':
                return theme?.colors?.success || 'rgba(51, 214, 159, 0.1)';
            case 'pending':
                return theme?.colors?.warning || 'rgba(255, 143, 0, 0.1)';
            case 'draft':
                return theme?.colors?.draft || 'rgba(223, 227, 250, 0.1)';
            case 'void':
                return theme?.colors?.error || 'rgba(236, 87, 87, 0.1)';
            default:
                return theme?.colors?.draft || 'rgba(223, 227, 250, 0.1)';
        }
    }};
    border-radius: 6px;
`;

export const StatusDot = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ theme, status }) => {
        switch (status) {
            case 'paid':
                return theme?.colors?.success || '#33D69F';
            case 'pending':
                return theme?.colors?.warning || '#FF8F00';
            case 'draft':
                return theme?.colors?.draft || '#DFE3FA';
            case 'void':
                return theme?.colors?.error || '#EC5757';
            default:
                return theme?.colors?.draft || '#DFE3FA';
        }
    }};
`;

export const StatusText = styled.span`
    font-weight: 700;
    text-transform: capitalize;
    color: ${({ theme, status }) => {
        switch (status) {
            case 'paid':
                return theme?.colors?.success || '#33D69F';
            case 'pending':
                return theme?.colors?.warning || '#FF8F00';
            case 'draft':
                return theme?.colors?.draft || '#DFE3FA';
            case 'void':
                return theme?.colors?.error || '#EC5757';
            default:
                return theme?.colors?.draft || '#DFE3FA';
        }
    }};
`;

export const Buttons = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const Button = styled.button`
    padding: 12px 24px;
    border-radius: 24px;
    border: none;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.3s ease;
    background-color: ${({ theme, variant }) => {
        switch (variant) {
            case 'edit':
                return theme?.colors?.edit || '#252945';
            case 'delete':
                return theme?.colors?.error || '#EC5757';
            case 'markAsPaid':
                return theme?.colors?.success || '#33D69F';
            default:
                return theme?.colors?.edit || '#252945';
        }
    }};
    color: ${({ theme }) => theme?.colors?.text || '#DFE3FA'};

    &:hover {
        opacity: 0.8;
    }
`;

export const DeleteButton = styled(Button)`
    background-color: ${({ theme }) => theme?.colors?.error || '#EC5757'};
`;

export const Details = styled.div`
    background-color: ${({ theme }) => theme?.backgrounds?.card || '#1E2139'};
    border-radius: 8px;
    padding: 32px;
    margin-bottom: 24px;
`;

export const ItemsHeader = styled.div`
    display: grid;
    grid-template-columns: ${({ showVat }) => showVat ? '2fr 1fr 1fr 1fr 1fr' : '2fr 1fr 1fr 1fr'};
    gap: 16px;
    margin-bottom: 32px;
    padding: 0 32px;
`;

export const HeaderCell = styled.div`
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
    text-align: ${({ align }) => align || 'left'};
`;

export const Items = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 32px;
`;

export const Item = styled.div`
    display: grid;
    grid-template-columns: ${({ showVat }) => showVat ? '2fr 1fr 1fr 1fr 1fr' : '2fr 1fr 1fr 1fr'};
    gap: 16px;
    padding: 0 32px;
`;

export const ItemName = styled.div`
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.text || '#DFE3FA'};
`;

export const ItemDescription = styled.div`
    font-size: 13px;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
    margin-top: 4px;
`;

export const ItemQty = styled.div`
    text-align: center;
    color: ${({ theme }) => theme?.colors?.text || '#DFE3FA'};
`;

export const ItemPrice = styled.div`
    text-align: right;
    color: ${({ theme }) => theme?.colors?.text || '#DFE3FA'};
`;

export const ItemVat = styled.div`
    text-align: right;
    color: ${({ theme }) => theme?.colors?.text || '#DFE3FA'};
`;

export const ItemTotal = styled.div`
    text-align: right;
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.text || '#DFE3FA'};
`;

export const Total = styled.div`
    background-color: ${({ theme }) => theme?.backgrounds?.total || '#0C0E16'};
    border-radius: 8px;
    padding: 24px 32px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .grand-total {
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid ${({ theme }) => theme?.borders || '#252945'};
    }
`;

export const TotalText = styled.div`
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
`;

export const TotalAmount = styled.div`
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.text || '#DFE3FA'};
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

export const FormInput = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid ${({ theme }) => theme?.borders || '#252945'};
    border-radius: 4px;
    background-color: ${({ theme }) => theme?.backgrounds?.input || '#1E2139'};
    color: ${({ theme }) => theme?.colors?.text || '#DFE3FA'};
    font-size: 14px;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme?.colors?.purple || '#7C5DFA'};
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

export const PlusIcon = styled.div`
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme?.colors?.purple || '#7C5DFA'};
    border-radius: 50%;
    color: white;
    font-size: 20px;
    cursor: pointer;
    transition: opacity 0.3s ease;

    &:hover {
        opacity: 0.8;
    }
`; 