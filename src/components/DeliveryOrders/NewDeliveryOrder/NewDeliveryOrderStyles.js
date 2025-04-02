import styled from 'styled-components';

export const Container = styled.div`
    background: #1a1a1a;
    border-radius: 12px;
    padding: 2rem;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    color: #e0e0e0;
`;

export const Header = styled.div`
    margin-bottom: 2rem;
    text-align: center;
`;

export const Title = styled.h2`
    font-size: 1.5rem;
    color: #ffffff;
    margin: 0;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

export const Label = styled.label`
    font-size: 0.875rem;
    color: #b0b0b0;
    font-weight: 500;
`;

export const Select = styled.select`
    padding: 0.75rem;
    border: 1px solid #333;
    border-radius: 8px;
    font-size: 1rem;
    color: #e0e0e0;
    background-color: #2a2a2a;
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: #007AFF;
        box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
    }

    option {
        background-color: #2a2a2a;
        color: #e0e0e0;
    }
`;

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
`;

export const GridItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

export const Value = styled.span`
    font-size: 1rem;
    color: #ffffff;
    font-weight: 500;
`;

export const Card = styled.div`
    background: #2a2a2a;
    border-radius: 10px;
    padding: 1.5rem;
    transition: all 0.2s ease;
    border: 1px solid #333;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        border-color: #444;
    }
`;

export const CardTitle = styled.h3`
    font-size: 1rem;
    color: #b0b0b0;
    margin: 0 0 1rem 0;
    font-weight: 600;
`;

export const CardContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const ClientInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

export const ClientName = styled.h4`
    font-size: 1.125rem;
    color: #ffffff;
    margin: 0;
    font-weight: 600;
`;

export const ClientAddress = styled.p`
    font-size: 0.875rem;
    color: #b0b0b0;
    margin: 0;
    line-height: 1.5;
`;

export const InvoiceInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

export const InvoiceNumber = styled.span`
    font-size: 1rem;
    color: #ffffff;
    font-weight: 500;
`;

export const InvoiceDate = styled.span`
    font-size: 0.875rem;
    color: #b0b0b0;
`;

export const ItemsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const ItemRow = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
    background: #2a2a2a;
    border-radius: 8px;
    transition: all 0.2s ease;
    border: 1px solid #333;

    &:hover {
        background: #333;
        border-color: #444;
    }
`;

export const ItemName = styled.span`
    font-size: 0.875rem;
    color: #ffffff;
    font-weight: 500;
`;

export const ItemQuantity = styled.span`
    font-size: 0.875rem;
    color: #b0b0b0;
`;

export const ItemPrice = styled.span`
    font-size: 0.875rem;
    color: #b0b0b0;
    text-align: right;
`;

export const PackagingType = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    grid-column: 1 / -1;
    padding-top: 1rem;
    border-top: 1px solid #444;
`;

export const CartonDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: #333;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #444;
`;

export const CartonGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
`;

export const CartonInput = styled.input`
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #444;
    border-radius: 6px;
    font-size: 0.875rem;
    color: #e0e0e0;
    background-color: #2a2a2a;
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: #007AFF;
        box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
    }
`;

export const CartonLabel = styled.label`
    font-size: 0.75rem;
    color: #b0b0b0;
    margin-bottom: 0.25rem;
    display: block;
`;

export const TotalPieces = styled.div`
    font-size: 0.875rem;
    color: #ffffff;
    font-weight: 500;
    text-align: right;
    padding-top: 0.5rem;
    border-top: 1px solid #444;
`;

export const StepActions = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #444;
`;

export const BackButton = styled.button`
    padding: 0.75rem 1.5rem;
    border: 1px solid #444;
    border-radius: 8px;
    background: #2a2a2a;
    color: #b0b0b0;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #333;
        border-color: #555;
        color: #ffffff;
    }
`;

export const NextButton = styled.button`
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    background: #007AFF;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #0066CC;
    }

    &:disabled {
        background: #444;
        cursor: not-allowed;
    }
`;

export const SubmitButton = styled(NextButton)`
    background: #34C759;

    &:hover {
        background: #2FB750;
    }

    &:disabled {
        background: #444;
    }
