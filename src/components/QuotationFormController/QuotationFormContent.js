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
    gap: 48px;
`;

const TotalValue = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 13px 16px 20px;
    border-radius: 4px;
    border: none;
    background-color: transparent;
    color: ${({ theme }) => theme.colors.textTertiary};
    font-weight: 700;
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
    const selectRef = useRef();
    const clientSelectRef = useRef();
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
        if (localItems !== items && typeof setItems === 'function') {
            console.log('Syncing local items to global state:', localItems);
            setItems(localItems);
        }
    }, [localItems]);
    
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
        };
        document.addEventListener('click', checkIfClickedOutside);

        return () => {
            document.removeEventListener('click', checkIfClickedOutside);
        };
    }, [isDropdownExpanded, isClientDropdownExpanded]);
    
    const toggleDropdown = () => {
        setIsDropdownExpanded(!isDropdownExpanded);
    };
    
    const toggleClientDropdown = () => {
        setIsClientDropdownExpanded(!isClientDropdownExpanded);
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
                }
                
                // Post Code
                if (postCode) {
                    handleQuotationChange({
                        target: { name: 'postCode', value: postCode }
                    }, 'clientAddress');
                }
            }
            
            // Country
            if (client.country) {
                handleQuotationChange({
                    target: { name: 'country', value: client.country }
                }, 'clientAddress');
            }
        }, 100);
    };

    // Add a helper function to check if the client name is being properly set
    const hasClientDetails = () => {
        return Boolean(quotation?.clientName);
    };

    // Create a wrapper for handleQuotationChange to intercept 'items' updates
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
                
                // Update total if quantity or price changes
                if (name === 'quantity' || name === 'price') {
                    updatedItems[index].total =
                        updatedItems[index].quantity * updatedItems[index].price;
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

    return (
        <>
            {!isEdited && <Title>New Quotation</Title>}
            {isEdited && (
                <Title>
                    Edit <Hashtag>#</Hashtag>
                    {quotation.id}
                </Title>
            )}
            <StyledForm id="quotation-form">
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
                            name="termsAndConditions"
                            placeholder="Enter terms and conditions"
                            value={quotation.termsAndConditions || ''}
                            $error={errors?.termsAndConditions}
                            onChange={(event) =>
                                handleQuotationChange(event, 'quotation')
                            }
                        />
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
                            <InputsGroup key={index}>
                                <InputWrapper>
                                    <Label
                                        htmlFor="name"
                                        $srOnly={index > 0 && isDesktop}
                                        $error={errors.items && errors.items[index]?.name}
                                    >
                                        Item Name
                                        {errors.items && errors.items[index]?.name && (
                                            <Error>can't be empty</Error>
                                        )}
                                    </Label>
                                    <Input
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
                                </InputWrapper>
                                <InputWrapper>
                                    <Label
                                        htmlFor="quantity"
                                        $srOnly={index > 0 && isDesktop}
                                        $error={errors.items && errors.items[index]?.quantity}
                                    >
                                        Qty.
                                    </Label>
                                    <Input
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
                                </InputWrapper>
                                <InputWrapper>
                                    <Label
                                        htmlFor="price"
                                        $srOnly={index > 0 && isDesktop}
                                        $error={errors.items && errors.items[index]?.price}
                                    >
                                        Price
                                    </Label>
                                    <Input
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
                                </InputWrapper>
                                <InputWrapper>
                                    <Label $srOnly={index > 0 && isDesktop}>
                                        Total
                                    </Label>
                                    <TotalValue>{item.total || 0}</TotalValue>
                                </InputWrapper>
                                <Delete
                                    type="button"
                                    onClick={() => {
                                        setLocalItems(prevItems => 
                                            prevItems.filter((_, i) => i !== index)
                                        );
                                    }}
                                >
                                    <Icon
                                        name="delete"
                                        size={16}
                                        color={colors.btnTheme}
                                    />
                                </Delete>
                            </InputsGroup>
                        ))}
                        <Button 
                            type="button" 
                            $secondary 
                            onClick={() => {
                                setLocalItems(prevItems => [
                                    ...prevItems, 
                                    { name: '', quantity: 0, price: 0, total: 0 }
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
            </StyledForm>
        </>
    );
};

export default QuotationFormContent; 