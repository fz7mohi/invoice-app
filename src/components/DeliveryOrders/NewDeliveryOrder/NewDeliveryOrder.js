import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, orderBy, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useGlobalContext } from '../../App/context';
import { motion } from 'framer-motion';
import Icon from '../../shared/Icon/Icon';
import {
    Container,
    Header,
    Title,
    Form,
    FormGroup,
    Label,
    Select,
    Grid,
    GridItem,
    Value,
    Card,
    CardTitle,
    CardContent,
    ClientInfo,
    ClientName,
    ClientAddress,
    InvoiceInfo,
    InvoiceNumber,
    InvoiceDate,
    ItemsList,
    ItemRow,
    ItemName,
    ItemQuantity,
    ItemPrice,
    PackagingType,
    CartonDetails,
    CartonGrid,
    CartonInput,
    CartonLabel,
    TotalPieces,
    Actions,
    CancelButton,
    SubmitButton,
    ErrorMessage,
    CloseButton,
    StepIndicator,
    Step,
    StepNumber,
    StepLabel,
    StepContent,
    StepActions,
    BackButton,
    NextButton,
    ProgressBar,
    ProgressFill,
    PackagingHeader,
    PackagingTitle,
    PackagingSubtitle,
    ItemsTabs,
    ItemTab,
    ItemCard,
    ItemHeader,
    PackagingSection,
    PackagingTypeLabel,
    PackagingTypeSelector,
    PackagingOption,
    PieceDetails,
    PieceInputGroup,
    PieceLabel,
    PieceInput,
    PieceHelper,
    PieceSummary,
    PieceSummaryItem,
    PieceSummaryLabel,
    PieceSummaryValue,
    PackagingOptionLabel,
    PackagingIcon,
    AddCartonButton,
    AddIcon,
    CartonHeader,
    CartonTitle,
    CartonCard,
    CartonCardHeader,
    CartonCardTitle,
    CartonCardContent,
    CartonField,
    CartonFieldLabel,
    CartonSelect,
    CartonInputField,
    CartonCardFooter,
    CartonSubtotal,
    CartonSummary,
    CartonSummaryItem,
    CartonSummaryLabel,
    CartonSummaryValue,
    RemoveCartonButton,
    RemoveIcon,
    CartonDetailsContainer
} from './NewDeliveryOrderStyles';

