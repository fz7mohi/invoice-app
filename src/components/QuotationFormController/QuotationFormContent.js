import { useGlobalContext } from '../App/context';
import { useState, useRef, forwardRef, useEffect } from 'react';
import { useTheme } from 'styled-components';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dateToString from '../../utilities/dateToString';
import allowOnlyNumbers from '../../utilities/allowOnlyNumbers';
import Icon from '../shared/Icon/Icon';
import Button from '../shared/Button/Button';
import styled, { css } from 'styled-components';
import { defaultInput } from '../FormController/Form/FormStyles';
import { motion, AnimatePresence } from 'framer-motion';
import QuotationSubmitController from './QuotationSubmitController';

import {
    StyledForm,
    Title,
    Hashtag,
    Fieldset,
    Legend,
    InputWrapper,
    Label,
    ErrorsWrapper,
    Error,
    Input,
    InputsGroup,
    FormContainer,
    FloatingButtons,
} from '../FormController/Form/FormStyles';

// Date Picker Custom Components
export const CustomPicker = styled.button`
    ${defaultInput}
    text-align: left;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #1E2139;
    color: #FFFFFF;
    border: 1px solid #252945;

    &:hover {
        border-color: #7C5DFA;
    }

    &:focus {
        border-color: #7C5DFA;
        box-shadow: 0 0 0 2px rgba(124, 93, 250, 0.1);
    }
`;

const CustomInput = forwardRef(({ isDisabled, value, onClick }, ref) => (
    <CustomPicker
        type="button"
        disabled={isDisabled}
        onClick={onClick}
        value={value}
        ref={ref}
    >
        {dateToString(value)}
        <Icon name={'calendar'} size={12} color="hsl(252, 94%, 67%)" />
    </CustomPicker>
));

// Select Dropdown Components
const SelectWrapper = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    gap: 12px;
    align-items: flex-start;
`;

const SelectButton = styled.button`
    ${defaultInput}
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background-color: #1E2139;
    color: #FFFFFF;
    border: 1px solid #252945;
    width: 100%;
    text-align: left;

    &:hover {
        border-color: #7C5DFA;
    }

    &:focus {
        border-color: #7C5DFA;
        box-shadow: 0 0 0 2px rgba(124, 93, 250, 0.1);
    }
`;

// Add a new styled component for the New Client button
const NewClientButton = styled.button`
    ${defaultInput}
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: #1E2139;
    color: #FFFFFF;
    border: 1px solid #252945;
    padding: 8px;
    border-radius: 4px;
    min-width: 32px;
    height: 32px;
    width: 20%;

    &:hover {
        border-color: #7C5DFA;
    }

    &:focus {
        border-color: #7C5DFA;
        box-shadow: 0 0 0 2px rgba(124, 93, 250, 0.1);
    }
`;

// Add a new styled component for the autocomplete input
const AutocompleteInput = styled.input`
    ${defaultInput}
    width: 100%;
    background-color: #1E2139;
    color: #FFFFFF;
    border: 1px solid #252945;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: text;

    &:hover {
        border-color: #7C5DFA;
    }

    &:focus {
        border-color: #7C5DFA;
        box-shadow: 0 0 0 2px rgba(124, 93, 250, 0.1);
        outline: none;
    }
`;

const DropdownList = styled.ul`
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 100%;
    background-color: #1E2139;
    border-radius: 6px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
    z-index: 100;
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #252945;
`;

const DropdownItem = styled.li`
    &:not(:last-child) {
        border-bottom: 1px solid #252945;
    }
`;

const DropdownOption = styled.button`
    width: 100%;
    padding: 12px 16px;
    text-align: left;
    background: none;
    border: none;
    color: #FFFFFF;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    
    &:hover {
        color: #7C5DFA;
        background-color: rgba(124, 93, 250, 0.1);
    }
`;

const Cta = styled.button`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 16px 13px 16px 20px;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.colors.bgInputBorder};
    background-color: ${({ theme }) => theme.colors.bgInput};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 700;
    text-align: left;
    
    &:focus {
        border: 1px solid ${({ theme }) => theme.colors.purple};
        outline: none;
    }
    
    svg {
        transform: ${({ $isExpanded }) => $isExpanded ? 'rotate(180deg)' : 'rotate(0)'};
        transition: transform 0.3s ease;
    }
`;

// Item List Components
const Wrapper = styled.div`
    display: flex;
    flex-flow: column;
    gap: 16px;
    width: 100%;
    margin-bottom: 24px;
    
    @media (min-width: 768px) {
        gap: 20px;
    }
`;

const TotalValue = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid #252945;
    background-color: #1E2139;
    color: #FFFFFF;
    font-weight: 500;
    font-size: 13px;
    
    .currency {
        margin-right: 4px;
        font-size: 12px;
        color: #DFE3FA;
    }
`;

const Delete = styled.button`
    width: 18px;
    height: 16px;
    padding: 0;
    margin: 0;
    margin-top: 38px;
    background: none;
    border: none;
    cursor: pointer;
    color: #DFE3FA;
    align-self: center;
    
    &:hover {
        color: #EC5757;
    }
`;

