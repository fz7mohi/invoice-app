import styled from 'styled-components';

export const FormContainer = styled.div`
    padding: 2rem;
    max-width: 616px;
    margin: 0 auto;
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: 20px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 2rem;
`;

export const Hashtag = styled.span`
    color: ${({ theme }) => theme.colors.purple};
`;

export const InvoiceForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

export const Fieldset = styled.fieldset`
    border: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

export const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

export const Label = styled.label`
    font-size: 0.875rem;
    font-weight: 500;
    color: ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.textSecondary)};
`;

export const Error = styled.span`
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.error};
`;

export const Input = styled.input`
    padding: 0.75rem 1rem;
    border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.border)};
    border-radius: 8px;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
    transition: border-color 0.2s ease;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.purple};
    }

    &::placeholder {
        color: ${({ theme }) => theme.colors.textSecondary};
    }
`;

export const InputsGroup = styled.div`
    display: grid;
    grid-template-columns: ${({ $fullWidthMobile }) => ($fullWidthMobile ? '1fr' : '1fr 1fr')};
    gap: 1rem;

    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
    }
`;

export const SelectWrapper = styled.div`
    position: relative;
`;

export const SelectButton = styled.button`
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: border-color 0.2s ease;

    &:hover {
        border-color: ${({ theme }) => theme.colors.purple};
    }
`;

export const DropdownList = styled.ul`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.5rem;
    padding: 0.5rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.background};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    max-height: 200px;
    overflow-y: auto;
`;

export const DropdownItem = styled.li`
    list-style: none;
`;

export const DropdownOption = styled.button`
    width: 100%;
    padding: 0.5rem 1rem;
    border: none;
    background: none;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text};
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: ${({ theme }) => theme.colors.backgroundHover};
    }
`;

export const TextArea = styled.textarea`
    padding: 0.75rem 1rem;
    border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.border)};
    border-radius: 8px;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
    min-height: 100px;
    resize: vertical;
    transition: border-color 0.2s ease;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.purple};
    }

    &::placeholder {
        color: ${({ theme }) => theme.colors.textSecondary};
    }
`;

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const ItemInputsGroup = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    position: relative;

    .qty-price-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .vat-total-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid ${({ theme }) => theme.colors.border};
    }
`;

export const MinimalLabel = styled(Label)`
    font-size: 0.75rem;
`;

export const MinimalInput = styled(Input)`
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    width: ${({ $qty }) => ($qty ? '60px' : '100%')};
`;

export const ItemQty = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

export const ItemPrice = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

export const ItemVat = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

export const ItemTotal = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

export const VatValue = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    display: flex;
    align-items: center;
    gap: 0.25rem;

    .currency {
        color: ${({ theme }) => theme.colors.text};
    }
`;

export const TotalValue = styled.div`
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    display: flex;
    align-items: center;
    gap: 0.25rem;

    .currency {
        color: ${({ theme }) => theme.colors.text};
    }
`;

export const ItemDelete = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.5rem;
    border: none;
    background: none;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
        opacity: 0.7;
    }
`;

export const AddNewItemButton = styled.button`
    width: 100%;
    padding: 0.75rem;
    border: 1px dashed ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    background: none;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: ${({ theme }) => theme.colors.purple};
        color: ${({ theme }) => theme.colors.purple};
    }
`;

export const ErrorsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    background-color: ${({ theme }) => theme.colors.errorLight};
    border-radius: 8px;
`;

export const ClientDetailsCard = styled.div`
    padding: 1rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.backgroundHover};
`;

export const CardTitle = styled.h3`
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 1rem;
`;

export const ClientInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

export const InfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

export const InfoIcon = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.background};
`;

export const InfoValue = styled.span`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text};
`; 