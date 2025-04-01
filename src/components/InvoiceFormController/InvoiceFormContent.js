import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'styled-components';
import { useGlobalContext } from '../App/context';
import Icon from '../shared/Icon/Icon';
import ReactDatePicker from 'react-datepicker';
import { formatNumber } from '../../utilities/helpers';
import { DEFAULT_TERMS_AND_CONDITIONS } from '../../constants';
import { getCurrencySymbol } from '../../utilities/currency';
import {
    FormContainer,
    Title,
    Hashtag,
    InvoiceForm,
    Fieldset,
    InputWrapper,
    Label,
    Error,
    Input,
    InputsGroup,
    SelectWrapper,
    SelectButton,
    DropdownList,
    DropdownItem,
    DropdownOption,
    TextArea,
    Wrapper,
    ItemInputsGroup,
    MinimalLabel,
    MinimalInput,
    ItemQty,
    ItemPrice,
    ItemVat,
    ItemTotal,
    VatValue,
    TotalValue,
    ItemDelete,
    AddNewItemButton,
    ErrorsWrapper,
    ClientDetailsCard,
    CardTitle,
    ClientInfo,
    InfoItem,
    InfoIcon,
    InfoValue
} from './InvoiceFormContentStyles';

const InvoiceFormContent = ({ isEdited }) => {
    const { colors } = useTheme();
    const {
        invoice,
        invoiceState,
        handleInvoiceChange,
        addInvoiceItem,
        removeInvoiceItem,
        items,
        windowWidth,
        clientState,
        setItems,
        addNewItem,
        removeItemAtIndex,
        handleInvoiceSubmit,
        toggleInvoiceModal,
        dispatch
    } = useGlobalContext();
    
    const [isDropdownExpanded, setIsDropdownExpanded] = useState(false);
    const [isClientDropdownExpanded, setIsClientDropdownExpanded] = useState(false);
    const [isCurrencyDropdownExpanded, setIsCurrencyDropdownExpanded] = useState(false);
    const selectRef = useRef();
    const clientSelectRef = useRef();
    const currencySelectRef = useRef();
    const isDesktop = windowWidth >= 768;
    
    const errors = invoiceState?.errors?.fields || {};
    const errorMessages = invoiceState?.errors?.messages || [];
    
    // Initialize local items state
    const [localItems, setLocalItems] = useState([]);

    // Initialize items when component mounts or invoice changes
    useEffect(() => {
        if (invoice?.items && invoice.items.length > 0) {
            // Only update if the items are different
            if (JSON.stringify(invoice.items) !== JSON.stringify(localItems)) {
                setLocalItems(invoice.items);
            }
        }
    }, [invoice?.items]); // Only depend on invoice.items

    // Sync changes from global state to local state
    useEffect(() => {
        if (items && items.length > 0) {
            // Only update if the items are different
            if (JSON.stringify(items) !== JSON.stringify(localItems)) {
                setLocalItems(items);
            }
        }
    }, [items]);

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
        handleInvoiceChange(event, 'invoice');
        setIsDropdownExpanded(false);
    };
    
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
        handleInvoiceChange({
            target: {
                name: 'clientName',
                value: client.companyName
            }
        }, 'invoice');
        
        // Update client email
        handleInvoiceChange({
            target: {
                name: 'clientEmail',
                value: client.email
            }
        }, 'invoice');
        
        // Initialize clientAddress object with empty values
        handleInvoiceChange({
            target: { 
                name: 'clientAddress', 
                value: {
                    street: '',
                    city: '',
                    postCode: '',
                    country: ''
                }
            }
        }, 'invoice');
        
        // Update client address fields
        if (client.address) {
            // Set the address in the clientAddress object
            handleInvoiceChange({
                target: { name: 'street', value: client.address }
            }, 'clientAddress');
        }
        
        // Set country
        if (client.country) {
            handleInvoiceChange({
                target: { name: 'country', value: client.country }
            }, 'clientAddress');
            
            // Set currency based on country
            const currency = getCurrencySymbol(client.country);
            if (currency) {
                handleInvoiceChange({
                    target: { name: 'currency', value: currency }
                }, 'invoice');
            }
        }
    };

    // Add a helper function to check if the client name is being properly set
    const hasClientDetails = () => {
        return Boolean(invoice?.clientName);
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
            handleInvoiceChange(event, type, date, index);
        }
    };

    // Add back the findSelectedClient function that was accidentally removed
    const findSelectedClient = () => {
        if (!invoice?.clientName || !clientState?.clients) return null;
        return clientState.clients.find(c => c.companyName === invoice.clientName);
    };

    // Add a function to get the current client's currency symbol
    const getClientCurrency = () => {
        const country = invoice?.clientAddress?.country || '';
        return getCurrencySymbol(country);
    };

    // Add useEffect to set default terms and conditions when component mounts
    useEffect(() => {
        let isMounted = true;
        
        if (!invoice.termsAndConditions && isMounted) {
            console.log('Setting default terms and conditions');
            handleInvoiceChange({
                target: {
                    name: 'termsAndConditions',
                    value: DEFAULT_TERMS_AND_CONDITIONS
                }
            }, 'invoice');
        }
        
        return () => {
            isMounted = false;
        };
    }, []); // Empty dependency array means this runs once when component mounts

    return (
        <FormContainer>
            {!isEdited && <Title>New Invoice</Title>}
            {isEdited && (
                <Title>
                    Edit <Hashtag>#</Hashtag>
                    {invoice.id}
                </Title>
            )}

            <InvoiceForm id="invoice-form">
                {/* Client Selection Section */}
                <Fieldset>
                    <InputWrapper>
                        <Label
                            htmlFor="clientName"
                            $error={errors?.clientName}
                        >
                            Client Name
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
                                {invoice.clientName || 'Select a client'}
                                <Icon name={'arrow-down'} size={12} color={colors.purple} />
                            </SelectButton>
                            {isClientDropdownExpanded && (
                                <DropdownList id="client-select-list" ref={clientSelectRef}>
                                    {clientState?.clients?.map((client) => (
                                        <DropdownItem key={client.id}>
                                            <DropdownOption
                                                type="button"
                                                onClick={() => handleSelectClient(client)}
                                            >
                                                {client.companyName}
                                            </DropdownOption>
                                        </DropdownItem>
                                    ))}
                                </DropdownList>
                            )}
                        </SelectWrapper>
                    </InputWrapper>

                    {hasClientDetails() ? (
                        <ClientDetailsCard>
                            <CardTitle>Client Information</CardTitle>
                            <ClientInfo>
                                {invoice.clientEmail && (
                                    <InfoItem>
                                        <InfoIcon>
                                            <Icon name="invoice" size={12} color={colors.textSecondary} />
                                        </InfoIcon>
                                        <InfoValue>{invoice.clientEmail}</InfoValue>
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
                            </ClientInfo>
                        </ClientDetailsCard>
                    ) : null}
                </Fieldset>

                {/* Terms and Conditions Section */}
                <Fieldset>
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
                            value={invoice.termsAndConditions || DEFAULT_TERMS_AND_CONDITIONS}
                            $error={errors?.termsAndConditions}
                            onChange={(event) => handleInvoiceChange(event, 'invoice')}
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
                                {invoice.currency || 'USD'}
                                <Icon name={'arrow-down'} size={12} color={colors.purple} />
                            </SelectButton>
                            {isCurrencyDropdownExpanded && (
                                <DropdownList id="currency-select-list" ref={currencySelectRef}>
                                    <DropdownItem>
                                        <DropdownOption
                                            type="button"
                                            onClick={() => {
                                                handleInvoiceChange({
                                                    target: { name: 'currency', value: 'USD' }
                                                }, 'invoice');
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
                                                handleInvoiceChange({
                                                    target: { name: 'currency', value: 'AED' }
                                                }, 'invoice');
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
                                                handleInvoiceChange({
                                                    target: { name: 'currency', value: 'EUR' }
                                                }, 'invoice');
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
                            <Label>Invoice Date</Label>
                            <ReactDatePicker
                                selected={new Date(invoice.createdAt)}
                                onChange={(date) => handleInvoiceChange(false, 'date', date)}
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
                                    Net {invoice.paymentTerms} Days
                                    <Icon name={'arrow-down'} size={12} color={colors.purple} />
                                </SelectButton>
                                {isDropdownExpanded && (
                                    <DropdownList id="select-list" ref={selectRef}>
                                        <DropdownItem>
                                            <DropdownOption
                                                type="button"
                                                onClick={() => handleInvoiceChange({
                                                    target: { name: 'paymentTerms', value: '7' }
                                                }, 'invoice')}
                                            >
                                                Net 7 Days
                                            </DropdownOption>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <DropdownOption
                                                type="button"
                                                onClick={() => handleInvoiceChange({
                                                    target: { name: 'paymentTerms', value: '14' }
                                                }, 'invoice')}
                                            >
                                                Net 14 Days
                                            </DropdownOption>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <DropdownOption
                                                type="button"
                                                onClick={() => handleInvoiceChange({
                                                    target: { name: 'paymentTerms', value: '30' }
                                                }, 'invoice')}
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
                            value={invoice.description || ''}
                            $error={errors?.description}
                            onChange={(event) => handleInvoiceChange(event, 'invoice')}
                        />
                    </InputWrapper>
                </Fieldset>
                
                {/* Item List Section */}
                <Fieldset>
                    <Wrapper>
                        <Label>Item List</Label>
                        {localItems.map((item, index) => (
                            <ItemInputsGroup key={index} id={`item-${index}`}>
                                <InputWrapper $fullWidth>
                                    <MinimalLabel
                                        htmlFor={`item-name-${index}`}
                                        $error={errors.items && errors.items[index]?.name}
                                    >
                                        Item Name
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
                                </InputWrapper>

                                <InputWrapper $fullWidth>
                                    <MinimalLabel
                                        htmlFor={`item-description-${index}`}
                                        $error={errors.items && errors.items[index]?.description}
                                    >
                                        Description
                                    </MinimalLabel>
                                    <MinimalInput
                                        id={`item-description-${index}`}
                                        type="text"
                                        name="description"
                                        value={item.description || ''}
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
                                </InputWrapper>

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
                                            Price ({invoice.currency || 'USD'})
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
                                            <span className="currency">{invoice.currency || 'USD'}</span>
                                            {formatNumber(item.vat)}
                                        </VatValue>
                                    </ItemVat>
                                    
                                    <ItemTotal>
                                        <MinimalLabel htmlFor={`item-total-${index}`}>Total</MinimalLabel>
                                        <TotalValue>
                                            <span className="currency">{invoice.currency || 'USD'}</span>
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
                                        vat: 0,
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
                {invoiceState?.errors?.isError && errorMessages.length > 0 && (
                    <ErrorsWrapper>
                        {errorMessages.map((message, index) => (
                            <Error key={index}>{message}</Error>
                        ))}
                    </ErrorsWrapper>
                )}
            </InvoiceForm>
        </FormContainer>
    );
};

export default InvoiceFormContent; 