`;

export const ErrorMessage = styled.div`
    color: #FF453A;
    font-size: 0.875rem;
    padding: 0.75rem;
    background: rgba(255, 69, 58, 0.1);
    border-radius: 8px;
    margin-top: 1rem;
    border: 1px solid rgba(255, 69, 58, 0.3);
`;

export const CloseButton = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: #b0b0b0;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
        background: #333;
        color: #ffffff;
    }
`;

export const StepIndicator = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 2rem 0;
    position: relative;
`;

export const Step = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    z-index: 1;
    flex: 1;
`;

export const StepNumber = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${props => props.$completed ? '#34C759' : props.$active ? '#007AFF' : '#333'};
    color: ${props => props.$completed || props.$active ? 'white' : '#b0b0b0'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;
    border: 1px solid ${props => props.$completed ? '#34C759' : props.$active ? '#007AFF' : '#444'};
`;

export const StepLabel = styled.span`
    font-size: 0.75rem;
    color: ${props => props.$active ? '#ffffff' : '#b0b0b0'};
    font-weight: ${props => props.$active ? '500' : '400'};
`;

export const StepContent = styled.div`
    animation: fadeIn 0.3s ease;
    min-height: 300px;

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

export const ProgressBar = styled.div`
    height: 4px;
    background: #333;
    border-radius: 2px;
    overflow: hidden;
    margin: 1rem 0;
`;

export const ProgressFill = styled.div`
    height: 100%;
    background-color: #4CAF50;
    border-radius: 4px;
    transition: width 0.3s ease;
`;

// New styled components for improved packaging wizard
export const PackagingHeader = styled.div`
    margin-bottom: 24px;
    text-align: center;
`;

export const PackagingTitle = styled.h2`
    font-size: 24px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 8px;
`;

export const PackagingSubtitle = styled.p`
    font-size: 16px;
    color: #b0b0b0;
    margin-bottom: 0;
`;

export const ItemsTabs = styled.div`
    display: flex;
    overflow-x: auto;
    margin-bottom: 24px;
    border-bottom: 1px solid #333;
    padding-bottom: 8px;
    
    &::-webkit-scrollbar {
        height: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: #1a1a1a;
        border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #444;
        border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
`;

export const ItemTab = styled.div`
    padding: 10px 20px;
    margin-right: 8px;
    background-color: ${props => props.$active ? '#2a2a2a' : '#1a1a1a'};
    color: ${props => props.$active ? '#ffffff' : '#b0b0b0'};
    border-radius: 20px;
    font-weight: ${props => props.$active ? '600' : '400'};
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;
    border: 1px solid ${props => props.$active ? '#007AFF' : 'transparent'};
    
    &:hover {
        background-color: ${props => props.$active ? '#333' : '#222'};
    }
`;

export const ItemCard = styled.div`
    background-color: #2a2a2a;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    margin-bottom: 24px;
    overflow: hidden;
    display: ${props => props.$active ? 'block' : 'none'};
    animation: fadeIn 0.3s ease;
    border: 1px solid #333;
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

export const ItemHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background-color: #333;
    border-bottom: 1px solid #444;
`;

export const PackagingSection = styled.div`
    padding: 20px;
`;

export const PackagingTypeLabel = styled.h3`
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #ffffff;
`;

export const PackagingTypeSelector = styled.div`
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
`;

export const PackagingOption = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px 24px;
    border-radius: 8px;
    border: 2px solid ${props => props.$selected ? '#007AFF' : '#444'};
    background-color: ${props => props.$selected ? '#333' : '#2a2a2a'};
    cursor: pointer;
    transition: all 0.2s ease;
    flex: 1;
    
    &:hover {
        border-color: ${props => props.$selected ? '#007AFF' : '#555'};
        background-color: ${props => props.$selected ? '#333' : '#333'};
    }
`;

export const PackagingIcon = styled.span`
    font-size: 24px;
    margin-bottom: 8px;
`;

export const PackagingOptionLabel = styled.span`
    font-weight: ${props => props.$selected ? '600' : '400'};
    color: ${props => props.$selected ? '#ffffff' : '#b0b0b0'};
`;

export const PieceDetails = styled.div`
    background-color: #333;
    border-radius: 8px;
    padding: 20px;
    margin-top: 16px;
    border: 1px solid #444;
`;

export const PieceInputGroup = styled.div`
    margin-bottom: 16px;
`;

export const PieceLabel = styled.label`
    display: block;
    font-weight: 500;
    margin-bottom: 8px;
    color: #ffffff;
`;

export const PieceInput = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid #444;
    border-radius: 4px;
    font-size: 16px;
    background-color: #2a2a2a;
    color: #ffffff;
    
    &:focus {
        border-color: #007AFF;
        outline: none;
        box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
    }
`;

export const PieceHelper = styled.p`
    font-size: 14px;
    color: #b0b0b0;
    margin-top: 8px;
`;

export const PieceSummary = styled.div`
    display: flex;
    justify-content: space-between;
    padding-top: 16px;
    border-top: 1px solid #444;
`;

export const PieceSummaryItem = styled.div`
    display: flex;
    flex-direction: column;
`;

export const PieceSummaryLabel = styled.span`
    font-size: 14px;
    color: #b0b0b0;
`;

export const PieceSummaryValue = styled.span`
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
`;

export const CartonDetailsContainer = styled.div`
    background-color: #333;
    border-radius: 8px;
    padding: 20px;
    margin-top: 16px;
    border: 1px solid #444;
`;

export const CartonHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

export const CartonTitle = styled.h3`
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
`;

export const AddCartonButton = styled.button`
    display: flex;
    align-items: center;
    background-color: #007AFF;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
    
    &:hover {
        background-color: #0066cc;
    }
`;

export const AddIcon = styled.span`
    margin-right: 8px;
    font-size: 16px;
`;

export const CartonCard = styled.div`
    background-color: #2a2a2a;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    margin-bottom: 16px;
    overflow: hidden;
    border: 1px solid #444;
`;

export const CartonCardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: #333;
    border-bottom: 1px solid #444;
`;

export const CartonCardTitle = styled.h4`
    font-size: 16px;
    font-weight: 600;
    color: #007AFF;
    margin: 0;
`;

export const RemoveCartonButton = styled.button`
    background: none;
    border: none;
    color: #b0b0b0;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s ease;
    
    &:hover {
        background-color: rgba(255, 255, 255, 0.05);
    }
`;

export const RemoveIcon = styled.span`
    font-size: 18px;
    line-height: 1;
`;

export const CartonCardContent = styled.div`
    padding: 16px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
`;

export const CartonField = styled.div`
    display: flex;
    flex-direction: column;
`;

export const CartonFieldLabel = styled.label`
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
    color: #ffffff;
`;

export const CartonSelect = styled.select`
    padding: 10px;
    border: 1px solid #444;
    border-radius: 4px;
    font-size: 14px;
    background-color: #2a2a2a;
    color: #ffffff;
    
    &:focus {
        border-color: #007AFF;
        outline: none;
        box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
    }
    
    option {
        background-color: #2a2a2a;
        color: #ffffff;
    }
`;

export const CartonInputField = styled.input`
    padding: 10px;
    border: 1px solid #444;
    border-radius: 4px;
    font-size: 14px;
    background-color: #2a2a2a;
    color: #ffffff;
    
    &:focus {
        border-color: #007AFF;
        outline: none;
        box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
    }
`;

export const CartonCardFooter = styled.div`
    padding: 12px 16px;
    background-color: #333;
    border-top: 1px solid #444;
`;

export const CartonSubtotal = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
`;

export const CartonSummary = styled.div`
    display: flex;
    justify-content: space-between;
    padding-top: 16px;
    margin-top: 16px;
    border-top: 1px solid #444;
`;

export const CartonSummaryItem = styled.div`
    display: flex;
    flex-direction: column;
`;

export const CartonSummaryLabel = styled.span`
    font-size: 14px;
    color: #b0b0b0;
`;

export const CartonSummaryValue = styled.span`
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
`; 