// Add TextArea component for Terms and Conditions
export const TextArea = styled.textarea`
    ${defaultInput}
    resize: vertical;
    min-height: 120px;
    background-color: #1E2139;
    color: #FFFFFF;
    border: 1px solid #252945;
    font-family: inherit;
    line-height: 1.5;

    ${({ $error }) =>
        $error &&
        css`
            border-color: #EC5757;
            &:hover, &:focus {
                border-color: #EC5757;
                box-shadow: 0 0 0 2px rgba(236, 87, 87, 0.1);
            }
        `}

    ${({ $valid }) =>
        $valid &&
        css`
            border-color: #33D69F;
            &:hover, &:focus {
                border-color: #33D69F;
                box-shadow: 0 0 0 2px rgba(51, 214, 159, 0.1);
            }
        `}

    &:hover {
        border-color: #7C5DFA;
    }

    &:focus {
        border-color: #7C5DFA;
        box-shadow: 0 0 0 2px rgba(124, 93, 250, 0.1);
    }
`;

// Create a styled card component for client details
export const ClientDetailsCard = styled.div`
    padding: 20px;
    border-radius: 8px;
    background-color: #252945;
    border: 1px solid #1E2139;
    color: #FFFFFF;
    margin-bottom: 24px;

    h3 {
        font-size: 14px;
        font-weight: 600;
        color: #7C5DFA;
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    p {
        color: #DFE3FA;
        font-size: 13px;
        line-height: 1.5;
    }
`;

const CardTitle = styled.h3`
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0 0 10px 0;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const ClientInfoGrid = styled.div`
    display: grid;
    gap: 12px;
    
    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
    }
`;

const ClientInfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    color: #DFE3FA;
    font-size: 13px;

    @media (min-width: 768px) {
        font-size: 14px;
    }
`;

const InfoIcon = styled.span`
    margin-right: 8px;
    color: ${({ theme }) => theme.colors.textSecondary};
    display: flex;
    align-items: center;
`;

const InfoValue = styled.span`
    color: ${({ theme }) => theme.colors.textPrimary};
    overflow-wrap: break-word;
    word-break: break-word;
    line-height: 1.3;
`;

// Add a styled component for the description field
const DescriptionInput = styled.textarea`
    ${defaultInput}
    min-height: 50px;
    resize: vertical;
    font-size: 12px;
    margin-top: 4px;
    padding: 10px;
    
    ${({ $error }) =>
        $error &&
        `border: 1px solid ${props => props.theme.colors.red};`}
`;

// Update the styled component for the InputsGroup to support the new layout
const ItemInputsGroup = styled(InputsGroup)`
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 20px;
    background-color: #252945;
    border-radius: 8px;
    width: 100%;
    border: 1px solid #1E2139;
    
    /* On mobile, we'll use a different grid layout */
    display: grid;
    grid-template-areas:
        "name"
        "desc"
        "qty-price"
        "vat-total"
        "delete";
    
    /* For the qty-price and vat-total rows */
    .qty-price-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        grid-area: qty-price;
    }
    
    .vat-total-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        grid-area: vat-total;
    }
    
    @media (min-width: 768px) {
        grid-template-columns: repeat(5, 1fr) auto;
        grid-template-areas:
            "name name name name name delete"
            "desc desc desc desc desc desc"
            "qty price vat total total total";
        align-items: flex-start;
        gap: 16px;
        padding: 24px;
        
        /* Remove the wrapper divs on desktop */
        .qty-price-row, .vat-total-row {
            display: contents;
        }
    }
`;

const ItemName = styled(InputWrapper)`
    margin-bottom: 0;
    
    @media (min-width: 768px) {
        grid-area: name;
    }
`;

const ItemDescription = styled(InputWrapper)`
    margin-bottom: 0;
    
    @media (min-width: 768px) {
        grid-area: desc;
    }
`;

const ItemQty = styled(InputWrapper)`
    margin-bottom: 0;
    
    @media (min-width: 768px) {
        grid-area: qty;
    }
`;

const ItemPrice = styled(InputWrapper)`
    margin-bottom: 0;
    
    @media (min-width: 768px) {
        grid-area: price;
    }
`;

const ItemVat = styled(InputWrapper)`
    margin-bottom: 0;
    
    @media (min-width: 768px) {
        grid-area: vat;
    }
`;

const ItemTotal = styled(InputWrapper)`
    margin-bottom: 0;
    
    @media (min-width: 768px) {
        grid-area: total;
    }
`;

const ItemDelete = styled.button`
    width: 18px;
    height: 16px;
    padding: 0;
    margin: 0;
    background: none;
    border: none;
    cursor: pointer;
    color: #DFE3FA;
    align-self: flex-start;
    justify-self: flex-end;
    
    @media (min-width: 768px) {
        grid-area: delete;
    }
    
    &:hover {
        color: #EC5757;
    }
`;

// Update the VAT display value
const VatValue = styled(TotalValue)`
    color: #DFE3FA;
    font-size: 13px;
    font-weight: 500;
    padding: 10px 12px;
    background-color: #1E2139;
    border-radius: 6px;
    border: 1px solid #252945;
`;

