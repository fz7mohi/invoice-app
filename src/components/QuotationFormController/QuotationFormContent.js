import { useGlobalContext } from '../App/context';
import { useState, useRef, forwardRef, useEffect } from 'react';
import { useTheme } from 'styled-components';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dateToString from '../../utilities/dateToString';
import allowOnlyNumbers from '../../utilities/allowOnlyNumbers';
import Icon from '../shared/Icon/Icon';
import Button from '../shared/Button/Button';
import styled from 'styled-components';

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
    defaultInput
} from '../FormController/Form/FormStyles';

// Date Picker Custom Components
const CustomPicker = styled.button`
    width: 100%;
    padding: 16px 13px 16px 20px;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.colors.bgInputBorder};
    background-color: ${({ theme }) => theme.colors.bgInput};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 700;
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    &:focus {
        border: 1px solid ${({ theme }) => theme.colors.purple};
        outline: none;
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
const StyledSelect = styled.div`
    position: relative;
    width: 100%;
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

const List = styled.ul`
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.bgForm || theme.colors.formBackground || '#fff'};
    border-radius: 8px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
    z-index: 100;
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 300px;
    overflow-y: auto;
`;

const Item = styled.li`
    &:not(:last-child) {
        border-bottom: 1px solid ${({ theme }) => theme.colors.dropdownDivider || theme.colors.divider || '#eee'};
    }
`;

const Option = styled.button`
    width: 100%;
    padding: 16px 24px;
    text-align: left;
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 700;
    cursor: pointer;
    
    &:hover {
        color: ${({ theme }) => theme.colors.purple};
        background-color: ${({ theme }) => theme.colors.bgInputHover || 'rgba(126, 136, 195, 0.1)'};
    }
`;

// Item List Components
const Wrapper = styled.div`
    display: flex;
    flex-flow: column;
    gap: 16px;
    width: 100%;
    margin-right: 20px;
    
    @media (min-width: 768px) {
        gap: 20px;
        margin-right: 0;
    }
`;

