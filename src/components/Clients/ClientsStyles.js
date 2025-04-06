import styled from 'styled-components';

export const StyledClients = styled.main`
    width: 100%;
    max-width: 1020px;
    margin: 0 auto;
    padding: 32px 24px;
    background-color: #1E2139;
    min-height: calc(100vh - 60px);
    padding-bottom: calc(60px + 32px);
    
    @media (min-width: 768px) {
        padding: 56px 48px;
        padding-bottom: calc(60px + 56px);
    }
    
    @media (min-width: 1024px) {
        padding: 72px 48px;
        max-width: 1100px;
        min-height: 100vh;
        padding-bottom: 72px;
    }
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
    
    @media (min-width: 768px) {
        margin-bottom: 40px;
    }
`;

export const TitleContainer = styled.div``;

export const Title = styled.h1`
    font-size: 24px;
    font-weight: 700;
    color: #FFFFFF;
    margin: 0;
    
    @media (min-width: 768px) {
        font-size: 32px;
    }
`;

export const ClientCount = styled.p`
    font-size: 13px;
    color: #DFE3FA;
    margin: 4px 0 0 0;
`;

export const ButtonContainer = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;

export const NewClientButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background-color: #7C5DFA;
    color: white;
    border: none;
    border-radius: 24px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #9277FF;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const ImportExportButton = styled(NewClientButton)`
    background-color: #252945;
    display: none;
    
    &:hover {
        background-color: #373B53;
    }

    @media (min-width: 768px) {
        display: flex;
    }
`;

export const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 48px 24px;
    
    img {
        width: 240px;
        height: 200px;
        margin-bottom: 32px;
    }
    
    @media (min-width: 768px) {
        padding: 64px;
    }
`;

export const EmptyHeading = styled.h2`
    font-size: 20px;
    font-weight: 700;
    color: #FFFFFF;
    margin: 0 0 16px 0;
`;

export const EmptyText = styled.p`
    font-size: 13px;
    line-height: 1.6;
    color: #DFE3FA;
    margin: 0;
    
    strong {
        color: #FFFFFF;
    }
`;

export const ClientList = styled.div`
    display: grid;
    gap: 16px;
    
    
    @media (min-width: 768px) {
        gap: 24px;
    }
`;

export const ClientItem = styled.div`
    background-color: ${({ theme }) => theme.invoiceItem};
    border-radius: 8px;
    padding: 24px;
    border: 1px solid #252945;
    transition: all 0.2s ease;
    
    &:hover {
        border-color: #7C5DFA;
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
    color: #FFFFFF;
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
    color: #DFE3FA;
    margin: 4px 0;
    
    strong {
        font-weight: 700;
        color: #FFFFFF;
    }
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: 8px;
    
    @media (min-width: 768px) {
        justify-content: flex-end;
    }
`;

export const EditButton = styled.button`
    background-color: #252945;
    color: #DFE3FA;
    border: 1px solid #252945;
    border-radius: 24px;
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #1E2139;
        border-color: #7C5DFA;
        color: #7C5DFA;
    }
    
    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    @media (min-width: 768px) {
        padding: 8px 16px;
        font-size: 14px;
    }
`;

export const DeleteButton = styled.button`
    background-color: #EC5757;
    color: white;
    border: none;
    border-radius: 24px;
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s ease;
    
    &:hover {
        background-color: #FF5252;
    }
    
    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    @media (min-width: 768px) {
        padding: 8px 16px;
        font-size: 14px;
    }
`;

export const HeaderContent = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
`;

export const TitleGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const SearchBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    padding: 16px 24px;
    background-color: #252945;
    border-radius: 8px;
    border: 1px solid #252945;
    transition: all 0.2s ease;

    @media (min-width: 768px) {
        padding: 16px 32px;
        margin-bottom: 40px;
    }
`;

export const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    max-width: 400px;
`;

export const SearchInput = styled.input`
    background: none;
    border: none;
    color: #FFFFFF;
    font-size: 14px;
    width: 100%;
    padding: 0;
    margin: 0;
    outline: none;

    &::placeholder {
        color: #888EB0;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
        -webkit-text-fill-color: #FFFFFF;
        -webkit-box-shadow: 0 0 0px 1000px #252945 inset;
        transition: background-color 5000s ease-in-out 0s;
    }
`;

export const SearchIcon = styled.span`
    color: #888EB0;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;

    ${SearchContainer}:focus-within & {
        color: #7C5DFA;
    }
`;

export const Pagination = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 24px;
    padding: 16px;
`;

export const PageButton = styled.button`
    background-color: #252945;
    color: #FFF;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s ease;

    &:hover:not(:disabled) {
        background-color: #7C5DFA;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const PageInfo = styled.span`
    color: #DFE3FA;
    font-size: 14px;
`; 