// Add a custom styled form that extends StyledForm
const QuotationForm = styled(StyledForm)`
    width: 100%;
    height: 100%;
    padding: 24px;
    
    @media (min-width: 768px) {
        max-width: 100%;
        padding: 32px;
    }
    
    @media (min-width: 1024px) {
        padding: 40px;
    }
`;

// Add the MinimalLabel styled component
const MinimalLabel = styled(Label)`
    font-size: 12px;
    font-weight: 500;
    color: #DFE3FA;
    margin-bottom: 4px;
`;

// Add the MinimalInput styled component
const MinimalInput = styled(Input)`
    padding: 10px 12px;
    font-size: 13px;
    height: auto;
`;

// Add a function to get currency symbol based on country
const getCurrencySymbol = (country) => {
    const currencyMap = {
        'United Arab Emirates': 'AED',
        'Qatar': 'QAR',
        'Saudi Arabia': 'SAR',
        'Bahrain': 'BHD',
        'Kuwait': 'KWD',
        'Oman': 'OMR',
        'Egypt': 'EGP',
        'Jordan': 'JOD',
        'Lebanon': 'LBP',
        'Singapore': 'USD'
    };
    
    return currencyMap[country] || 'USD';
};

// Add a number formatting utility function
const formatNumber = (value) => {
    if (!value && value !== 0) return '0.00';
    
    // Ensure value is a number and has 2 decimal places
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) return '0.00';
    
    // Format with commas and 2 decimal places
    return numberValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

// Add a styled button for "Add New Item"
const AddNewItemButton = styled(Button)`
    background-color: #252945;
    color: #FFFFFF;
    border: 1px solid #252945;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #1E2139;
        border-color: #7C5DFA;
        color: #7C5DFA;
    }
    
    &:focus {
        outline: none;
        border-color: #7C5DFA;
        box-shadow: 0 0 0 2px rgba(124, 93, 250, 0.1);
    }
`;

// Update the FloatingButtons style
const StyledFloatingButtons = styled(FloatingButtons)`
    background-color: #1E2139;
    border-top: 1px solid #252945;
    padding: 16px 24px;
    
    @media (min-width: 768px) {
        padding: 16px 32px;
    }
    
    button {
        min-width: 120px;
        padding: 12px 24px;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
        
        &[type="submit"] {
            background-color: #7C5DFA;
            color: #FFFFFF;
            border: none;
            
            &:hover {
                background-color: #9277FF;
            }
        }
        
        &[type="button"] {
            background-color: #252945;
            color: #FFFFFF;
            border: 1px solid #252945;
            
            &:hover {
                background-color: #1E2139;
                border-color: #7C5DFA;
                color: #7C5DFA;
            }
        }
    }
`;

// Add a constant for default terms and conditions
const DEFAULT_TERMS_AND_CONDITIONS = `Validity: This quote is valid for 15 days from the date of issue.
Payment Terms: 50% advance payment along with the issuance of the LPO (Local Purchase Order), and the remaining 50% to be settled before the delivery of the order.`;