const TotalValue = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 4px;
    border: none;
    background-color: transparent;
    color: ${({ theme }) => theme.colors.textTertiary};
    font-weight: 500;
    font-size: 13px;
    
    .currency {
        margin-right: 4px;
        font-size: 11px;
        color: ${({ theme }) => theme.colors.textSecondary};
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
    color: ${({ theme }) => theme.colors.btnTheme};
    align-self: center;
    
    &:hover {
        color: ${({ theme }) => theme.colors.red};
    }
`;

// Add TextArea component for Terms and Conditions
const TextArea = styled.textarea`
    ${defaultInput}
    min-height: 120px;
    resize: vertical;
    
    ${({ $error }) =>
        $error &&
        `border: 1px solid ${props => props.theme.colors.red};`}
    
    ${({ $valid }) =>
        $valid &&
        `border: 1px solid #33d69f;`}
`;

// Create a styled card component for client details
const ClientDetailsCard = styled.div`
    margin-top: 12px;
    padding: 16px;
    border-radius: 4px;
    background-color: ${({ theme }) => theme.colors.bgInput || '#f9fafe'};
    border: 1px solid ${({ theme }) => theme.colors.bgInputBorder};
    
    ${({ $empty, theme }) => $empty && `
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${theme.colors.textTertiary || '#7e88c3'};
        font-style: italic;
        min-height: 80px;
    `}
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
    gap: 12px;
    padding: 14px 12px;
    background-color: ${({ theme }) => theme.colors.bgInput || '#f9fafe'};
    border-radius: 6px;
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.bgInputBorder || '#DFE3FA'};
    
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
        gap: 10px;
        grid-area: qty-price;
    }
    
    .vat-total-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        grid-area: vat-total;
    }
    
    @media (min-width: 768px) {
        grid-template-columns: repeat(5, 1fr) auto;
        grid-template-areas:
            "name name name name name delete"
            "desc desc desc desc desc desc"
            "qty price vat total total total";
        align-items: flex-start;
        gap: 10px;
        padding: 16px 14px;
        
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
    color: ${({ theme }) => theme.colors.btnTheme};
    align-self: flex-start;
    justify-self: flex-end;
    
    @media (min-width: 768px) {
        grid-area: delete;
    }
    
    &:hover {
        color: ${({ theme }) => theme.colors.red};
    }
`;

// Update the VAT display value
const VatValue = styled(TotalValue)`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    font-weight: 400;
`;

// Add a custom styled form that extends StyledForm
const QuotationForm = styled(StyledForm)`
    width: 100%;
    padding-right: 20px; /* Add padding to prevent horizontal overflow */
    
    @media (min-width: 768px) {
        max-width: 100%;
    }
    
    @media (min-width: 1024px) {
        padding-right: 10px;
    }
`;

// Add the MinimalLabel styled component
const MinimalLabel = styled(Label)`
    font-size: 11px;
    font-weight: 500;
    margin-bottom: 4px;
`;

// Add the MinimalInput styled component
const MinimalInput = styled(Input)`
    padding: 10px;
    font-size: 12px;
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
        removeItemAtIndex
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
    
    // Add local state for items with useState
    const [localItems, setLocalItems] = useState(items || []);

    // Use useEffect to sync changes from global state to local state
    useEffect(() => {
        setLocalItems(items || []);
    }, [items]);

    // Use useEffect to sync changes from local state to global state
    useEffect(() => {
        if (JSON.stringify(localItems) !== JSON.stringify(items) && typeof setItems === 'function') {
            console.log('Syncing local items to global state:', localItems);
            console.log('Current global items:', items);
            console.log('Are they different?', localItems !== items);
            
            // Ensure items have proper numeric values for calculations
            const processedItems = localItems.map(item => ({
                ...item,
                quantity: parseFloat(item.quantity) || 0,
                price: parseFloat(item.price) || 0,
                total: parseFloat(item.total) || 0,
                vat: parseFloat(item.vat) || 0
            }));
            
            setItems(processedItems);
            console.log('Processed items sent to global state:', processedItems);
        }
    }, [localItems, items, setItems]);
    
    // Close select dropdown when clicking outside
    useEffect(() => {
        const checkIfClickedOutside = (event) => {
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
    
    const handleSelectClient = (client) => {
        // Reset dropdowns
        setIsClientDropdownExpanded(false);

        // Update client name
        const clientNameEvent = {
            target: {
                name: 'clientName',
                value: client.companyName
            }
        };
        handleQuotationChange(clientNameEvent, 'quotation');
        
        // Slight delay to ensure previous update completes
        setTimeout(() => {
            // Update client email
            if (client.email) {
                const emailEvent = {
                    target: {
                        name: 'clientEmail',
                        value: client.email
                    }
                };
                handleQuotationChange(emailEvent, 'quotation');
            }
            
            // Update client address fields
            if (client.address) {
                let street = client.address;
                let city = '';
                let postCode = '';
                
                if (client.address.includes('\n')) {
                    const addressLines = client.address.split('\n');
                    street = addressLines[0] || '';
                    const cityLine = addressLines[1] || '';
                    const cityParts = cityLine.split(',');
                    city = cityParts[0] ? cityParts[0].trim() : '';
                    postCode = cityParts[1] ? cityParts[1].trim() : '';
                }
                
                // Set street
                handleQuotationChange({
                    target: { name: 'street', value: street }
                }, 'clientAddress');
                
                // City
                if (city) {
                    handleQuotationChange({
                        target: { name: 'city', value: city }
                    }, 'clientAddress');
                } else {
                    handleQuotationChange({
                        target: { name: 'city', value: '' }
                    }, 'clientAddress');
                }
                
                // Always set post code, even if empty
                handleQuotationChange({
                    target: { name: 'postCode', value: postCode }
                }, 'clientAddress');
            }
            
            // Country
            if (client.country) {
                handleQuotationChange({
                    target: { name: 'country', value: client.country }
                }, 'clientAddress');
                
                // Set currency based on country
                const currency = getCurrencySymbol(client.country);
                if (currency) {
                    console.log('Setting quote currency to:', currency);
                    handleQuotationChange({
                        target: { name: 'currency', value: currency }
                    }, 'quotation');
                }
            } else {
                handleQuotationChange({
                    target: { name: 'country', value: '' }
                }, 'clientAddress');
            }
        }, 100);
    };

    // Add a helper function to check if the client name is being properly set
    const hasClientDetails = () => {
        return Boolean(quotation?.clientName);
    };

    // Update the handleItemChange function to handle description and calculate VAT
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
                    const vat = subtotal * 0.05; // 5% VAT
                    
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

    // Add a submission check that runs before the form is submitted
    const handleFormSubmit = (e) => {
        // This will log the current form state before it's submitted
        console.log('Form submission initiated');
        
        // Ensure terms and conditions is properly set in the quotation
        const termsValue = document.getElementById('terms-and-conditions')?.value;
        if (termsValue && !quotation.termsAndConditions) {
            console.log('Setting terms and conditions value:', termsValue);
            handleQuotationChange({
                target: {
                    name: 'termsAndConditions',
                    value: termsValue
                }
            }, 'quotation');
        }
        
        // Ensure currency is set
        if (!quotation.currency) {
            const clientCountry = quotation?.clientAddress?.country;
            const currency = clientCountry ? getCurrencySymbol(clientCountry) : 'USD';
            console.log('Setting currency value:', currency);
            handleQuotationChange({
                target: {
                    name: 'currency',
                    value: currency
                }
            }, 'quotation');
        }
        
        // Small delay to ensure state update
        setTimeout(() => {
            console.log('Updated quotation before submission:', quotation);
        }, 100);
        
        console.log('Current form data:', {
            quotation,
            localItems,
            hasTermsAndConditions: Boolean(quotation.termsAndConditions),
            hasDescription: Boolean(quotation.description),
            hasClientName: Boolean(quotation.clientName),
            itemsCount: localItems.length,
            currency: quotation.currency
        });

        // Don't prevent default - we still want the form to submit normally
    };

    return (
        <>
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
                autoComplete="off"
                onSubmit={handleFormSubmit}
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
                        <StyledSelect>
                            <Cta
                                type="button"
                                aria-label="Select client"
                                aria-expanded={isClientDropdownExpanded}
                                aria-controls="client-select-list"
                                onClick={toggleClientDropdown}
                                $isExpanded={isClientDropdownExpanded}
                            >
                                {hasClientDetails() ? (
                                    <>{quotation.clientName}</>
                                ) : (
                                    'Select a client'
                                )}
                                <Icon name={'arrow-down'} size={12} color={colors.purple} />
                            </Cta>
                            {isClientDropdownExpanded && (
                                <List id="client-select-list" ref={clientSelectRef}>
                                    {clientState.clients.length === 0 ? (
                                        <Item><Option>No clients found</Option></Item>
                                    ) : (
                                        clientState.clients.map((client) => (
                                            <Item key={client.id}>
                                                <Option
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault(); 
                                                        e.stopPropagation();
                                                        handleSelectClient(client);
                                                    }}
                                                >
                                                    {client.companyName}
                                                </Option>
                                            </Item>
                                        ))
                                    )}
                                </List>
                            )}
                        </StyledSelect>
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
                                
                                {findSelectedClient()?.trnNumber && (
                                    <InfoItem>
                                        <InfoIcon>
                                            <Icon name="receipt" size={12} color={colors.textSecondary} />
                                        </InfoIcon>
                                        <InfoValue>TRN: {findSelectedClient().trnNumber}</InfoValue>
                                    </InfoItem>
                                )}
                                
                                {quotation.clientAddress?.street && (
                                    <InfoItem>
                                        <InfoIcon>
                                            <Icon name="delivery" size={12} color={colors.textSecondary} />
                                        </InfoIcon>
                                        <InfoValue>
                                            {quotation.clientAddress.street}
                                            {(quotation.clientAddress.city || quotation.clientAddress.postCode) && (
                                                <>
                                                    {' '}{quotation.clientAddress.city || ''}
                                                    {quotation.clientAddress.city && quotation.clientAddress.postCode && ', '}
                                                    {quotation.clientAddress.postCode || ''}
                                                </>
                                            )}
                                            {quotation.clientAddress.country && (
                                                <>, {quotation.clientAddress.country}</>
                                            )}
                                        </InfoValue>
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
                            value={quotation.termsAndConditions || ''}
                            $error={errors?.termsAndConditions}
                            onChange={(event) => handleQuotationChange(event, 'quotation')}
                            required
                        />
                    </InputWrapper>

                    {/* Add a currency selector component after the Terms and Conditions field */}
                    <InputWrapper>
                        <Label htmlFor="currency">Currency</Label>
                        <StyledSelect>
                            <Cta
                                type="button"
                                aria-label="Select currency"
                                aria-expanded={isCurrencyDropdownExpanded}
                                aria-controls="currency-select-list"
                                onClick={toggleCurrencyDropdown}
                                $isExpanded={isCurrencyDropdownExpanded}
                            >
                                {quotation.currency || 'USD'}
                                <Icon name={'arrow-down'} size={12} color={colors.purple} />
                            </Cta>
                            {isCurrencyDropdownExpanded && (
                                <List id="currency-select-list" ref={currencySelectRef}>
                                    <Item>
                                        <Option
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleQuotationChange({
                                                    target: { name: 'currency', value: 'USD' }
                                                }, 'quotation');
                                                setIsCurrencyDropdownExpanded(false);
                                            }}
                                        >
                                            USD
                                        </Option>
                                    </Item>
                                    <Item>
                                        <Option
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleQuotationChange({
                                                    target: { name: 'currency', value: 'AED' }
                                                }, 'quotation');
                                                setIsCurrencyDropdownExpanded(false);
                                            }}
                                        >
                                            AED
                                        </Option>
                                    </Item>
                                    <Item>
                                        <Option
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleQuotationChange({
                                                    target: { name: 'currency', value: 'EUR' }
                                                }, 'quotation');
                                                setIsCurrencyDropdownExpanded(false);
                                            }}
                                        >
                                            EUR
                                        </Option>
                                    </Item>
                                </List>
                            )}
                        </StyledSelect>
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
                            <StyledSelect>
                                <Cta
                                    type="button"
                                    aria-label="Select payment terms"
                                    aria-expanded={isDropdownExpanded}
                                    aria-controls="select-list"
                                    onClick={toggleDropdown}
                                    $isExpanded={isDropdownExpanded}
                                >
                                    Net {quotation.paymentTerms} Days
                                    <Icon name={'arrow-down'} size={12} color={colors.purple} />
                                </Cta>
                                {isDropdownExpanded && (
                                    <List id="select-list" ref={selectRef}>
                                        <Item>
                                            <Option
                                                type="button"
                                                name="paymentTerms"
                                                value="1"
                                                onClick={(event) => handleSelectOption(event)}
                                            >
                                                Net 1 Day
                                            </Option>
                                        </Item>
                                        <Item>
                                            <Option
                                                type="button"
                                                name="paymentTerms"
                                                value="7"
                                                onClick={(event) => handleSelectOption(event)}
                                            >
                                                Net 7 Days
                                            </Option>
                                        </Item>
                                        <Item>
                                            <Option
                                                type="button"
                                                name="paymentTerms"
                                                value="14"
                                                onClick={(event) => handleSelectOption(event)}
                                            >
                                                Net 14 Days
                                            </Option>
                                        </Item>
                                        <Item>
                                            <Option
                                                type="button"
                                                name="paymentTerms"
                                                value="30"
                                                onClick={(event) => handleSelectOption(event)}
                                            >
                                                Net 30 Days
                                            </Option>
                                        </Item>
                                    </List>
                                )}
                            </StyledSelect>
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
                            <ItemInputsGroup key={index}>
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
                                            type="text"
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
                                    <ItemVat>
                                        <MinimalLabel htmlFor={`item-vat-${index}`}>VAT (5%)</MinimalLabel>
                                        <VatValue>
                                            <span className="currency">{quotation.currency || 'USD'}</span>
                                            {formatNumber(item.vat)}
                                        </VatValue>
                                    </ItemVat>
                                    
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
                            $secondary 
                            onClick={() => {
                                setLocalItems(prevItems => [
                                    ...prevItems, 
                                    { 
                                        name: '', 
                                        description: '',
                                        quantity: 0, 
                                        price: 0, 
                                        vat: 0,
                                        total: 0 
                                    }
                                ]);
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
        </>
    );
};

export default QuotationFormContent; 