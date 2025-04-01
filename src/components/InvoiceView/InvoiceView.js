import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { useReducedMotion } from 'framer-motion';
import { useGlobalContext } from '../App/context';
import Icon from '../shared/Icon/Icon';
import Button from '../shared/Button/Button';
import { formatDate, formatPrice } from '../../utilities/helpers';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import {
    StyledInvoiceView,
    Container,
    MotionLink,
    Controller,
    Text,
    InfoCard,
    InfoHeader,
    InfoGroup,
    InfoID,
    InfoDesc,
    InfoAddresses,
    AddressGroup,
    AddressTitle,
    AddressText,
    Details,
    ItemsHeader,
    HeaderCell,
    Items,
    Item,
    ItemName,
    ItemDescription,
    ItemQty,
    ItemPrice,
    ItemVat,
    ItemTotal,
    Total,
    TotalText,
    TotalAmount,
    MetaInfo,
    MetaItem,
    ActionButtons,
    ButtonWrapper,
    StatusBadge,
    StatusDot,
    TermsSection,
    TermsTitle,
    TermsText,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalIconWrapper,
    ModalTitle,
    ModalText,
    FormGroup,
    FormLabel,
    TextArea,
    ModalActions,
    StatusContainer,
    HeaderSection,
    HeaderTitle,
} from './InvoiceViewStyles';

// Animation variants
const invoiceViewVariants = {
    link: {
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
        exit: { x: -20, opacity: 0, transition: { duration: 0.3 } },
    },
    controller: {
        hidden: { y: -20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.3, delay: 0.1 } },
        exit: { y: -20, opacity: 0, transition: { duration: 0.3 } },
    },
    info: {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.3, delay: 0.2 } },
        exit: { y: 20, opacity: 0, transition: { duration: 0.3 } },
    },
    reduced: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.3 } },
    },
};