const NewDeliveryOrder = ({ onClose, editMode = false, deliveryOrder = null }) => {
    const history = useHistory();
    const { createDeliveryOrder, updateDeliveryOrder } = useGlobalContext();
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [invoice, setInvoice] = useState(null);
    const [deliveryItems, setDeliveryItems] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [clientData, setClientData] = useState(null);
    const [isClientFetching, setIsClientFetching] = useState(false);
    const [cartonSizes, setCartonSizes] = useState({});
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const totalSteps = 3;

    // Initialize form data if in edit mode
    useEffect(() => {
        if (editMode && deliveryOrder) {
            setInvoiceNumber(deliveryOrder.invoiceId);
            
            // Map the existing delivery order items with their packaging details
            const mappedItems = deliveryOrder.items.map(item => ({
                ...item,
                // For piece packaging
                deliveryPieces: item.packagingType === 'piece' ? item.quantity : undefined,
                
                // For carton packaging
                cartons: item.packagingType === 'carton' ? item.cartonDetails?.reduce((sum, carton) => sum + carton.count, 0) || 0 : 0,
                piecesPerCarton: item.packagingType === 'carton' ? 
                    (item.cartonDetails?.reduce((sum, carton) => sum + (carton.count * carton.piecesPerCarton), 0) || 0) / 
                    (item.cartonDetails?.reduce((sum, carton) => sum + carton.count, 0) || 1) : 0,
                
                // Preserve the original carton details
                cartonDetails: item.packagingType === 'carton' ? item.cartonDetails.map(detail => ({
                    size: detail.size || 'Standard',
                    count: detail.count || 1,
                    piecesPerCarton: detail.piecesPerCarton || 1
                })) : []
            }));
            
            console.log('Mapped delivery items for edit:', JSON.stringify(mappedItems, null, 2));
            setDeliveryItems(mappedItems);
            
            // Fetch invoice data
            fetchInvoiceDetails(deliveryOrder.invoiceId);
        }
    }, [editMode, deliveryOrder]);

    // Fetch all invoices
    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const invoicesCollection = collection(db, 'invoices');
                const invoicesQuery = query(
                    invoicesCollection,
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(invoicesQuery);
                
                const invoicesList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                setInvoices(invoicesList);
            } catch (error) {
                console.error('Error fetching invoices:', error);
                setError('Error fetching invoices');
            }
        };

        fetchInvoices();
    }, []);

    // Fetch client data
    const fetchClientData = async (clientId, clientName) => {
        if (!clientId && !clientName) {
            return;
        }
        
        try {
            setIsClientFetching(true);
            
            // Try to fetch from clients collection first
            if (clientId) {
                const clientRef = doc(db, 'clients', clientId);
                const clientSnap = await getDoc(clientRef);
                
                if (clientSnap.exists()) {
                    const data = clientSnap.data();
                    setClientData(data);
                    return;
                }
            }
            
            // If no client found by ID, try to find by name
            if (clientName) {
                const clientsRef = collection(db, 'clients');
                const q = query(clientsRef, where('companyName', '==', clientName));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    const data = querySnapshot.docs[0].data();
                    setClientData(data);
                }
            }
        } catch (error) {
            console.error('Error fetching client data:', error);
        } finally {
            setIsClientFetching(false);
        }
    };

    // Fetch invoice details when selected
    useEffect(() => {
        if (invoiceNumber && !editMode) {
            fetchInvoiceDetails();
        }
    }, [invoiceNumber, editMode]);

    useEffect(() => {
        console.log('deliveryItems state changed:', JSON.stringify(deliveryItems, null, 2));
    }, [deliveryItems]);

    // Fetch invoice details
    const fetchInvoiceDetails = async (invoiceId = null) => {
        try {
            setIsLoading(true);
            setError('');
            const invoiceRef = doc(db, 'invoices', invoiceId || invoiceNumber);
            const invoiceDoc = await getDoc(invoiceRef);

            if (!invoiceDoc.exists()) {
                setError('Invoice not found');
                return;
            }

            const invoiceData = invoiceDoc.data();
            console.log('Fetched Invoice Data:', JSON.stringify(invoiceData, null, 2));
            
            setInvoice(invoiceData);
            
            // Only initialize delivery items if not in edit mode
            if (!editMode) {
                // Initialize delivery items with more detailed default values
                const initialDeliveryItems = invoiceData.items.map(item => {
                    return {
                        ...item,
                        packagingType: 'piece',
                        quantity: item.quantity,
                        cartons: 0,
                        piecesPerCarton: 0,
                        deliveryPieces: item.quantity,
                        cartonDetails: []
                    };
                });
                
                console.log('Initialized Delivery Items:', JSON.stringify(initialDeliveryItems, null, 2));
                setDeliveryItems(initialDeliveryItems);
            }
            
            // Fetch client data after setting invoice
            if (invoiceData.clientId) {
                await fetchClientData(invoiceData.clientId, invoiceData.clientName);
            } else if (invoiceData.clientName) {
                await fetchClientData(null, invoiceData.clientName);
            }
        } catch (error) {
            console.error('Error fetching invoice:', error);
            setError('Error fetching invoice details');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePackagingTypeChange = (index, type) => {
        console.log('Changing packaging type for item', index, 'to', type);
        console.log('Current deliveryItems before change:', JSON.stringify(deliveryItems, null, 2));
        
        const updatedItems = [...deliveryItems];
        updatedItems[index] = {
            ...updatedItems[index],
            packagingType: type,
            cartons: type === 'carton' ? 1 : 0,
            piecesPerCarton: type === 'carton' ? 1 : 0,
            deliveryPieces: type === 'piece' ? updatedItems[index].quantity : 0,
            cartonDetails: type === 'carton' ? [{ size: 'Small', count: 1, piecesPerCarton: 1 }] : []
        };
        
        console.log('Updated item:', JSON.stringify(updatedItems[index], null, 2));
        setDeliveryItems(updatedItems);
        setActiveItemIndex(index);
    };

    const handleCartonChange = (index, field, value) => {
        const updatedItems = [...deliveryItems];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: parseInt(value) || 0
        };
        setDeliveryItems(updatedItems);
    };

    const handleDeliveryPiecesChange = (index, value) => {
        const updatedItems = [...deliveryItems];
        updatedItems[index] = {
            ...updatedItems[index],
            deliveryPieces: parseInt(value) || 0
        };
        setDeliveryItems(updatedItems);
    };

    const handleCartonDetailChange = (itemIndex, cartonIndex, field, value) => {
        console.log('Changing carton detail:', { itemIndex, cartonIndex, field, value });
        console.log('Current deliveryItems before change:', JSON.stringify(deliveryItems, null, 2));
        
        const updatedItems = [...deliveryItems];
        const item = updatedItems[itemIndex];
        
        if (!item.cartonDetails) {
            item.cartonDetails = [{ size: 'Standard', count: 1, piecesPerCarton: 1 }];
        }
        
        if (field === 'size') {
            item.cartonDetails[cartonIndex].size = value;
        } else if (field === 'count') {
            item.cartonDetails[cartonIndex].count = parseInt(value) || 0;
        } else if (field === 'piecesPerCarton') {
            item.cartonDetails[cartonIndex].piecesPerCarton = parseInt(value) || 0;
        }
        
        // Calculate total cartons and pieces
        let totalCartons = 0;
        let totalPieces = 0;
        
        item.cartonDetails.forEach(detail => {
            totalCartons += detail.count;
            totalPieces += detail.count * detail.piecesPerCarton;
        });
        
        item.cartons = totalCartons;
        item.piecesPerCarton = totalPieces / totalCartons || 0;
        
        console.log('Updated item:', JSON.stringify(updatedItems[itemIndex], null, 2));
        setDeliveryItems(updatedItems);
    };

    const addCartonDetail = (itemIndex) => {
        const updatedItems = [...deliveryItems];
        const item = updatedItems[itemIndex];
        
        if (!item.cartonDetails) {
            item.cartonDetails = [];
        }
        
        item.cartonDetails.push({
            size: 'Standard',
            count: 1,
            piecesPerCarton: 1
        });
        
        // Recalculate totals
        let totalCartons = 0;
        let totalPieces = 0;
        
        item.cartonDetails.forEach(detail => {
            totalCartons += detail.count;
            totalPieces += detail.count * detail.piecesPerCarton;
        });
        
        item.cartons = totalCartons;
        item.piecesPerCarton = totalPieces / totalCartons || 0;
        
        setDeliveryItems(updatedItems);
    };

    const removeCartonDetail = (itemIndex, cartonIndex) => {
        const updatedItems = [...deliveryItems];
        const item = updatedItems[itemIndex];
        
        if (item.cartonDetails && item.cartonDetails.length > 1) {
            item.cartonDetails.splice(cartonIndex, 1);
            
            // Recalculate totals
            let totalCartons = 0;
            let totalPieces = 0;
            
            item.cartonDetails.forEach(detail => {
                totalCartons += detail.count;
                totalPieces += detail.count * detail.piecesPerCarton;
            });
            
            item.cartons = totalCartons;
            item.piecesPerCarton = totalPieces / totalCartons || 0;
            
            setDeliveryItems(updatedItems);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!invoice) {
            setError('Please select an invoice');
            return;
        }

        try {
            console.log('Starting handleSubmit');
            console.log('Current invoice:', JSON.stringify(invoice, null, 2));
            console.log('Current deliveryItems:', JSON.stringify(deliveryItems, null, 2));
            setIsLoading(true);
            setError('');

            // Ensure all required fields are defined
            const deliveryOrderData = {
                invoiceId: invoiceNumber || '',
                invoiceCustomId: invoice.customId || invoiceNumber || '',
                clientName: invoice.clientName || '',
                clientAddress: invoice.clientAddress || '',
                currency: invoice.currency || 'USD',
                items: deliveryItems.map(item => {
                    // Find the original invoice item to get the correct quantity
                    const originalInvoiceItem = invoice.items.find(invItem => invItem.name === item.name);
                    console.log('Processing item:', item.name);
                    console.log('Original invoice item:', JSON.stringify(originalInvoiceItem, null, 2));
                    
                    const mappedItem = {
                        name: item.name || '',
                        quantity: originalInvoiceItem?.quantity || 0, // Use the original invoice quantity
                        price: item.price || 0,
                        packagingType: item.packagingType || 'piece',
                        cartons: item.cartons || 0,
                        piecesPerCarton: item.piecesPerCarton || 0,
                        deliveryPieces: item.deliveryPieces || 0,
                        cartonDetails: (item.cartonDetails || []).map(detail => ({
                            size: detail.size || 'Standard',
                            count: detail.count || 0,
                            piecesPerCarton: detail.piecesPerCarton || 0
                        })),
                        // Add undelivered quantity calculation
                        undeliveredQuantity: item.packagingType === 'piece' 
                            ? Math.max(0, (originalInvoiceItem?.quantity || 0) - (item.deliveryPieces || 0))
                            : Math.max(0, (originalInvoiceItem?.quantity || 0) - ((item.cartons || 0) * (item.piecesPerCarton || 0)))
                    };
                    
                    console.log('Mapped item:', JSON.stringify(mappedItem, null, 2));
                    return mappedItem;
                }),
                status: deliveryOrder?.status || 'pending',
                updatedAt: serverTimestamp()
            };

            console.log('Final delivery order data:', JSON.stringify(deliveryOrderData, null, 2));

            if (editMode && deliveryOrder) {
                console.log('Updating existing delivery order:', deliveryOrder.id);
                await updateDeliveryOrder(deliveryOrder.id, deliveryOrderData);
                console.log('Delivery order updated successfully');
            } else {
                console.log('Creating new delivery order');
                deliveryOrderData.createdAt = serverTimestamp();
                await createDeliveryOrder(deliveryOrderData);
                console.log('Delivery order created successfully');
            }

            console.log('Closing modal');
            onClose();
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            setError(error.message || 'Error saving delivery order');
        } finally {
            setIsLoading(false);
        }
    };

    const formatAddress = (invoice, clientData) => {
        if (!invoice) return '';
        
        // If we have client data from the clients collection, use that
        if (clientData && clientData.address) {
            return clientData.address;
        }
        
        // Try to get address from clientAddress object in invoice
        if (invoice.clientAddress) {
            const parts = [];
            if (invoice.clientAddress.street) parts.push(invoice.clientAddress.street);
            if (invoice.clientAddress.city) parts.push(invoice.clientAddress.city);
            if (invoice.clientAddress.postCode) parts.push(invoice.clientAddress.postCode);
            if (invoice.clientAddress.country) parts.push(invoice.clientAddress.country);
            if (parts.length > 0) return parts.join(', ');
        }
        
        // Fallback to direct address property
        if (invoice.address) return invoice.address;
        
        return '';
    };

    const getClientPhone = (invoice, clientData) => {
        if (clientData && clientData.phone) {
            return clientData.phone;
        }
        return invoice.clientPhone || '';
    };

    const getClientCountry = (invoice, clientData) => {
        if (clientData && clientData.country) {
            return clientData.country;
        }
        if (invoice.clientAddress && invoice.clientAddress.country) {
            return invoice.clientAddress.country;
        }
        return invoice.country || '';
    };

    const formatCurrency = (amount, currency = 'USD') => {
        // Check if amount is a valid number
        if (amount === undefined || amount === null || isNaN(amount)) {
            return '0.00';
        }
        
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    const goToNextStep = () => {
        console.log('Going to next step. Current step:', currentStep);
        console.log('Current deliveryItems:', JSON.stringify(deliveryItems, null, 2));
        
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const goToPreviousStep = () => {
        console.log('Going to previous step. Current step:', currentStep);
        console.log('Current deliveryItems:', JSON.stringify(deliveryItems, null, 2));
        
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <StepContent>
                        <FormGroup>
                            <Label htmlFor="invoiceNumber">Select Invoice</Label>
                            <Select
                                id="invoiceNumber"
                                value={invoiceNumber}
                                onChange={(e) => setInvoiceNumber(e.target.value)}
                                required
                            >
                                <option value="">Select an invoice</option>
                                {invoices.map(inv => (
                                    <option key={inv.id} value={inv.id}>
                                        Invoice #{inv.customId || inv.id} - {inv.clientName}
                                    </option>
                                ))}
                            </Select>
                        </FormGroup>

                        {error && <ErrorMessage>{error}</ErrorMessage>}

                        {invoice && (
                            <Grid>
                                <Card>
                                    <CardTitle>Client Information</CardTitle>
                                    <CardContent>
                                        <ClientInfo>
                                            <ClientName>{invoice.clientName}</ClientName>
                                            <ClientAddress>
                                                {formatAddress(invoice, clientData) && (
                                                    <span>{formatAddress(invoice, clientData)}<br /></span>
                                                )}
                                                {getClientPhone(invoice, clientData) && (
                                                    <span>{getClientPhone(invoice, clientData)}<br /></span>
                                                )}
                                                {getClientCountry(invoice, clientData) && (
                                                        <span>{getClientCountry(invoice, clientData)}</span>
                                                )}
                                            </ClientAddress>
                                        </ClientInfo>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardTitle>Invoice Details</CardTitle>
                                    <CardContent>
                                        <InvoiceInfo>
                                            <InvoiceNumber>Invoice #{invoice.customId || invoiceNumber}</InvoiceNumber>
                                            <InvoiceDate>
                                                {new Date(invoice.createdAt?.toDate()).toLocaleDateString()}
                                            </InvoiceDate>
                                        </InvoiceInfo>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}
                    </StepContent>
                );
            case 2:
                return (
                    <StepContent>
                        <PackagingHeader>
                            <PackagingTitle>Packaging Details</PackagingTitle>
                            <PackagingSubtitle>
                                Specify how each item will be packaged for delivery
                            </PackagingSubtitle>
                        </PackagingHeader>
                        
                        <ItemsTabs>
                            {deliveryItems.map((item, index) => (
                                <ItemTab 
                                    key={index}
                                    $active={activeItemIndex === index}
                                    onClick={() => setActiveItemIndex(index)}
                                >
                                    {item.name}
                                </ItemTab>
                            ))}
                        </ItemsTabs>
                        
                        <ItemsList>
                            {deliveryItems.map((item, index) => (
                                <ItemCard key={index} $active={activeItemIndex === index}>
                                    <ItemHeader>
                                        <ItemName>{item.name}</ItemName>
                                        <ItemQuantity>Available: {item.quantity}</ItemQuantity>
                                        <ItemPrice>{formatCurrency(item.price, invoice?.currency)}</ItemPrice>
                                    </ItemHeader>
                                    
                                    <PackagingSection>
                                        <PackagingTypeLabel>Packaging Type</PackagingTypeLabel>
                                        <PackagingTypeSelector>
                                            <PackagingOption 
                                                $selected={item.packagingType === 'piece'}
                                                onClick={() => handlePackagingTypeChange(index, 'piece')}
                                            >
                                                <PackagingIcon>📦</PackagingIcon>
                                                <PackagingOptionLabel>Piece</PackagingOptionLabel>
                                            </PackagingOption>
                                            <PackagingOption 
                                                $selected={item.packagingType === 'carton'}
                                                onClick={() => handlePackagingTypeChange(index, 'carton')}
                                            >
                                                <PackagingIcon>🧰</PackagingIcon>
                                                <PackagingOptionLabel>Carton</PackagingOptionLabel>
                                            </PackagingOption>
                                        </PackagingTypeSelector>

                                        {item.packagingType === 'piece' && (
                                            <PieceDetails>
                                                <PieceInputGroup>
                                                    <PieceLabel>Number of Pieces to Deliver</PieceLabel>
                                                    <PieceInput
                                                        type="number"
                                                        min="1"
                                                        max={item.quantity}
                                                        value={item.deliveryPieces || 0}
                                                        onChange={(e) => handleDeliveryPiecesChange(index, e.target.value)}
                                                    />
                                                    <PieceHelper>
                                                        Maximum available: {item.quantity}
                                                    </PieceHelper>
                                                </PieceInputGroup>
                                                <PieceSummary>
                                                    <PieceSummaryItem>
                                                        <PieceSummaryLabel>Total Pieces:</PieceSummaryLabel>
                                                        <PieceSummaryValue>{item.deliveryPieces || 0}</PieceSummaryValue>
                                                    </PieceSummaryItem>
                                                </PieceSummary>
                                            </PieceDetails>
                                        )}

                                        {item.packagingType === 'carton' && (
                                            <CartonDetailsContainer>
                                                <CartonHeader>
                                                    <CartonTitle>Carton Configuration</CartonTitle>
                                                    <AddCartonButton 
                                                        type="button" 
                                                        onClick={() => addCartonDetail(index)}
                                                    >
                                                        <AddIcon>+</AddIcon> Add Carton Size
                                                    </AddCartonButton>
                                                </CartonHeader>
                                                
                                                {item.cartonDetails && item.cartonDetails.map((detail, cartonIndex) => (
                                                    <CartonCard key={cartonIndex}>
                                                        <CartonCardHeader>
                                                            <CartonCardTitle>Carton {cartonIndex + 1}</CartonCardTitle>
                                                            {item.cartonDetails.length > 1 && (
                                                                <RemoveCartonButton 
                                                                    type="button" 
                                                                    onClick={() => removeCartonDetail(index, cartonIndex)}
                                                                >
                                                                    <RemoveIcon>×</RemoveIcon>
                                                                </RemoveCartonButton>
                                                            )}
                                                        </CartonCardHeader>
                                                        
                                                        <CartonCardContent>
                                                            <CartonField>
                                                                <CartonFieldLabel>Size</CartonFieldLabel>
                                                                <CartonSelect
                                                                    value={detail.size}
                                                                    onChange={(e) => handleCartonDetailChange(index, cartonIndex, 'size', e.target.value)}
                                                                >
                                                                    <option value="Small">Small</option>
                                                                    <option value="Medium">Medium</option>
                                                                    <option value="Large">Large</option>
                                                                    <option value="Extra Large">Extra Large</option>
                                                                </CartonSelect>
                                                            </CartonField>
                                                            
                                                            <CartonField>
                                                                <CartonFieldLabel>Number of Cartons</CartonFieldLabel>
                                                                <CartonInputField
                                                                    type="number"
                                                                    min="1"
                                                                    value={detail.count}
                                                                    onChange={(e) => handleCartonDetailChange(index, cartonIndex, 'count', e.target.value)}
                                                                />
                                                            </CartonField>
                                                            
                                                            <CartonField>
                                                                <CartonFieldLabel>Pieces per Carton</CartonFieldLabel>
                                                                <CartonInputField
                                                                    type="number"
                                                                    min="1"
                                                                    value={detail.piecesPerCarton}
                                                                    onChange={(e) => handleCartonDetailChange(index, cartonIndex, 'piecesPerCarton', e.target.value)}
                                                                />
                                                            </CartonField>
                                                        </CartonCardContent>
                                                        
                                                        <CartonCardFooter>
                                                            <CartonSubtotal>
                                                                Subtotal: {detail.count * detail.piecesPerCarton} pieces
                                                            </CartonSubtotal>
                                                        </CartonCardFooter>
                                                    </CartonCard>
                                                ))}
                                                
                                                <CartonSummary>
                                                    <CartonSummaryItem>
                                                        <CartonSummaryLabel>Total Cartons:</CartonSummaryLabel>
                                                        <CartonSummaryValue>{item.cartons}</CartonSummaryValue>
                                                    </CartonSummaryItem>
                                                    <CartonSummaryItem>
                                                        <CartonSummaryLabel>Total Pieces:</CartonSummaryLabel>
                                                        <CartonSummaryValue>{item.cartons * item.piecesPerCarton}</CartonSummaryValue>
                                                    </CartonSummaryItem>
                                                </CartonSummary>
                                            </CartonDetailsContainer>
                                        )}
                                    </PackagingSection>
                                </ItemCard>
                            ))}
                        </ItemsList>
                    </StepContent>
                );
            case 3:
                console.log('Entering review step. Current deliveryItems:', JSON.stringify(deliveryItems, null, 2));
                console.log('Invoice in review step:', JSON.stringify(invoice, null, 2));
                console.log('Invoice Total in review step:', invoice?.total);
                console.log('Invoice Total Type in review step:', typeof invoice?.total);
                return (
                    <StepContent>
                        <Card>
                            <CardTitle>Delivery Items</CardTitle>
                            <CardContent>
                                {deliveryItems && deliveryItems.length > 0 ? (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ 
                                            width: '100%', 
                                            borderCollapse: 'collapse', 
                                            marginBottom: '20px',
                                            color: '#ffffff'
                                        }}>
                                            <thead>
                                                <tr style={{ 
                                                    backgroundColor: '#333', 
                                                    borderBottom: '2px solid #444' 
                                                }}>
                                                    <th style={{ 
                                                        padding: '12px 16px', 
                                                        textAlign: 'left',
                                                        fontWeight: '600',
                                                        width: '25%'
                                                    }}>Item</th>
                                                    <th style={{ 
                                                        padding: '12px 16px', 
                                                        textAlign: 'left',
                                                        fontWeight: '600',
                                                        width: '15%'
                                                    }}>Invoice Qty</th>
                                                    <th style={{ 
                                                        padding: '12px 16px', 
                                                        textAlign: 'left',
                                                        fontWeight: '600',
                                                        width: '15%'
                                                    }}>Packaging Type</th>
                                                    <th style={{ 
                                                        padding: '12px 16px', 
                                                        textAlign: 'left',
                                                        fontWeight: '600',
                                                        width: '25%'
                                                    }}>Details</th>
                                                    <th style={{ 
                                                        padding: '12px 16px', 
                                                        textAlign: 'right',
                                                        fontWeight: '600',
                                                        width: '20%'
                                                    }}>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {deliveryItems.map((item, index) => {
                                                    // Find the original invoice item to get the correct quantity
                                                    const originalInvoiceItem = invoice.items.find(invItem => invItem.name === item.name);
                                                    
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <tr style={{ 
                                                                backgroundColor: '#2a2a2a', 
                                                                borderBottom: '1px solid #444' 
                                                            }}>
                                                                <td style={{ 
                                                                    padding: '12px 16px', 
                                                                    verticalAlign: 'top',
                                                                    fontWeight: '500'
                                                                }}>
                                                                    {item.name}
                                                                </td>
                                                                <td style={{ 
                                                                    padding: '12px 16px', 
                                                                    verticalAlign: 'top'
                                                                }}>
                                                                    {originalInvoiceItem?.quantity || 0}
                                                                </td>
                                                                <td style={{ 
                                                                    padding: '12px 16px', 
                                                                    verticalAlign: 'top'
                                                                }}>
                                                                    {item.packagingType === 'piece' ? 'Individual Pieces' : 'Carton Packaging'}
                                                                </td>
                                                                <td style={{ 
                                                                    padding: '12px 16px', 
                                                                    verticalAlign: 'top'
                                                                }}>
                                                                    {item.packagingType === 'piece' ? (
                                                                        <div>
                                                                            <span style={{ color: '#b0b0b0' }}>Pieces: </span>
                                                                            <span style={{ fontWeight: '500' }}>{item.deliveryPieces}</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div>
                                                                            <span style={{ color: '#b0b0b0' }}>Cartons: </span>
                                                                            <span style={{ fontWeight: '500' }}>
                                                                                {item.cartonDetails.reduce((sum, carton) => sum + carton.count, 0)}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td style={{ 
                                                                    padding: '12px 16px', 
                                                                    verticalAlign: 'top',
                                                                    textAlign: 'right'
                                                                }}>
                                                                    {item.packagingType === 'piece' ? (
                                                                        <span>{item.deliveryPieces} pieces</span>
                                                                    ) : (
                                                                        <span>
                                                                            {item.cartonDetails.reduce((sum, carton) => sum + (carton.count * carton.piecesPerCarton), 0)} pieces
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            
                                                            {item.packagingType === 'carton' && item.cartonDetails && item.cartonDetails.length > 0 && (
                                                                <tr style={{ backgroundColor: '#222' }}>
                                                                    <td colSpan="5" style={{ padding: '0' }}>
                                                                        <table style={{ 
                                                                            width: '100%', 
                                                                            borderCollapse: 'collapse'
                                                                        }}>
                                                                            <thead>
                                                                                <tr style={{ 
                                                                                    backgroundColor: '#333', 
                                                                                    borderBottom: '1px solid #444' 
                                                                                }}>
                                                                                    <th style={{ 
                                                                                        padding: '8px 16px', 
                                                                                        textAlign: 'left',
                                                                                        fontWeight: '600',
                                                                                        fontSize: '0.9em',
                                                                                        width: '25%'
                                                                                    }}>Carton Size</th>
                                                                                    <th style={{ 
                                                                                        padding: '8px 16px', 
                                                                                        textAlign: 'left',
                                                                                        fontWeight: '600',
                                                                                        fontSize: '0.9em',
                                                                                        width: '25%'
                                                                                    }}>Number of Cartons</th>
                                                                                    <th style={{ 
                                                                                        padding: '8px 16px', 
                                                                                        textAlign: 'left',
                                                                                        fontWeight: '600',
                                                                                        fontSize: '0.9em',
                                                                                        width: '25%'
                                                                                    }}>Pieces per Carton</th>
                                                                                    <th style={{ 
                                                                                        padding: '8px 16px', 
                                                                                        textAlign: 'right',
                                                                                        fontWeight: '600',
                                                                                        fontSize: '0.9em',
                                                                                        width: '25%'
                                                                                    }}>Total Pieces</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {item.cartonDetails.map((carton, cartonIndex) => (
                                                                                    <tr key={cartonIndex} style={{ 
                                                                                        borderBottom: '1px solid #444',
                                                                                        fontSize: '0.9em'
                                                                                    }}>
                                                                                        <td style={{ padding: '8px 16px' }}>
                                                                                            {carton.size}
                                                                                        </td>
                                                                                        <td style={{ padding: '8px 16px' }}>
                                                                                            {carton.count}
                                                                                        </td>
                                                                                        <td style={{ padding: '8px 16px' }}>
                                                                                            {carton.piecesPerCarton}
                                                                                        </td>
                                                                                        <td style={{ 
                                                                                            padding: '8px 16px',
                                                                                            textAlign: 'right',
                                                                                            fontWeight: '500'
                                                                                        }}>
                                                                                            {carton.count * carton.piecesPerCarton}
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                            <tfoot>
                                                                                <tr style={{ 
                                                                                    backgroundColor: '#2a2a2a',
                                                                                    borderTop: '2px solid #444',
                                                                                    fontSize: '0.9em'
                                                                                }}>
                                                                                    <td colSpan="3" style={{ 
                                                                                        padding: '8px 16px',
                                                                                        textAlign: 'right',
                                                                                        fontWeight: '600'
                                                                                    }}>
                                                                                        Total Delivered:
                                                                                    </td>
                                                                                    <td style={{ 
                                                                                        padding: '8px 16px',
                                                                                        textAlign: 'right',
                                                                                        fontWeight: '600'
                                                                                    }}>
                                                                                        {item.cartonDetails.reduce((sum, carton) => sum + (carton.count * carton.piecesPerCarton), 0)} pieces
                                                                                    </td>
                                                                                </tr>
                                                                                <tr style={{ 
                                                                                    backgroundColor: '#2a2a2a',
                                                                                    fontSize: '0.9em'
                                                                                }}>
                                                                                    <td colSpan="3" style={{ 
                                                                                        padding: '8px 16px',
                                                                                        textAlign: 'right',
                                                                                        fontWeight: '600'
                                                                                    }}>
                                                                                        Undelivered:
                                                                                    </td>
                                                                                    <td style={{ 
                                                                                        padding: '8px 16px',
                                                                                        textAlign: 'right',
                                                                                        fontWeight: '600',
                                                                                        color: '#ff6b6b'
                                                                                    }}>
                                                                                        {Math.max(0, (originalInvoiceItem?.quantity || 0) - item.cartonDetails.reduce((sum, carton) => sum + (carton.count * carton.piecesPerCarton), 0))} pieces
                                                                                    </td>
                                                                                </tr>
                                                                            </tfoot>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            
                                                            {/* Add footer for piece packaging */}
                                                            {item.packagingType === 'piece' && (
                                                                <tr style={{ backgroundColor: '#222' }}>
                                                                    <td colSpan="5" style={{ padding: '0' }}>
                                                                        <table style={{ 
                                                                            width: '100%', 
                                                                            borderCollapse: 'collapse'
                                                                        }}>
                                                                            <tfoot>
                                                                                <tr style={{ 
                                                                                    backgroundColor: '#2a2a2a',
                                                                                    borderTop: '2px solid #444',
                                                                                    fontSize: '0.9em'
                                                                                }}>
                                                                                    <td colSpan="3" style={{ 
                                                                                        padding: '8px 16px',
                                                                                        textAlign: 'right',
                                                                                        fontWeight: '600'
                                                                                    }}>
                                                                                        Total Delivered:
                                                                                    </td>
                                                                                    <td style={{ 
                                                                                        padding: '8px 16px',
                                                                                        textAlign: 'right',
                                                                                        fontWeight: '600'
                                                                                    }}>
                                                                                        {item.deliveryPieces} pieces
                                                                                    </td>
                                                                                </tr>
                                                                                <tr style={{ 
                                                                                    backgroundColor: '#2a2a2a',
                                                                                    fontSize: '0.9em'
                                                                                }}>
                                                                                    <td colSpan="3" style={{ 
                                                                                        padding: '8px 16px',
                                                                                        textAlign: 'right',
                                                                                        fontWeight: '600'
                                                                                    }}>
                                                                                        Undelivered:
                                                                                    </td>
                                                                                    <td style={{ 
                                                                                        padding: '8px 16px',
                                                                                        textAlign: 'right',
                                                                                        fontWeight: '600',
                                                                                        color: '#ff6b6b'
                                                                                    }}>
                                                                                        {Math.max(0, (originalInvoiceItem?.quantity || 0) - (item.deliveryPieces || 0))} pieces
                                                                                    </td>
                                                                                </tr>
                                                                            </tfoot>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div>No delivery items found. Please go back and configure packaging details.</div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardTitle>Client Information</CardTitle>
                            <CardContent>
                                <Grid>
                                    <GridItem>
                                        <Label>Client Name</Label>
                                        <Value>{invoice.clientName}</Value>
                                    </GridItem>
                                    <GridItem>
                                        <Label>Client Address</Label>
                                        <Value>{formatAddress(invoice, clientData)}</Value>
                                    </GridItem>
                                    <GridItem>
                                        <Label>Client Phone</Label>
                                        <Value>{getClientPhone(invoice, clientData)}</Value>
                                    </GridItem>
                                    <GridItem>
                                        <Label>Client Email</Label>
                                        <Value>{invoice.clientEmail}</Value>
                                    </GridItem>
                                </Grid>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardTitle>Invoice Details</CardTitle>
                            <CardContent>
                                <Grid>
                                    <GridItem>
                                        <Label>Invoice Number</Label>
                                        <Value>{invoice.customId || invoiceNumber}</Value>
                                    </GridItem>
                                    <GridItem>
                                        <Label>Invoice Date</Label>
                                        <Value>{new Date(invoice.createdAt?.toDate()).toLocaleDateString()}</Value>
                                    </GridItem>
                                    <GridItem>
                                        <Label>Invoice Amount</Label>
                                        <Value>{formatCurrency(invoice.total || 0, invoice.currency)}</Value>
                                    </GridItem>
                                </Grid>
                            </CardContent>
                        </Card>
                    </StepContent>
                );
            default:
                return null;
        }
    };

    return (
        <Container
            as={motion.div}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
        >
            <CloseButton onClick={onClose}>
                <Icon name="close" size={24} />
            </CloseButton>

            <Header>
                <Title>{editMode ? 'Edit Delivery Order' : 'New Delivery Order'}</Title>
            </Header>

            <ProgressBar>
                <ProgressFill style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
            </ProgressBar>

            <StepIndicator>
                <Step $active={currentStep >= 1} $completed={currentStep > 1}>
                    <StepNumber>{currentStep > 1 ? <Icon name="check" size={12} /> : 1}</StepNumber>
                    <StepLabel>Select Invoice</StepLabel>
                </Step>
                <Step $active={currentStep >= 2} $completed={currentStep > 2}>
                    <StepNumber>{currentStep > 2 ? <Icon name="check" size={12} /> : 2}</StepNumber>
                    <StepLabel>Packaging</StepLabel>
                </Step>
                <Step $active={currentStep >= 3}>
                    <StepNumber>3</StepNumber>
                    <StepLabel>Review</StepLabel>
                </Step>
            </StepIndicator>

            <Form onSubmit={handleSubmit}>
                {renderStepContent()}

                <StepActions>
                    {currentStep > 1 && (
                        <BackButton type="button" onClick={goToPreviousStep}>
                            Back
                        </BackButton>
                    )}
                    {currentStep < totalSteps ? (
                        <NextButton 
                            type="button" 
                            onClick={goToNextStep}
                            disabled={currentStep === 1 && !invoice}
                        >
                            Next
                        </NextButton>
                    ) : (
                        <SubmitButton type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : editMode ? 'Save Changes' : 'Create Delivery Order'}
                        </SubmitButton>
                    )}
                </StepActions>
            </Form>
        </Container>
    );
};

export default NewDeliveryOrder; 