// Add this function at the top level of the component
const scrollToNewItem = (index) => {
    setTimeout(() => {
        const itemElement = document.getElementById(`item-${index}`);
        if (itemElement) {
            itemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
};

// Add new styled components for better mobile experience
const FormSection = styled.section`
    margin-bottom: 24px;
    
    @media (min-width: 768px) {
        margin-bottom: 32px;
    }
`;

const ItemCard = styled.div`
    background: rgba(37, 41, 69, 0.3);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    border: 1px solid #252945;
    position: relative;
    transition: all 0.3s ease;

    @media (min-width: 768px) {
        padding: 28px;
        margin-bottom: 24px;
        
        &:hover {
            border-color: #7C5DFA;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
            transform: translateY(-2px);
        }
    }
`;

const ItemHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #252945;

    @media (min-width: 768px) {
        padding-bottom: 0;
        margin-bottom: 24px;
        border-bottom: none;
    }
`;

const ItemTitle = styled.h3`
    color: #DFE3FA;
    font-size: 14px;
    font-weight: 600;
    margin: 0;

    @media (min-width: 768px) {
        font-size: 16px;
    }
`;

const ItemGrid = styled.div`
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr;
    
    @media (min-width: 768px) {
        grid-template-columns: 2.5fr 1fr 1fr 1fr 1fr;
        gap: 32px;
        align-items: start;
    }

    > div {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
`;

const DeleteButton = styled.button`
    background: none;
    border: none;
    padding: 8px;
    color: #888EB0;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 1;

    @media (min-width: 768px) {
        top: 28px;
        right: 28px;
        padding: 10px;
    }

    &:hover {
        color: #EC5757;
        background: rgba(236, 87, 87, 0.1);
    }

    &:focus-visible {
        outline: 2px solid #7C5DFA;
        outline-offset: 2px;
    }
`;

const AddItemButton = styled.button`
    width: 100%;
    padding: 16px;
    background: #252945;
    border: none;
    border-radius: 24px;
    color: #DFE3FA;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    &:hover {
        background: #1E2139;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &:active {
        transform: translateY(0);
    }

    &:focus-visible {
        outline: 2px solid #7C5DFA;
        outline-offset: 2px;
    }

    svg {
        width: 16px;
        height: 16px;
        transition: transform 0.2s ease;
    }

    &:hover svg {
        transform: rotate(90deg);
    }

    @media (min-width: 768px) {
        padding: 18px;
        font-size: 15px;
        max-width: 400px;
        margin: 12px auto;
    }
`;

const ClientCard = styled.div`
    background: ${({ $empty }) => ($empty ? 'transparent' : 'rgba(37, 41, 69, 0.3)')};
    border: 1px solid #252945;
    border-radius: 8px;
    padding: 16px;
    margin-top: 16px;

    @media (min-width: 768px) {
        padding: 24px;
        margin-top: 24px;
    }
`;

// Add this component to handle keyboard appearance on mobile
const KeyboardSpacer = styled.div`
    display: none;

    @media (max-width: 767px) {
        display: block;
        height: env(keyboard-inset-height, 0px);
    }
`;

// Add a new component for the items section header
const ItemsHeader = styled.div`
    display: none;
    
    @media (min-width: 768px) {
        display: grid;
        grid-template-columns: 2.5fr 1fr 1fr 1fr 1fr;
        gap: 32px;
        padding: 0 28px 16px 28px;
        border-bottom: 1px solid #252945;
        margin-bottom: 32px;
        
        span {
            color: #DFE3FA;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
    }
`;

// Add a total summary section for desktop
const ItemsSummary = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 24px;
    padding: 20px;
    background: rgba(37, 41, 69, 0.3);
    border-radius: 12px;
    border: 1px solid #252945;

    .summary-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;

        .summary-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }

        .label {
            color: #DFE3FA;
            font-size: 14px;
            font-weight: 500;
        }

        .value {
            color: #FFFFFF;
            font-size: 16px;
            font-weight: 600;
            text-align: right;
        }

        .currency {
            color: #888EB0;
            margin-right: 4px;
        }
    }
    
    @media (min-width: 768px) {
        margin-top: 32px;
        padding: 24px 28px;
        justify-content: flex-end;

        .summary-content {
            min-width: 300px;
        }
    }
`;

const ClientField = styled.div`
    position: relative;
    width: 100%;
`;

const ClearButton = styled.button`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #7C5DFA;
    padding: 4px;
    border-radius: 50%;
    z-index: 10;
    width: 24px;
    height: 24px;
    background-color: rgba(124, 93, 250, 0.1);
    
    &:hover {
        background-color: rgba(124, 93, 250, 0.2);
    }
`;

const ClientDropdown = styled.ul`
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 100%;
    background-color: #1E2139;
    border-radius: 6px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
    z-index: 100;
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #252945;
`;

const ClientOption = styled.li`
    &:not(:last-child) {
        border-bottom: 1px solid #252945;
    }
`;

const LabelWithClear = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

const LabelText = styled.span`
    display: flex;
    align-items: center;
`;

const QuotationFormContent = ({ isEdited }) => {
    const { colors } = useTheme();
    const {
        quotation,
        quotationState,
        handleQuotationChange,
        addQuotationItem,
        removeQuotationItem,
        items,
        windowWidth,
        clientState,
        setItems,
        addNewItem,
        removeItemAtIndex,
        handleQuotationSubmit,
        toggleQuotationModal,
        toggleForm,
        dispatch
    } = useGlobalContext();
    
    const [isDropdownExpanded, setIsDropdownExpanded] = useState(false);
    const [isClientDropdownExpanded, setIsClientDropdownExpanded] = useState(false);
    const [clientSearchQuery, setClientSearchQuery] = useState('');
    const [filteredClients, setFilteredClients] = useState([]);
    const selectRef = useRef();
    const clientSelectRef = useRef();
    const isDesktop = windowWidth >= 768;
    
    const errors = quotationState?.errors?.fields || {};
    const errorMessages = quotationState?.errors?.messages || [];
    
    // Initialize local items state
    const [localItems, setLocalItems] = useState([]);
    
    // Add refs for form fields to enable auto-scrolling
    const clientNameRef = useRef(null);
    const descriptionRef = useRef(null);
    const termsRef = useRef(null);
    const itemRefs = useRef([]);

    // Initialize items when component mounts or quotation changes
    useEffect(() => {
        if (quotation?.items && quotation.items.length > 0) {
            // Only update if the items are different
            if (JSON.stringify(quotation.items) !== JSON.stringify(localItems)) {
                setLocalItems(quotation.items);
            }
        }
    }, [quotation?.items]); // Only depend on quotation.items

    // Sync changes from global state to local state
    useEffect(() => {
        if (items && items.length > 0) {
            // Only update if the items are different
            if (JSON.stringify(items) !== JSON.stringify(localItems)) {
                setLocalItems(items);
            }
        }
    }, [items]);

    // Filter clients based on search query
    useEffect(() => {
        if (clientSearchQuery.trim() === '') {
            setFilteredClients([]);
            return;
        }
        
        const query = clientSearchQuery.toLowerCase().trim();
        const filtered = clientState.clients.filter(client => 
            client.companyName.toLowerCase().includes(query)
        );
        
        setFilteredClients(filtered);
    }, [clientSearchQuery, clientState.clients]);

    // Sync local items with global state
    useEffect(() => {
        if (localItems.length > 0 && typeof setItems === 'function') {
            const processedItems = localItems.map(item => ({
                name: item.name || '',
                description: item.description || '',
                quantity: parseFloat(item.quantity) || 0,
                price: parseFloat(item.price) || 0,
                total: parseFloat(item.total) || 0,
                vat: parseFloat(item.vat) || 0
            }));
            
            // Only update if the processed items are different from the current items
            if (JSON.stringify(processedItems) !== JSON.stringify(items)) {
                setItems(processedItems);
            }
        }
    }, [localItems]); // Only depend on localItems

    // Close select dropdown when clicking outside
    useEffect(() => {
        let isMounted = true;
        
        const checkIfClickedOutside = (event) => {
            if (!isMounted) return;
            
            const target = event.target;
            if (isDropdownExpanded && selectRef.current && !selectRef.current.contains(target)) {
                setIsDropdownExpanded(false);
            }
            if (isClientDropdownExpanded && clientSelectRef.current && !clientSelectRef.current.contains(target)) {
                setIsClientDropdownExpanded(false);
            }
        };
        
        document.addEventListener('click', checkIfClickedOutside);

        return () => {
            isMounted = false;
            document.removeEventListener('click', checkIfClickedOutside);
        };
    }, [isDropdownExpanded, isClientDropdownExpanded]);
    
    const toggleDropdown = () => {
        setIsDropdownExpanded(!isDropdownExpanded);
    };
    
    const toggleClientDropdown = () => {
        setIsClientDropdownExpanded(!isClientDropdownExpanded);
        if (!isClientDropdownExpanded) {
            setClientSearchQuery('');
            setFilteredClients([]);
        }
    };
    
    const handleClientSearchChange = (e) => {
        setClientSearchQuery(e.target.value);
        setIsClientDropdownExpanded(true);
    };
    
    const handleSelectOption = (event) => {
        handleQuotationChange(event, 'quotation');
        setIsDropdownExpanded(false);
    };
    
    // Add state to track if client is from UAE
    const [isUAEClient, setIsUAEClient] = useState(false);

    // Add useEffect to check client country
    useEffect(() => {
        const isUAE = quotation?.clientAddress?.country?.toLowerCase().includes('emirates') || 
                     quotation?.clientAddress?.country?.toLowerCase().includes('uae');
        setIsUAEClient(isUAE);
    }, [quotation?.clientAddress?.country]);

    // Update the handleSelectClient function
    const handleSelectClient = (client) => {
        // Reset dropdowns
        setIsClientDropdownExpanded(false);
        setClientSearchQuery('');

        // Validate required fields
        if (!client.companyName || !client.email || !client.phone || !client.address) {
            // Show error message or handle missing required fields
            console.error('Selected client is missing required information');
            return;
        }

        // Update client name
        handleQuotationChange({
            target: {
                name: 'clientName',
                value: client.companyName
            }
        }, 'quotation');
        
        // Update client email
        handleQuotationChange({
            target: {
                name: 'clientEmail',
                value: client.email
            }
        }, 'quotation');
        
        // Update client address fields
        handleQuotationChange({
            target: { 
                name: 'clientAddress', 
                value: {
                    street: client.address || '',
                    city: '',
                    postCode: '',
                    country: client.country || ''
                }
            }
        }, 'quotation');
        
        // Set client ID
        handleQuotationChange({
            target: { name: 'clientId', value: client.id }
        }, 'quotation');
        
        // Check if client is from UAE
        const isUAE = client.country?.toLowerCase().includes('emirates') || 
                      client.country?.toLowerCase().includes('uae');
        setIsUAEClient(isUAE);
        
        // Set currency based on country
        const currency = getCurrencySymbol(client.country);
        if (currency) {
            handleQuotationChange({
                target: { name: 'currency', value: currency }
            }, 'quotation');
        }
    };

    // Add a helper function to check if the client name is being properly set
    const hasClientDetails = () => {
        return Boolean(quotation?.clientName);
    };

    // Update the handleItemChange function
    const handleItemChange = (event, type, date, index) => {
        if (type === 'items') {
            const name = event.target.name;
            const value = event.target.value;
            
            // Update the item in the local state
            setLocalItems(prevItems => {
                const updatedItems = [...prevItems];
                
                // Handle different fields
                let processedValue = value;
                
                if (name === 'quantity') {
                    // For quantity, only allow whole numbers
                    processedValue = value.replace(/[^\d]/g, '');
                } else if (name === 'price') {
                    // For price, allow decimal numbers
                    // Only update if empty or matches valid decimal pattern
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        processedValue = value;
                    } else {
                        return prevItems; // Return without updating if invalid
                    }
                }
                
                updatedItems[index] = {
                    ...updatedItems[index],
                    [name]: processedValue
                };
                
                // Update total and VAT if quantity or price changes
                if (name === 'quantity' || name === 'price') {
                    const quantity = parseFloat(updatedItems[index].quantity) || 0;
                    const price = parseFloat(updatedItems[index].price) || 0;
                    
                    // Ensure we're working with valid numbers
                    if (!isNaN(quantity) && !isNaN(price)) {
                        const subtotal = Number((quantity * price).toFixed(2));
                        
                        // Calculate VAT for UAE clients
                        const vat = isUAEClient ? Number((subtotal * 0.05).toFixed(2)) : 0;
                        updatedItems[index].vat = vat;
                        updatedItems[index].total = Number((subtotal + vat).toFixed(2));
                    } else {
                        // If invalid numbers, set to 0
                        updatedItems[index].vat = 0;
                        updatedItems[index].total = 0;
                    }
                }
                
                return updatedItems;
            });
        } else {
            // For all other types, pass through to the original handler
            handleQuotationChange(event, type, date, index);
        }
    };

    // Add back the findSelectedClient function that was accidentally removed
    const findSelectedClient = () => {
        if (!quotation?.clientName || !clientState?.clients) return null;
        return clientState.clients.find(c => c.companyName === quotation.clientName);
    };

    // Add a function to get the current client's currency symbol
    const getClientCurrency = () => {
        const country = quotation?.clientAddress?.country || '';
        return getCurrencySymbol(country);
    };

    // Add useEffect to set default terms and conditions when component mounts
    useEffect(() => {
        let isMounted = true;
        
        if (!quotation.termsAndConditions && isMounted) {
            console.log('Setting default terms and conditions');
            handleQuotationChange({
                target: {
                    name: 'termsAndConditions',
                    value: DEFAULT_TERMS_AND_CONDITIONS
                }
            }, 'quotation');
        }
        
        return () => {
            isMounted = false;
        };
    }, []); // Empty dependency array means this runs once when component mounts

    // Add keyboard handling for mobile
    useEffect(() => {
        const handleResize = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, []);

    // Add a function to scroll to the first invalid field
    const scrollToFirstError = () => {
        // Check client name field
        if (errors.clientName && clientNameRef.current) {
            clientNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        
        // Check description field
        if (errors.description && descriptionRef.current) {
            descriptionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        
        // Check terms field
        if (errors.termsAndConditions && termsRef.current) {
            termsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        
        // Check items
        if (errors.items) {
            // Find the first item with an error
            for (let i = 0; i < itemRefs.current.length; i++) {
                if (errors.items[i] && itemRefs.current[i]) {
                    itemRefs.current[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return;
                }
            }
        }
    };
    
    // Add effect to scroll to first error when validation errors occur
    useEffect(() => {
        if (errorMessages.length > 0) {
            scrollToFirstError();
        }
    }, [errorMessages]);

    return (
        <FormContainer>
            <Title>
                {isEdited ? 'Edit Quotation' : 'New Quotation'}
                <QuotationSubmitController />
            </Title>

            <StyledForm id="quotation-form" noValidate>
                <FormSection>
                    <Legend>Bill To</Legend>
                    <InputWrapper>
                        <Label htmlFor="clientSelect" data-error={errors?.clientName}>
                            <LabelWithClear>
                                <LabelText>
                                    Client
                                </LabelText>
                            </LabelWithClear>
                        </Label>
                        <SelectWrapper ref={clientSelectRef}>
                            {hasClientDetails() ? (
                                <div style={{ position: 'relative', width: '100%' }}>
                                    <SelectButton
                                        type="button"
                                        aria-label="Select client"
                                        aria-expanded={isClientDropdownExpanded}
                                        aria-controls="client-select-list"
                                        onClick={toggleClientDropdown}
                                        ref={clientNameRef}
                                        data-error={errors?.clientName}
                                    >
                                        {quotation.clientName}
                                    </SelectButton>
                                    <ClearButton 
                                        type="button" 
                                        onClick={() => {
                                            // Reset client name
                                            handleQuotationChange({
                                                target: {
                                                    name: 'clientName',
                                                    value: ''
                                                }
                                            }, 'quotation');
                                            
                                            // Reset client email
                                            handleQuotationChange({
                                                target: {
                                                    name: 'clientEmail',
                                                    value: ''
                                                }
                                            }, 'quotation');
                                            
                                            // Reset client address
                                            handleQuotationChange({
                                                target: { 
                                                    name: 'clientAddress', 
                                                    value: {
                                                        street: '',
                                                        city: '',
                                                        postCode: '',
                                                        country: ''
                                                    }
                                                }
                                            }, 'quotation');
                                            
                                            // Reset currency
                                            handleQuotationChange({
                                                target: { name: 'currency', value: '$' }
                                            }, 'quotation');
                                            
                                            // Reset UAE client flag
                                            setIsUAEClient(false);
                                        }}
                                        aria-label="Clear client selection"
                                    >
                                        <Icon name="close" size={12} color="#7C5DFA" />
                                    </ClearButton>
                                </div>
                            ) : (
                                <AutocompleteInput
                                    type="text"
                                    placeholder="Search for a client..."
                                    value={clientSearchQuery}
                                    onChange={handleClientSearchChange}
                                    onFocus={() => setIsClientDropdownExpanded(true)}
                                    aria-label="Search for a client"
                                    ref={clientNameRef}
                                    data-error={errors?.clientName}
                                />
                            )}
                            <NewClientButton
                                type="button"
                                onClick={toggleForm}
                                aria-label="Add new client"
                            >
                                <Icon name="plus" size={12} color="#7C5DFA" />
                            </NewClientButton>
                            <AnimatePresence>
                                {isClientDropdownExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <DropdownList id="client-select-list">
                                            {(hasClientDetails() ? clientState.clients : filteredClients).map((client) => (
                                                <DropdownItem key={client.id}>
                                                    <DropdownOption
                                                        type="button"
                                                        onClick={() => handleSelectClient(client)}
                                                    >
                                                        {client.companyName}
                                                    </DropdownOption>
                                                </DropdownItem>
                                            ))}
                                            {!hasClientDetails() && filteredClients.length === 0 && clientSearchQuery.trim() !== '' && (
                                                <DropdownItem>
                                                    <DropdownOption disabled>
                                                        No clients found
                                                    </DropdownOption>
                                                </DropdownItem>
                                            )}
                                        </DropdownList>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </SelectWrapper>
                    </InputWrapper>

                    <ClientCard $empty={!hasClientDetails()}>
                        {hasClientDetails() ? (
                            <ClientInfoGrid>
                                {quotation.clientEmail && (
                                    <ClientInfoItem>
                                        <InfoIcon>
                                            <Icon name="invoice" size={12} color={colors.textSecondary} />
                                        </InfoIcon>
                                        <InfoValue>{quotation.clientEmail}</InfoValue>
                                    </ClientInfoItem>
                                )}
                                
                                {findSelectedClient()?.phone && (
                                    <ClientInfoItem>
                                        <InfoIcon>
                                            <Icon name="settings" size={12} color={colors.textSecondary} />
                                        </InfoIcon>
                                        <InfoValue>{findSelectedClient().phone}</InfoValue>
                                    </ClientInfoItem>
                                )}
                                
                                {findSelectedClient()?.address && (
                                    <ClientInfoItem>
                                        <InfoIcon>
                                            <Icon name="delivery" size={12} color={colors.textSecondary} />
                                        </InfoIcon>
                                        <InfoValue>{findSelectedClient().address}</InfoValue>
                                    </ClientInfoItem>
                                )}
                                
                                {findSelectedClient()?.country && (
                                    <ClientInfoItem>
                                        <InfoIcon>
                                            <Icon name="map" size={12} color={colors.textSecondary} />
                                        </InfoIcon>
                                        <InfoValue>{findSelectedClient().country}</InfoValue>
                                    </ClientInfoItem>
                                )}
                                
                                {findSelectedClient()?.trnNumber && (
                                    <ClientInfoItem>
                                        <InfoIcon>
                                            <Icon name="receipt" size={12} color={colors.textSecondary} />
                                        </InfoIcon>
                                        <InfoValue>TRN: {findSelectedClient().trnNumber}</InfoValue>
                                    </ClientInfoItem>
                                )}
                            </ClientInfoGrid>
                        ) : (
                            <p>Select a client to display their details</p>
                        )}
                    </ClientCard>
                </FormSection>

                <FormSection>
                    <Legend>Project Details</Legend>
                    <InputWrapper>
                        <Label htmlFor="description" data-error={errors?.description}>
                            Project Description
                        </Label>
                        <Input
                            type="text"
                            id="description"
                            name="description"
                            value={quotation.description || ''}
                            onChange={(e) => handleQuotationChange(e, 'quotation')}
                            placeholder="e.g. Website Redesign Service"
                            data-error={errors?.description}
                            ref={descriptionRef}
                        />
                    </InputWrapper>
                </FormSection>

                <FormSection>
                    <Legend>Item List</Legend>
                    
                    {/* Add items header for desktop */}
                    <ItemsHeader>
                        <span>Item Name</span>
                        <span>Qty.</span>
                        <span>Price</span>
                        <span>VAT</span>
                        <span>Total</span>
                    </ItemsHeader>
                    
                    {localItems.map((item, index) => (
                        <ItemCard key={index} ref={el => itemRefs.current[index] = el}>
                            <ItemGrid>
                                <div>
                                    <MinimalLabel
                                        htmlFor={`item-name-${index}`}
                                        data-error={errors.items && errors.items[index]?.name}
                                    >
                                        Item Name
                                    </MinimalLabel>
                                    <MinimalInput
                                        id={`item-name-${index}`}
                                        type="text"
                                        name="name"
                                        value={item.name || ''}
                                        placeholder="Item name"
                                        data-error={errors.items && errors.items[index]?.name}
                                        onChange={(event) => handleItemChange(event, 'items', null, index)}
                                    />
                                    
                                    <MinimalLabel
                                        htmlFor={`item-description-${index}`}
                                        style={{ marginTop: '8px' }}
                                    >
                                        Description
                                    </MinimalLabel>
                                    <DescriptionInput
                                        id={`item-description-${index}`}
                                        name="description"
                                        value={item.description || ''}
                                        placeholder="Item description..."
                                        onChange={(event) => handleItemChange(event, 'items', null, index)}
                                    />
                                </div>
                                
                                <div>
                                    <MinimalLabel htmlFor={`item-quantity-${index}`}>
                                        Qty.
                                    </MinimalLabel>
                                    <MinimalInput
                                        id={`item-quantity-${index}`}
                                        type="number"
                                        inputMode="numeric"
                                        min="0"
                                        name="quantity"
                                        value={item.quantity || ''}
                                        style={{
                                            fontSize: '16px',
                                            WebkitAppearance: 'none',
                                            appearance: 'none',
                                            touchAction: 'manipulation'
                                        }}
                                        onChange={(event) => handleItemChange(event, 'items', null, index)}
                                    />
                                </div>
                                
                                <div>
                                    <MinimalLabel htmlFor={`item-price-${index}`}>
                                        Price ({quotation.currency || 'USD'})
                                    </MinimalLabel>
                                    <input
                                        id={`item-price-${index}`}
                                        type="number"
                                        inputMode="decimal"
                                        step="0.01"
                                        min="0"
                                        name="price"
                                        value={item.price || ''}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            backgroundColor: '#252945',
                                            color: '#FFFFFF',
                                            border: '1px solid #252945',
                                            borderRadius: '4px',
                                            fontSize: '16px',
                                            WebkitAppearance: 'none',
                                            appearance: 'none',
                                            touchAction: 'manipulation'
                                        }}
                                        onChange={(event) => {
                                            handleItemChange({
                                                target: {
                                                    name: 'price',
                                                    value: event.target.value
                                                }
                                            }, 'items', null, index);
                                        }}
                                        onBlur={(event) => {
                                            const value = event.target.value;
                                            if (value && !isNaN(parseFloat(value))) {
                                                const formattedValue = parseFloat(value).toFixed(2);
                                                handleItemChange({
                                                    target: {
                                                        name: 'price',
                                                        value: formattedValue
                                                    }
                                                }, 'items', null, index);
                                            }
                                        }}
                                    />
                                </div>
                                
                                <div>
                                    <MinimalLabel>VAT (5%)</MinimalLabel>
                                    <VatValue>
                                        <span className="currency">{quotation.currency || 'USD'}</span>
                                        {formatNumber(item.vat)}
                                    </VatValue>
                                </div>
                                
                                <div>
                                    <MinimalLabel>Total</MinimalLabel>
                                    <TotalValue>
                                        <span className="currency">{quotation.currency || 'USD'}</span>
                                        {formatNumber(item.total)}
                                    </TotalValue>
                                </div>
                            </ItemGrid>
                            
                            <DeleteButton
                                type="button"
                                onClick={() => removeItemAtIndex(index)}
                                aria-label={`Delete item ${index + 1}`}
                            >
                                <Icon name="delete" size={16} />
                            </DeleteButton>
                        </ItemCard>
                    ))}

                    <AddItemButton
                        type="button"
                        onClick={addNewItem}
                    >
                        <Icon name="plus" size={16} />
                        Add New Item
                    </AddItemButton>

                    {/* Add summary section for desktop */}
                    {localItems.length > 0 && (
                        <ItemsSummary>
                            <div className="summary-content">
                                <div className="summary-row">
                                    <span className="label">Subtotal:</span>
                                    <span className="value">
                                        <span className="currency">{quotation.currency || 'USD'}</span>
                                        {formatNumber(
                                            localItems.reduce((sum, item) => {
                                                const quantity = parseFloat(item.quantity) || 0;
                                                const price = parseFloat(item.price) || 0;
                                                return sum + (quantity * price);
                                            }, 0)
                                        )}
                                    </span>
                                </div>
                                {isUAEClient && (
                                    <div className="summary-row">
                                        <span className="label">VAT (5%):</span>
                                        <span className="value">
                                            <span className="currency">{quotation.currency || 'USD'}</span>
                                            {formatNumber(
                                                localItems.reduce((sum, item) => sum + (parseFloat(item.vat) || 0), 0)
                                            )}
                                        </span>
                                    </div>
                                )}
                                <div className="summary-row">
                                    <span className="label">Total:</span>
                                    <span className="value">
                                        <span className="currency">{quotation.currency || 'USD'}</span>
                                        {formatNumber(
                                            localItems.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0)
                                        )}
                                    </span>
                                </div>
                            </div>
                        </ItemsSummary>
                    )}
                </FormSection>

                <FormSection>
                    <Legend>Terms & Conditions</Legend>
                    <InputWrapper>
                        <Label htmlFor="termsAndConditions" data-error={errors?.termsAndConditions}>
                            Terms & Conditions
                        </Label>
                        <TextArea
                            id="termsAndConditions"
                            name="termsAndConditions"
                            value={quotation.termsAndConditions || ''}
                            onChange={(e) => handleQuotationChange(e, 'quotation')}
                            placeholder="Enter terms and conditions..."
                            data-error={errors?.termsAndConditions}
                            ref={termsRef}
                        />
                    </InputWrapper>
                </FormSection>

                {errorMessages.length > 0 && (
                    <ErrorsWrapper>
                        {errorMessages.map((error, index) => (
                            <Error key={index}>{error}</Error>
                        ))}
                    </ErrorsWrapper>
                )}
            </StyledForm>

            <KeyboardSpacer />
        </FormContainer>
    );
};

export default QuotationFormContent; 