const InvoiceView = () => {
    const { 
        invoiceState, 
        windowWidth, 
        handleMarkAsPaid, 
        handleDelete,
        editInvoice,
        toggleModal 
    } = useGlobalContext();
    const { colors } = useTheme();
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [clientData, setClientData] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDirectlyFetching, setIsDirectlyFetching] = useState(false);
    const [isClientFetching, setIsClientFetching] = useState(false);
    const [clientHasVAT, setClientHasVAT] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showVoidModal, setShowVoidModal] = useState(false);
    const [voidReason, setVoidReason] = useState('');
    const [isVoiding, setIsVoiding] = useState(false);
    const isLoading = invoiceState?.isLoading || isDirectlyFetching || isClientFetching;
    const invoiceNotFound = !isLoading && !invoice;
    const isPending = invoice?.status === 'pending';
    const isPartiallyPaid = invoice?.status === 'partially_paid';
    const isPaid = invoice?.status === 'paid';
    const isVoid = invoice?.status === 'void';
    const isDesktop = windowWidth >= 768;
    const shouldReduceMotion = useReducedMotion();
    const history = useHistory();
    const [quotationData, setQuotationData] = useState(null);
    const [isFetchingQuotation, setIsFetchingQuotation] = useState(false);
    
    // Function to generate custom ID if not exists
    const generateCustomId = () => {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return `FTIN${randomNum}`;
    };

    // Variant selector for animations
    const variant = (element) => {
        return shouldReduceMotion
            ? invoiceViewVariants.reduced
            : invoiceViewVariants[element];
    };

    // Set document title
    useEffect(() => {
        document.title = `Invoice | ${invoice?.customId || generateCustomId()}`;
    }, [invoice]);

    // Fetch client data
    const fetchClientData = async (clientId, fallbackName) => {
        try {
            setIsClientFetching(true);
            
            // Function to normalize client names for comparison (lowercase, remove extra spaces)
            const normalizeClientName = (name) => {
                if (!name) return '';
                return name.toLowerCase().trim().replace(/\s+/g, ' ');
            };
            
            // Try to fetch by clientId first
            if (clientId) {
                const clientRef = doc(db, 'clients', clientId);
                const docSnap = await getDoc(clientRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log('Fetched client data:', data); // Debug log
                    setClientData(data);
                    setClientHasVAT(data.hasVAT || false);
                    return;
                }
            }
            
            // If no clientId or client not found by ID, try to find by name
            if (fallbackName) {
                try {
                    // First try exact match
                    const clientsRef = collection(db, 'clients');
                    const q = query(clientsRef, where('companyName', '==', fallbackName));
                    let querySnapshot = await getDocs(q);
                    
                    // If no exact match, try case-insensitive comparison
                    if (querySnapshot.empty) {
                        // Fetch all clients and filter manually
                        const allClientsQuery = query(clientsRef);
                        const allClientsSnapshot = await getDocs(allClientsQuery);
                        
                        if (!allClientsSnapshot.empty) {
                            const availableClients = [];
                            allClientsSnapshot.forEach(doc => {
                                const clientData = doc.data();
                                availableClients.push({
                                    id: doc.id,
                                    name: clientData.companyName || '',
                                    normalizedName: normalizeClientName(clientData.companyName || '')
                                });
                            });
                            
                            // Try to find a client with similar name (case-insensitive)
                            const normalizedSearchName = normalizeClientName(fallbackName);
                            
                            // First try exact match after normalization
                            const exactMatch = availableClients.find(client => 
                                client.normalizedName === normalizedSearchName
                            );
                            
                            if (exactMatch) {
                                const matchDoc = allClientsSnapshot.docs.find(doc => doc.id === exactMatch.id);
                                const data = matchDoc.data();
                                setClientData(data);
                                setClientHasVAT(data.hasVAT || false);
                                return;
                            }
                            
                            // Then try partial matches
                            const partialMatch = availableClients.find(client => 
                                client.normalizedName.includes(normalizedSearchName) || 
                                normalizedSearchName.includes(client.normalizedName)
                            );
                            
                            if (partialMatch) {
                                const matchDoc = allClientsSnapshot.docs.find(doc => doc.id === partialMatch.id);
                                const data = matchDoc.data();
                                setClientData(data);
                                setClientHasVAT(data.hasVAT || false);
                                return;
                            }
                        }
                    } else {
                        const data = querySnapshot.docs[0].data();
                        setClientData(data);
                        setClientHasVAT(data.hasVAT || false);
                        return;
                    }
                } catch (queryError) {
                    console.error('Error querying clients:', queryError);
                }
            }
            
            // If we get here, no match was found - use fallback data
            if (fallbackName === 'UAE Exchange') {
                const mockClient = {
                    name: 'UAE Exchange',
                    address: 'Dubai, UAE',
                    country: 'United Arab Emirates',
                    phone: '+971 4 123 4567',
                    trnNumber: '100399600300003'
                };
                setClientData(mockClient);
                setClientHasVAT(true);
            } else {
                setClientData({ name: fallbackName });
            }
            
        } catch (error) {
            console.error('Error fetching client data:', error);
            // On error, use fallback data
            if (fallbackName === 'UAE Exchange') {
                const mockClient = {
                    name: 'UAE Exchange',
                    address: 'Dubai, UAE',
                    country: 'United Arab Emirates',
                    phone: '+971 4 123 4567',
                    trnNumber: '100399600300003'
                };
                setClientData(mockClient);
                setClientHasVAT(true);
            } else {
                setClientData({ name: fallbackName });
            }
        } finally {
            setIsClientFetching(false);
        }
    };

    // Add a function to fetch directly from Firebase if needed
    const fetchDirectlyFromFirebase = async (invoiceId) => {
        try {
            setIsDirectlyFetching(true);
            
            const invoiceRef = doc(db, 'invoices', invoiceId);
            const docSnap = await getDoc(invoiceRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log('Fetched invoice data:', data); // Debug log
                
                // Convert Firestore Timestamp back to Date object safely
                let createdAt = new Date();
                let paymentDue = new Date();
                
                try {
                    createdAt = data.createdAt?.toDate() || new Date();
                    paymentDue = data.paymentDue?.toDate() || new Date();
                } catch (dateError) {
                    // Handle date error silently
                }
                
                // Create a complete invoice object
                const fetchedInvoice = {
                    ...data,
                    id: docSnap.id,
                    customId: data.customId || generateCustomId(),
                    createdAt,
                    paymentDue,
                    items: Array.isArray(data.items) ? data.items : [],
                    currency: data.currency || 'USD'
                };
                
                setInvoice(fetchedInvoice);
                
                // Fetch client data from the clients collection
                if (data.clientId) {
                    console.log('Fetching client data for ID:', data.clientId); // Debug log
                    const clientRef = doc(db, 'clients', data.clientId);
                    const clientSnap = await getDoc(clientRef);
                    
                    if (clientSnap.exists()) {
                        const clientData = clientSnap.data();
                        console.log('Fetched client data:', clientData); // Debug log
                        setClientData(clientData);
                        setClientHasVAT(clientData.hasVAT || false);
                    } else {
                        console.log('No client found with ID:', data.clientId); // Debug log
                        // If no client found, try to find by name
                        await fetchClientData(null, data.clientName);
                    }
                } else {
                    console.log('No client ID found in invoice data'); // Debug log
                    // If no client ID, try to find by name
                    await fetchClientData(null, data.clientName);
                }
                
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error fetching invoice data:', error);
            return false;
        } finally {
            setIsDirectlyFetching(false);
        }
    };
    
    // Trigger fetch of invoice data
    useEffect(() => {
        // This will try to fetch directly from Firebase as soon as we have an ID
        if (id && !invoice && !isDirectlyFetching) {
            fetchDirectlyFromFirebase(id);
        }
    }, [id, invoice, isDirectlyFetching]);

    // Lookup in state logic
    useEffect(() => {
        if (!invoiceState) {
            return;
        }
        
        // Get invoices from state
        const invoices = invoiceState.invoices || [];
        
        if (invoices.length > 0 && !isDeleting && !invoice) {
            // First try to find by direct ID match
            let foundInvoice = invoices.find(inv => inv.id === id);
            
            // If not found, try matching by customId (in case IDs are stored differently)
            if (!foundInvoice) {
                foundInvoice = invoices.find(inv => inv.customId === id);
            }
            
            if (foundInvoice) {
            setInvoice(foundInvoice);
                
                // After setting invoice, fetch client data
                fetchClientData(foundInvoice.clientId, foundInvoice.clientName);
            }
        }
    }, [invoiceState?.invoices, id, isDeleting]);

    // Handle invoice deletion
    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        try {
            toggleModal(id, 'delete');
            await handleDelete();
            history.push('/invoices');
        } catch (error) {
            console.error('Error deleting invoice:', error);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    // Handle status change
    const handleStatusChange = async (newStatus) => {
        try {
            if (newStatus === 'paid') {
                toggleModal(id, 'status');
                await handleMarkAsPaid();
            } else if (newStatus === 'edit') {
                editInvoice(id);
            }
        } catch (error) {
            console.error('Error updating invoice status:', error);
        }
    };

    // Calculate total amount with or without VAT
    const calculateTotals = () => {
        const subtotal = invoice.items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
        
        if (clientHasVAT) {
            const vatAmount = subtotal * 0.05;
            const grandTotal = subtotal + vatAmount;
            return { subtotal, vatAmount, grandTotal };
        }
        
        return { subtotal, vatAmount: 0, grandTotal: subtotal };
    };

    const calculateVAT = (amount) => {
        return amount * 0.05;
    };

    const calculateTotalWithVAT = (amount) => {
        return amount * 1.05;
    };

    // Render client section
    const renderClientSection = () => {
        console.log('Current client data:', clientData); // Debug log
        
        // Check for TRN in various possible field names
        const clientTRN = 
            clientData?.trn || 
            clientData?.TRN || 
            clientData?.trnNumber ||
            clientData?.taxRegistrationNumber || 
            clientData?.tax_registration_number ||
            clientData?.taxNumber ||
            invoice?.clientTRN;
            
        // Check if client is from UAE
        const isUAE = clientData?.country?.toLowerCase().includes('emirates') || 
                      clientData?.country?.toLowerCase().includes('uae');

        return (
            <AddressGroup>
                <AddressTitle>Bill To</AddressTitle>
                <AddressText>
                    <strong>{clientData?.name || invoice.clientName}</strong><br />
                    {clientData?.address}<br />
                    {clientData?.country}<br />
                    {clientData?.phone}<br />
                    {isUAE && clientTRN && (
                        <span style={{ fontWeight: '600' }}>
                            TRN: {clientTRN}
                        </span>
                    )}
                </AddressText>
            </AddressGroup>
        );
    };

    // Add function to fetch quotation data
    const fetchQuotationData = async (quotationId) => {
        if (!quotationId) return;
        
        try {
            setIsFetchingQuotation(true);
            const quotationRef = doc(db, 'quotations', quotationId);
            const docSnap = await getDoc(quotationRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                setQuotationData({
                    id: docSnap.id,
                    customId: data.customId || docSnap.id
                });
            }
        } catch (error) {
            console.error('Error fetching quotation data:', error);
        } finally {
            setIsFetchingQuotation(false);
        }
    };

    // Add useEffect to fetch quotation data when invoice loads
    useEffect(() => {
        if (invoice?.quotationId) {
            fetchQuotationData(invoice.quotationId);
        }
    }, [invoice?.quotationId]);

    // Handle void invoice
    const handleVoidClick = () => {
        setShowVoidModal(true);
    };

    const handleVoidConfirm = async () => {
        if (!voidReason.trim()) {
            alert('Please provide a reason for voiding the invoice');
            return;
        }

        setIsVoiding(true);
        try {
            const invoiceRef = doc(db, 'invoices', id);
            await updateDoc(invoiceRef, {
                status: 'void',
                voidReason: voidReason,
                voidDate: new Date(),
                lastModified: new Date()
            });
            
            // Update local state
            setInvoice(prev => ({
                ...prev,
                status: 'void',
                voidReason: voidReason,
                voidDate: new Date()
            }));
            
            setShowVoidModal(false);
        } catch (error) {
            console.error('Error voiding invoice:', error);
            alert('There was an error voiding the invoice. Please try again.');
        } finally {
            setIsVoiding(false);
        }
    };

    // Show loading state
    if (isLoading || !invoice) {
        return (
            <StyledInvoiceView className="StyledInvoiceView">
                <Container>
                    <MotionLink
                        to="/invoices"
                        variants={variant('link')}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="MotionLink"
                        style={{ marginBottom: '28px' }}
                    >
                        <Icon name={'arrow-left'} size={10} color={colors.purple} />
                        Go back
                    </MotionLink>
                    
                    <Controller
                        variants={variant('controller')}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="Controller"
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Text>Loading invoice...</Text>
                            <div style={{ marginLeft: 16, width: 16, height: 16 }} className="loading-spinner"></div>
                        </div>
                    </Controller>
                </Container>
            </StyledInvoiceView>
        );
    }

    const { subtotal, vatAmount, grandTotal } = calculateTotals();

    return (
        <StyledInvoiceView>
            <Container>
                <MotionLink
                    to="/invoices"
                    variants={variant('link')}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <Icon name="arrow-left" size={16} color="inherit" />
                    Go back
                </MotionLink>

                <HeaderSection>
                    <HeaderTitle>Invoice</HeaderTitle>
                </HeaderSection>

                <Controller
                    variants={variant('controller')}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <StatusContainer>
                        <Text>Status</Text>
                        <StatusBadge currStatus={invoice.status}>
                            <StatusDot currStatus={invoice.status} />
                            {invoice.status === 'partially_paid' ? 'Partially Paid' : 
                             invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </StatusBadge>
                    </StatusContainer>

                    {isDesktop && (
                        <ButtonWrapper>
                            {!isVoid && !isPaid && (
                                <>
                                    {isPending && (
                                        <>
                                            <Button
                                                $primary
                                                onClick={() => handleStatusChange('partially_paid')}
                                                disabled={isLoading}
                                                data-action="partially-paid"
                                                style={{
                                                    backgroundColor: colors.orange,
                                                    border: 'none'
                                                }}
                                            >
                                                <Icon 
                                                    name="clock" 
                                                    size={14} 
                                                    color="white"
                                                />
                                                <span>Partially Paid</span>
                                            </Button>
                                            <Button
                                                $primary
                                                onClick={() => {/* TODO: Implement DO generation */}}
                                                disabled={isLoading}
                                                data-action="generate-do"
                                                style={{
                                                    backgroundColor: colors.purple,
                                                    border: 'none'
                                                }}
                                            >
                                                <Icon 
                                                    name="file-text" 
                                                    size={14} 
                                                    color="white"
                                                />
                                                <span>Generate DO</span>
                                            </Button>
                                        </>
                                    )}
                                    {(isPending || isPartiallyPaid) && (
                                        <Button
                                            $primary
                                            onClick={() => handleStatusChange('paid')}
                                            disabled={isLoading}
                                            data-action="mark-paid"
                                            style={{
                                                backgroundColor: colors.green,
                                                border: 'none'
                                            }}
                                        >
                                            <Icon 
                                                name="check" 
                                                size={14} 
                                                color="white"
                                            />
                                            <span>Mark Paid</span>
                                        </Button>
                                    )}
                                    <Button
                                        $delete
                                        onClick={handleVoidClick}
                                        disabled={isLoading}
                                        data-action="void"
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: `1px solid ${colors.red}`,
                                            color: colors.red
                                        }}
                                    >
                                        <Icon 
                                            name="x" 
                                            size={14} 
                                            color={colors.red}
                                        />
                                        <span>Void</span>
                                    </Button>
                                </>
                            )}
                        </ButtonWrapper>
                    )}
                </Controller>

                <InfoCard
                    id="invoice-content"
                    variants={variant('info')}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="InfoCard"
                >
                    <InfoHeader>
                        <InfoGroup>
                            <InfoID>
                                <span>#</span>{invoice.customId}
                            </InfoID>
                            <InfoDesc>{invoice.description || 'No description'}</InfoDesc>
                            {invoice.quotationId && (
                                <span style={{ 
                                    color: colors.textTertiary,
                                    fontSize: '13px',
                                    display: 'block',
                                    marginTop: '4px'
                                }}>
                                    <Icon 
                                        name="arrow-right" 
                                        size={12} 
                                        color={colors.textTertiary}
                                        style={{ marginRight: '8px', verticalAlign: 'middle' }}
                                    />
                                    Converted from Quotation: 
                                    <MotionLink
                                        to={`/quotation/${invoice.quotationId}`}
                                        style={{ 
                                            color: 'white',
                                            textDecoration: 'none',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            marginLeft: '4px',
                                            verticalAlign: 'middle'
                                        }}
                                    >
                                        #{isFetchingQuotation ? 'Loading...' : (quotationData?.customId || invoice.quotationId)}
                                    </MotionLink>
                                </span>
                            )}
                            <MetaInfo>
                                <MetaItem>
                                    <Icon name="calendar" size={13} />
                                    Created: {formatDate(invoice.createdAt)}
                                </MetaItem>
                                <MetaItem>
                                    <Icon name="calendar" size={13} />
                                    Due: {formatDate(invoice.paymentDue)}
                                </MetaItem>
                            </MetaInfo>
                        </InfoGroup>
                    </InfoHeader>
                    
                    <InfoAddresses className="InfoAddresses">
                        {renderClientSection()}
                        
                        <AddressGroup align="right">
                            <AddressTitle>Invoice #</AddressTitle>
                            <AddressText>
                                {invoice.customId}
                            </AddressText>
                            <br />
                            <AddressTitle>Payment Due</AddressTitle>
                            <AddressText>
                                {formatDate(invoice.paymentDue)}
                            </AddressText>
                        </AddressGroup>
                    </InfoAddresses>
                    
                    {invoice.clientEmail && (
                        <AddressGroup>
                            <AddressTitle>Sent to</AddressTitle>
                            <AddressText>
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    <Icon name="mail" size={13} style={{ marginRight: '6px', color: colors.purple }} />
                                    {invoice.clientEmail}
                                </span>
                            </AddressText>
                        </AddressGroup>
                    )}
                    
                    <Details className="Details">
                        <ItemsHeader className="ItemsHeader" showVat={clientHasVAT}>
                            <HeaderCell>Item Name</HeaderCell>
                            <HeaderCell>QTY.</HeaderCell>
                            <HeaderCell>Price</HeaderCell>
                            {clientHasVAT && <HeaderCell>VAT (5%)</HeaderCell>}
                            <HeaderCell>Total</HeaderCell>
                        </ItemsHeader>
                        
                        <Items>
                            {invoice.items && invoice.items.map((item, index) => {
                                const itemVAT = clientHasVAT ? calculateVAT(item.total || 0) : 0;
                                
                                return (
                                    <Item key={index} showVat={clientHasVAT}>
                                        <div className="item-details">
                                            <ItemName>{item.name}</ItemName>
                                            {item.description && (
                                                <ItemDescription>{item.description}</ItemDescription>
                                            )}
                                            <div className="item-mobile-details">
                                                <span>
                                                    {item.quantity || 0} × {formatPrice(item.price || 0, invoice.currency)}
                                                    {clientHasVAT && ` (+${formatPrice(itemVAT, invoice.currency)} VAT)`}
                                                </span>
                                            </div>
                                        </div>
                                        <ItemQty>{item.quantity || 0}</ItemQty>
                                        <ItemPrice>
                                            {formatPrice(item.price || 0, invoice.currency)}
                                        </ItemPrice>
                                        {clientHasVAT && (
                                            <ItemVat>
                                                {formatPrice(itemVAT, invoice.currency)}
                                            </ItemVat>
                                        )}
                                        <ItemTotal>
                                            {formatPrice(clientHasVAT ? 
                                                calculateTotalWithVAT(item.total || 0) : 
                                                (item.total || 0), 
                                            invoice.currency)}
                                        </ItemTotal>
                                    </Item>
                                );
                            })}
                        </Items>
                        
                        <Total className="Total">
                            <div>
                                <TotalText>Grand Total</TotalText>
                                {clientHasVAT && (
                                    <div style={{ marginTop: '4px', fontSize: '11px', opacity: 0.8, color: 'white' }}>
                                        Includes VAT: {formatPrice(vatAmount, invoice.currency)}
                                    </div>
                                )}
                            </div>
                            <TotalAmount>
                                {formatPrice(grandTotal, invoice.currency)}
                            </TotalAmount>
                        </Total>
                    </Details>
                    
                    {/* Terms and conditions section */}
                    {invoice.termsAndConditions && (
                        <TermsSection className="TermsSection">
                            <TermsTitle>Terms and Conditions</TermsTitle>
                            <TermsText>{invoice.termsAndConditions}</TermsText>
                        </TermsSection>
                    )}
                </InfoCard>
            </Container>

            {/* Mobile action buttons */}
            {!isDesktop && (
                <ButtonWrapper>
                    {!isVoid && !isPaid && (
                        <>
                            {isPending && (
                                <>
                                    <Button
                                        $primary
                                        onClick={() => handleStatusChange('partially_paid')}
                                        disabled={isLoading}
                                        data-action="partially-paid"
                                        style={{
                                            backgroundColor: colors.orange,
                                            border: 'none'
                                        }}
                                    >
                                        <Icon 
                                            name="clock" 
                                            size={14} 
                                            color="white"
                                        />
                                        <span>Partially Paid</span>
                                    </Button>
                                    <Button
                                        $primary
                                        onClick={() => {/* TODO: Implement DO generation */}}
                                        disabled={isLoading}
                                        data-action="generate-do"
                                        style={{
                                            backgroundColor: colors.purple,
                                            border: 'none'
                                        }}
                                    >
                                        <Icon 
                                            name="file-text" 
                                            size={14} 
                                            color="white"
                                        />
                                        <span>Generate DO</span>
                                    </Button>
                                </>
                            )}
                            {(isPending || isPartiallyPaid) && (
                                <Button
                                    $primary
                                    onClick={() => handleStatusChange('paid')}
                                    disabled={isLoading}
                                    data-action="mark-paid"
                                    style={{
                                        backgroundColor: colors.green,
                                        border: 'none'
                                    }}
                                >
                                    <Icon 
                                        name="check" 
                                        size={14} 
                                        color="white"
                                    />
                                    <span>Mark Paid</span>
                                </Button>
                            )}
                            <Button
                                $delete
                                onClick={handleVoidClick}
                                disabled={isLoading}
                                data-action="void"
                                style={{
                                    backgroundColor: 'transparent',
                                    border: `1px solid ${colors.red}`,
                                    color: colors.red
                                }}
                            >
                                <Icon 
                                    name="x" 
                                    size={14} 
                                    color={colors.red}
                                />
                                <span>Void</span>
                            </Button>
                        </>
                    )}
                </ButtonWrapper>
            )}

            {/* Void Confirmation Modal */}
            {showVoidModal && (
                <ModalOverlay>
                    <ModalContent>
                        <ModalHeader>
                            <ModalIconWrapper>
                                <Icon name="trash" size={20} color="#FF4806" />
                            </ModalIconWrapper>
                            <ModalTitle>Void Invoice</ModalTitle>
                        </ModalHeader>
                        
                        <ModalText>
                            Are you sure you want to void invoice #{invoice?.customId || id}?
                            This action cannot be undone and the invoice will be marked as void.
                        </ModalText>

                        <FormGroup>
                            <FormLabel htmlFor="voidReason">
                                Reason for voiding (required)
                            </FormLabel>
                            <TextArea
                                id="voidReason"
                                value={voidReason}
                                onChange={(e) => setVoidReason(e.target.value)}
                                placeholder="Please provide a reason for voiding this invoice..."
                                autoFocus
                            />
                        </FormGroup>

                        <ModalActions>
                            <Button
                                onClick={() => {
                                    setShowVoidModal(false);
                                    setVoidReason('');
                                }}
                                $secondary
                                style={{ minWidth: '100px' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleVoidConfirm}
                                $delete
                                style={{ minWidth: '100px' }}
                                disabled={isVoiding || !voidReason.trim()}
                            >
                                {isVoiding ? (
                                    <>
                                        <Icon name="loading" size={16} color="white" />
                                        Voiding...
                                    </>
                                ) : (
                                    'Void Invoice'
                                )}
                            </Button>
                        </ModalActions>
                    </ModalContent>
                </ModalOverlay>
            )}
        </StyledInvoiceView>
    );
};

export default InvoiceView;
