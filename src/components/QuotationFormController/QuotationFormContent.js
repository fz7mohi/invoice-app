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

const ClientInfo = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 6px;
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    font-size: 12px;
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

// Add this currency utility function before the QuotationFormContent component
const getCurrencySymbol = (country) => {
    if (!country) return '';
    
    const countryLower = country.toLowerCase();
    if (countryLower.includes('emirates') || countryLower.includes('uae') || countryLower.includes('united arab')) {
        return 'AED';
    } else if (countryLower.includes('qatar')) {
        return 'QAR';
    } else if (countryLower.includes('saudi') || countryLower.includes('ksa')) {
        return 'SAR';
    }
    return '';
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
        dispatch
    } = useGlobalContext();
    
    const [isDropdownExpanded, setIsDropdownExpanded] = useState(false);
    const [isClientDropdownExpanded, setIsClientDropdownExpanded] = useState(false);
    const [isCurrencyDropdownExpanded, setIsCurrencyDropdownExpanded] = useState(false);
    const selectRef = useRef();
    const clientSelectRef = useRef();
    const currencySelectRef = useRef();
    const isDesktop = windowWidth >= 768;
    
    const errors = quotationState?.errors?.fields || {};
    const errorMessages = quotationState?.errors?.messages || [];
    
    // Initialize local items state
    const [localItems, setLocalItems] = useState([]);

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
    }, [items]); // Only depend on items

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
            if (isCurrencyDropdownExpanded && currencySelectRef.current && !currencySelectRef.current.contains(target)) {
                setIsCurrencyDropdownExpanded(false);
            }
        };
        
        document.addEventListener('click', checkIfClickedOutside);

        return () => {
            isMounted = false;
            document.removeEventListener('click', checkIfClickedOutside);
        };
    }, [isDropdownExpanded, isClientDropdownExpanded, isCurrencyDropdownExpanded]);
    
    const toggleDropdown = () => {
        setIsDropdownExpanded(!isDropdownExpanded);
    };
    
    const toggleClientDropdown = () => {
        setIsClientDropdownExpanded(!isClientDropdownExpanded);
    };
    
    const toggleCurrencyDropdown = () => {
        setIsCurrencyDropdownExpanded(!isCurrencyDropdownExpanded);
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
        
        // Initialize clientAddress object with empty values
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
        
        // Update client address fields
        if (client.address) {
            // Set the address in the clientAddress object
            handleQuotationChange({
                target: { name: 'street', value: client.address }
            }, 'clientAddress');
        }
        
        // Set country
        if (client.country) {
            handleQuotationChange({
                target: { name: 'country', value: client.country }
            }, 'clientAddress');
            
            // Check if client is from UAE
            const isUAE = client.country.toLowerCase().includes('emirates') || 
                         client.country.toLowerCase().includes('uae');
            setIsUAEClient(isUAE);
            
            // Set currency based on country
            const currency = getCurrencySymbol(client.country);
            if (currency) {
                handleQuotationChange({
                    target: { name: 'currency', value: currency }
                }, 'quotation');
            }
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
                // Allow only numbers for quantity and price
                const processedValue = 
                    (name === 'quantity' || name === 'price') 
                    ? allowOnlyNumbers(value) 
                    : value;
                    
                updatedItems[index] = {
                    ...updatedItems[index],
                    [name]: processedValue
                };
                
                // Update total and VAT if quantity or price changes
                if (name === 'quantity' || name === 'price') {
                    const quantity = parseFloat(updatedItems[index].quantity) || 0;
                    const price = parseFloat(updatedItems[index].price) || 0;
                    const subtotal = quantity * price;
                    
                    // Calculate VAT for UAE clients
                    const vat = isUAEClient ? subtotal * 0.05 : 0;
                    updatedItems[index].vat = vat;
                    updatedItems[index].total = subtotal + vat;
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

    return (
        <FormContainer>
            {!isEdited && <Title>New Quotation</Title>}
            {isEdited && (
                <Title>
                    Edit <Hashtag>#</Hashtag>
                    {quotation.id}
                </Title>
            )}
            <QuotationForm
                id="quotation-form"
                noValidate
            >
                {/* Bill To Section */}
                <Fieldset>
                    <Legend>Bill to</Legend>
                    <InputWrapper>
                        <Label htmlFor="clientSelect" $error={errors?.clientName}>
                            Client
                            {errors?.clientName && (
                                <Error>can't be empty</Error>
                            )}
                        </Label>
                        <SelectWrapper>
                            <SelectButton
                                type="button"
                                aria-label="Select client"
                                aria-expanded={isClientDropdownExpanded}
                                aria-controls="client-select-list"
                                onClick={toggleClientDropdown}
                            >
                                {hasClientDetails() ? (
                                    <>{quotation.clientName}</>
                                ) : (
                                    'Select a client'
                                )}
                                <Icon name={'arrow-down'} size={12} color={colors.purple} />
                            </SelectButton>
                            {isClientDropdownExpanded && (
                                <DropdownList id="client-select-list" ref={clientSelectRef}>
                                    {clientState.clients.length === 0 ? (
                                        <DropdownItem>
                                            <DropdownOption disabled>No clients found</DropdownOption>
                                        </DropdownItem>
                                    ) : (
                                        clientState.clients.map((client) => (
                                            <DropdownItem key={client.id}>
                                                <DropdownOption
                                                    type="button"
                                                    onClick={() => handleSelectClient(client)}
                                                >
                                                    {client.companyName}
                                                </DropdownOption>
                                            </DropdownItem>
                                        ))
                                    )}
                                </DropdownList>
                            )}
                        </SelectWrapper>
                    </InputWrapper>
                    
                    {/* Client Details Card */}
                    {hasClientDetails() ? (
                        <ClientDetailsCard>
                            <CardTitle>Client Information</CardTitle>
                            <ClientInfo>
                                {quotation.clientEmail && (
                                    <InfoItem>
                                        <InfoIcon>
                                            <Icon name="invoice" size={12} color={colors.textSecondary} />
                                        </InfoIcon>
                                        <InfoValue>{quotation.clientEmail}</InfoValue>
                                    </InfoItem>
                                )}
                                
                                {findSelectedClient()?.phone && (
                                    <InfoItem>
                                        <InfoIcon>
                                            <Icon name="settings" size={12} color={colors.textSecondary} />
                                        </InfoIcon>
                                        <InfoValue>{findSelectedClient().phone}</InfoValue>
                                    </InfoItem>
                                )}
                                
                                {findSelectedClient()?.address && (
                                    <InfoItem>
                                        <InfoIcon>
                                            <Icon name="delivery" size={12} color={colors.textSecondary} />
                                        </InfoIcon>
                                        <InfoValue>{findSelectedClient().address}</InfoValue>
                                    </InfoItem>
                                )}
                                
                                {findSelectedClient()?.country && (
                                    <InfoItem>
                                        <InfoIcon>
                                            <Icon name="map" size={12} color={colors.textSecondary} />
                                        </InfoIcon>
                                        <InfoValue>{findSelectedClient().country}</InfoValue>
                                    </InfoItem>
                                )}
                                
                                {findSelectedClient()?.trnNumber && (
                                    <InfoItem>
                                        <InfoIcon>
                                            <Icon name="receipt" size={12} color={colors.textSecondary} />
                                        </InfoIcon>
                                        <InfoValue>TRN: {findSelectedClient().trnNumber}</InfoValue>
                                    </InfoItem>
                                )}
                            </ClientInfo>
                        </ClientDetailsCard>
                    ) : (
                        <ClientDetailsCard $empty>
                            Select a client to display their details
                        </ClientDetailsCard>
                    )}
                    
                    <InputWrapper>
                        <Label
                            htmlFor="termsAndConditions"
                            $error={errors?.termsAndConditions}
                        >
                            Terms and Conditions
                            {errors?.termsAndConditions && (
                                <Error>can't be empty</Error>
                            )}
                        </Label>
                        <TextArea
                            id="terms-and-conditions"
                            name="termsAndConditions"
                            placeholder="Enter terms and conditions"
                            value={quotation.termsAndConditions || DEFAULT_TERMS_AND_CONDITIONS}
                            $error={errors?.termsAndConditions}
                            onChange={(event) => handleQuotationChange(event, 'quotation')}
                            required
                        />
                    </InputWrapper>

                    {/* Add a currency selector component after the Terms and Conditions field */}
                    <InputWrapper>
                        <Label htmlFor="currency">Currency</Label>
                        <SelectWrapper>
                            <SelectButton
                                type="button"
                                aria-label="Select currency"
                                aria-expanded={isCurrencyDropdownExpanded}
                                aria-controls="currency-select-list"
                                onClick={toggleCurrencyDropdown}
                            >
                                {quotation.currency || 'USD'}
                                <Icon name={'arrow-down'} size={12} color={colors.purple} />
                            </SelectButton>
                            {isCurrencyDropdownExpanded && (
                                <DropdownList id="currency-select-list" ref={currencySelectRef}>
                                    <DropdownItem>
                                        <DropdownOption
                                            type="button"
                                            onClick={() => {
                                                handleQuotationChange({
                                                    target: { name: 'currency', value: 'USD' }
                                                }, 'quotation');
                                                setIsCurrencyDropdownExpanded(false);
                                            }}
                                        >
                                            USD
                                        </DropdownOption>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <DropdownOption
                                            type="button"
                                            onClick={() => {
                                                handleQuotationChange({
                                                    target: { name: 'currency', value: 'AED' }
                                                }, 'quotation');
                                                setIsCurrencyDropdownExpanded(false);
                                            }}
                                        >
                                            AED
                                        </DropdownOption>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <DropdownOption
                                            type="button"
                                            onClick={() => {
                                                handleQuotationChange({
                                                    target: { name: 'currency', value: 'EUR' }
                                                }, 'quotation');
                                                setIsCurrencyDropdownExpanded(false);
                                            }}
                                        >
                                            EUR
                                        </DropdownOption>
                                    </DropdownItem>
                                </DropdownList>
                            )}
                        </SelectWrapper>
                    </InputWrapper>
                </Fieldset>
                
                {/* Invoice Date and Terms Section */}
                <Fieldset>
                    <InputsGroup $fullWidthMobile>
                        <InputWrapper>
                            <Label>Quotation Date</Label>
                            <ReactDatePicker
                                selected={new Date(quotation.createdAt)}
                                onChange={(date) => handleQuotationChange(false, 'date', date)}
                                minDate={new Date()}
                                customInput={<CustomInput isDisabled={isEdited} />}
                            />
                        </InputWrapper>
                        <InputWrapper>
                            <Label>Payment Terms</Label>
                            <SelectWrapper>
                                <SelectButton
                                    type="button"
                                    aria-label="Select payment terms"
                                    aria-expanded={isDropdownExpanded}
                                    aria-controls="select-list"
                                    onClick={toggleDropdown}
                                >
                                    Net {quotation.paymentTerms} Days
                                    <Icon name={'arrow-down'} size={12} color={colors.purple} />
                                </SelectButton>
                                {isDropdownExpanded && (
                                    <DropdownList id="select-list" ref={selectRef}>
                                        <DropdownItem>
                                            <DropdownOption
                                                type="button"
                                                onClick={() => handleQuotationChange({
                                                    target: { name: 'paymentTerms', value: '1' }
                                                }, 'quotation')}
                                            >
                                                Net 1 Day
                                            </DropdownOption>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <DropdownOption
                                                type="button"
                                                onClick={() => handleQuotationChange({
                                                    target: { name: 'paymentTerms', value: '7' }
                                                }, 'quotation')}
                                            >
                                                Net 7 Days
                                            </DropdownOption>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <DropdownOption
                                                type="button"
                                                onClick={() => handleQuotationChange({
                                                    target: { name: 'paymentTerms', value: '14' }
                                                }, 'quotation')}
                                            >
                                                Net 14 Days
                                            </DropdownOption>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <DropdownOption
                                                type="button"
                                                onClick={() => handleQuotationChange({
                                                    target: { name: 'paymentTerms', value: '30' }
                                                }, 'quotation')}
                                            >
                                                Net 30 Days
                                            </DropdownOption>
                                        </DropdownItem>
                                    </DropdownList>
                                )}
                            </SelectWrapper>
                        </InputWrapper>
                    </InputsGroup>
                    <InputWrapper>
                        <Label htmlFor="description" $error={errors?.description}>
                            Project Description
                            {errors?.description && <Error>can't be empty</Error>}
                        </Label>
                        <Input
                            type="text"
                            name="description"
                            placeholder="e.g. Graphic Design Service"
                            value={quotation.description || ''}
                            $error={errors?.description}
                            onChange={(event) => handleQuotationChange(event, 'quotation')}
                        />
                    </InputWrapper>
                </Fieldset>
                
                {/* Item List Section */}
                <Fieldset>
                    <Legend $lg>Item List</Legend>
                    <Wrapper>
                        {localItems.map((item, index) => (
                            <ItemInputsGroup key={index} id={`item-${index}`}>
                                <ItemName>
                                    <MinimalLabel
                                        htmlFor={`item-name-${index}`}
                                        $error={errors.items && errors.items[index]?.name}
                                    >
                                        Item Name
                                        {errors.items && errors.items[index]?.name && (
                                            <Error>can't be empty</Error>
                                        )}
                                    </MinimalLabel>
                                    <MinimalInput
                                        id={`item-name-${index}`}
                                        type="text"
                                        name="name"
                                        value={item.name || ''}
                                        $error={errors.items && errors.items[index]?.name}
                                        onChange={(event) =>
                                            handleItemChange(
                                                event,
                                                'items',
                                                null,
                                                index
                                            )
                                        }
                                    />
                                </ItemName>
                                
                                <ItemDescription>
                                    <MinimalLabel
                                        htmlFor={`item-description-${index}`}
                                        $error={errors.items && errors.items[index]?.description}
                                    >
                                        Item Description
                                    </MinimalLabel>
                                    <DescriptionInput
                                        id={`item-description-${index}`}
                                        name="description"
                                        value={item.description || ''}
                                        placeholder="Description..."
                                        $error={errors.items && errors.items[index]?.description}
                                        onChange={(event) =>
                                            handleItemChange(
                                                event,
                                                'items',
                                                null,
                                                index
                                            )
                                        }
                                    />
                                </ItemDescription>
                                
                                <div className="qty-price-row">
                                    <ItemQty>
                                        <MinimalLabel
                                            htmlFor={`item-quantity-${index}`}
                                            $error={errors.items && errors.items[index]?.quantity}
                                        >
                                            Qty.
                                        </MinimalLabel>
                                        <MinimalInput
                                            id={`item-quantity-${index}`}
                                            type="text"
                                            name="quantity"
                                            value={item.quantity || ''}
                                            $error={errors.items && errors.items[index]?.quantity}
                                            onChange={(event) =>
                                                handleItemChange(
                                                    event,
                                                    'items',
                                                    null,
                                                    index
                                                )
                                            }
                                            $qty
                                        />
                                    </ItemQty>
                                    
                                    <ItemPrice>
                                        <MinimalLabel
                                            htmlFor={`item-price-${index}`}
                                            $error={errors.items && errors.items[index]?.price}
                                        >
                                            Price ({quotation.currency || 'USD'})
                                        </MinimalLabel>
                                        <MinimalInput
                                            id={`item-price-${index}`}
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            name="price"
                                            value={item.price || ''}
                                            $error={errors.items && errors.items[index]?.price}
                                            onChange={(event) =>
                                                handleItemChange(
                                                    event,
                                                    'items',
                                                    null,
                                                    index
                                                )
                                            }
                                        />
                                    </ItemPrice>
                                </div>
                                
                                <div className="vat-total-row">
                                    {isUAEClient && (
                                        <ItemVat>
                                            <MinimalLabel htmlFor={`item-vat-${index}`}>VAT (5%)</MinimalLabel>
                                            <VatValue>
                                                <span className="currency">{quotation.currency || 'USD'}</span>
                                                {formatNumber(item.vat)}
                                            </VatValue>
                                        </ItemVat>
                                    )}
                                    
                                    <ItemTotal>
                                        <MinimalLabel htmlFor={`item-total-${index}`}>Total</MinimalLabel>
                                        <TotalValue>
                                            <span className="currency">{quotation.currency || 'USD'}</span>
                                            {formatNumber(item.total)}
                                        </TotalValue>
                                    </ItemTotal>
                                </div>
                                
                                <ItemDelete
                                    type="button"
                                    onClick={() => {
                                        setLocalItems(prevItems => 
                                            prevItems.filter((_, i) => i !== index)
                                        );
                                    }}
                                >
                                    <Icon
                                        name="delete"
                                        size={14}
                                        color={colors.btnTheme}
                                    />
                                </ItemDelete>
                            </ItemInputsGroup>
                        ))}
                        <Button 
                            type="button" 
                            as={AddNewItemButton}
                            onClick={() => {
                                const newIndex = localItems.length;
                                setLocalItems(prevItems => [
                                    ...prevItems, 
                                    { 
                                        name: '', 
                                        description: '',
                                        quantity: 0, 
                                        price: 0, 
                                        vat: isUAEClient ? 0 : undefined,
                                        total: 0 
                                    }
                                ]);
                                // Add a small delay to ensure the new item is rendered
                                setTimeout(() => {
                                    const itemElement = document.getElementById(`item-${newIndex}`);
                                    if (itemElement) {
                                        itemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }
                                }, 100);
                            }}
                        >
                            + Add New Item
                        </Button>
                    </Wrapper>
                </Fieldset>
                
                {/* Error Messages */}
                {quotationState?.errors?.isError && errorMessages.length > 0 && (
                    <ErrorsWrapper>
                        {errorMessages.map((message, index) => (
                            <Error key={index}>{message}</Error>
                        ))}
                    </ErrorsWrapper>
                )}
            </QuotationForm>
        </FormContainer>
    );
};

export default QuotationFormContent; 