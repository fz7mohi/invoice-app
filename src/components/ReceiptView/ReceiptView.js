import { useEffect, useState } from 'react';
import { useParams, Redirect, useHistory, Link } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { useReducedMotion } from 'framer-motion';
import Icon from '../shared/Icon/Icon';
import Status from '../shared/Status/Status';
import Button from '../shared/Button/Button';
import { formatDate, formatPrice } from '../../utilities/helpers';
import { useGlobalContext } from '../App/context';
import './ReceiptView.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
    StyledReceiptView,
    Container,
    MotionLink,
    Controller,
    Text,
    ButtonWrapper,
    InfoCard,
    InfoHeader,
    InfoID,
    InfoDesc,
    InfoGroup,
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
    TermsSection,
    TermsTitle,
    TermsText,
    StatusBadge,
    MetaInfo,
    MetaItem,
    DownloadButton,
    ActionButtons,
    StatusDot,
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
} from './ReceiptViewStyles';
import { doc, getDoc, collection, query, where, getDocs, deleteDoc, addDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

// Use same variants as quotations for consistent animations
const receiptViewVariants = {
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

const ReceiptView = () => {
    const { receiptState, toggleReceiptModal, editReceipt, windowWidth, refreshReceipts } = useGlobalContext();
    const { colors } = useTheme();
    const { id } = useParams();
    const [receipt, setReceipt] = useState(null);
    const [clientData, setClientData] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDirectlyFetching, setIsDirectlyFetching] = useState(false);
    const [isClientFetching, setIsClientFetching] = useState(false);
    const [clientHasVAT, setClientHasVAT] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const isLoading = receiptState?.isLoading || isDirectlyFetching || isClientFetching;
    const receiptNotFound = !isLoading && !receipt;
    const isDesktop = windowWidth >= 768;
    const shouldReduceMotion = useReducedMotion();
    const history = useHistory();
    
    // Variant selector for animations
    const variant = (element) => {
        return shouldReduceMotion
            ? receiptViewVariants.reduced
            : receiptViewVariants[element];
    };

    // Set document title
    useEffect(() => {
        document.title = `Receipt | ${receipt?.customId || id}`;
    }, [receipt, id]);

    // Fetch client data
    const fetchClientData = async (clientId, clientName) => {
        if (!clientId && !clientName) return;
        
        try {
            setIsClientFetching(true);
            
            // Try to fetch from clients collection first
            if (clientId) {
                const clientRef = doc(db, 'clients', clientId);
                const clientSnap = await getDoc(clientRef);
                
                if (clientSnap.exists()) {
                    const data = clientSnap.data();
                    setClientData(data);
                    setClientHasVAT(data.hasVAT || false);
                    return;
                }
            }
            
            // If no client found by ID, try to find by name
            if (clientName) {
                const clientsRef = collection(db, 'clients');
                const q = query(clientsRef, where('name', '==', clientName));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    const data = querySnapshot.docs[0].data();
                    setClientData(data);
                    setClientHasVAT(data.hasVAT || false);
                }
            }
        } catch (error) {
            console.error('Error fetching client data:', error);
        } finally {
            setIsClientFetching(false);
        }
    };

    // Add a function to fetch directly from Firebase if needed
    const fetchDirectlyFromFirebase = async (receiptId) => {
        try {
            setIsDirectlyFetching(true);
            
            const receiptRef = doc(db, 'receipts', receiptId);
            const docSnap = await getDoc(receiptRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                
                // Convert Firestore Timestamp back to Date object safely
                let createdAt = new Date();
                let paymentDate = new Date();
                
                try {
                    createdAt = data.createdAt?.toDate() || new Date();
                    paymentDate = data.paymentDate?.toDate() || new Date();
                } catch (dateError) {
                    // Handle date error silently
                }
                
                // Create a complete receipt object
                const fetchedReceipt = {
                    ...data,
                    id: docSnap.id,
                    customId: data.customId || docSnap.id,
                    createdAt,
                    paymentDate,
                    items: Array.isArray(data.items) ? data.items : [],
                    currency: data.currency || 'USD'
                };
                
                setReceipt(fetchedReceipt);
                
                // After fetching receipt, fetch client data
                await fetchClientData(fetchedReceipt.clientId, fetchedReceipt.clientName);
                
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        } finally {
            setIsDirectlyFetching(false);
        }
    };
    
    // Trigger fetch of receipt data
    useEffect(() => {
        // This will try to fetch directly from Firebase as soon as we have an ID
        if (id && !receipt && !isDirectlyFetching) {
            fetchDirectlyFromFirebase(id);
        }
    }, [id, receipt, isDirectlyFetching]);

    // Lookup in state logic
    useEffect(() => {
        if (!receiptState) {
            return;
        }
        
        // Get receipts from state
        const receipts = receiptState.receipts || [];
        
        if (receipts.length > 0 && !isDeleting && !receipt) {
            // First try to find by direct ID match
            let foundReceipt = receipts.find(r => r.id === id);
            
            // If not found, try matching by customId (in case IDs are stored differently)
            if (!foundReceipt) {
                foundReceipt = receipts.find(r => r.customId === id);
            }
            
            if (foundReceipt) {
                setReceipt(foundReceipt);
                
                // After setting receipt, fetch client data
                fetchClientData(foundReceipt.clientId, foundReceipt.clientName);
            }
        }
    }, [receiptState?.receipts, id, isDeleting]);

    // Handle download PDF
    const handleDownloadPDF = async () => {
        const element = document.getElementById('receipt-content');
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: colors.cardBg
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`receipt-${receipt.customId || receipt.id}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    // Handle edit click
    const handleEditClick = () => {
        if (receipt) {
            editReceipt(receipt);
            toggleReceiptModal();
        }
    };

    // Add handleDeleteClick function
    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            const receiptRef = doc(db, 'receipts', id);
            await deleteDoc(receiptRef);
            history.push('/receipts');
        } catch (error) {
            console.error('Error deleting receipt:', error);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    // Show loading state
    if (isLoading || !receipt) {
        return (
            <StyledReceiptView className="StyledReceiptView">
                <Container>
                    <MotionLink
                        to="/receipts"
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
                    
                    <HeaderSection>
                        <HeaderTitle>Receipt</HeaderTitle>
                    </HeaderSection>
                    
                    <Controller
                        variants={variant('controller')}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="Controller"
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Text>Loading receipt...</Text>
                            <div style={{ marginLeft: 16, width: 16, height: 16 }} className="loading-spinner"></div>
                        </div>
                    </Controller>
                </Container>
            </StyledReceiptView>
        );
    }

    // Calculate total amount with or without VAT
    const calculateTotals = () => {
        const subtotal = receipt.items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
        
        if (clientHasVAT) {
            const vatAmount = subtotal * 0.05;
            const grandTotal = subtotal + vatAmount;
            return { subtotal, vatAmount, grandTotal };
        }
        
        return { subtotal, vatAmount: 0, grandTotal: subtotal };
    };

    const { subtotal, vatAmount, grandTotal } = calculateTotals();

    // Calculate VAT for a single item
    const calculateVAT = (amount) => {
        return clientHasVAT ? amount * 0.05 : 0;
    };

    // Calculate total with VAT for a single item
    const calculateTotalWithVAT = (amount) => {
        return clientHasVAT ? amount * 1.05 : amount;
    };

    return (
        <StyledReceiptView className="StyledReceiptView">
            <Container>
                <MotionLink
                    to="/receipts"
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
                
                <HeaderSection>
                    <HeaderTitle>Receipt</HeaderTitle>
                </HeaderSection>
                
                {/* Status bar with action buttons */}
                <Controller
                    variants={variant('controller')}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="Controller"
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <StatusBadge status={receipt.status}>
                            <span>
                                {receipt.status === 'paid' ? 'Paid' : 'Pending'}
                            </span>
                        </StatusBadge>
                        <DownloadButton onClick={handleDownloadPDF} className="DownloadButton">
                            <Icon name="download" size={13} />
                            Share
                        </DownloadButton>
                    </div>
                    
                    {isDesktop && (
                        <ButtonWrapper className="ButtonWrapper">
                            <Button
                                $secondary
                                onClick={handleEditClick}
                                disabled={isLoading}
                            >
                                Edit
                            </Button>
                            <Button
                                $delete
                                onClick={handleDeleteClick}
                                disabled={isLoading}
                            >
                                Delete
                            </Button>
                        </ButtonWrapper>
                    )}
                </Controller>

                {/* Receipt content */}
                <InfoCard
                    id="receipt-content"
                    variants={variant('info')}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="InfoCard"
                >
                    <InfoHeader>
                        <InfoGroup>
                            <InfoID>
                                <span>#</span>{receipt.customId}
                            </InfoID>
                            <InfoDesc>{receipt.description || 'No description'}</InfoDesc>
                            <MetaInfo>
                                <MetaItem>
                                    <Icon name="calendar" size={13} />
                                    Created: {formatDate(receipt.createdAt)}
                                </MetaItem>
                                <MetaItem>
                                    <Icon name="calendar" size={13} />
                                    Payment Date: {formatDate(receipt.paymentDate)}
                                </MetaItem>
                            </MetaInfo>
                        </InfoGroup>
                    </InfoHeader>
                    
                    <InfoAddresses className="InfoAddresses">
                        <AddressGroup>
                            <AddressTitle>Bill To</AddressTitle>
                            <AddressText>
                                <strong>{receipt.clientName}</strong>
                                {(clientData?.address || receipt.clientAddress?.street) && (
                                    <>
                                        <br />
                                        {clientData?.address || receipt.clientAddress?.street}
                                    </>
                                )}
                                {receipt.clientAddress?.city && `, ${receipt.clientAddress.city}`}
                                {receipt.clientAddress?.postCode && `, ${receipt.clientAddress.postCode}`}
                                {(clientData?.country || receipt.clientAddress?.country) && `, ${clientData?.country || receipt.clientAddress?.country}`}
                                {clientData?.phone && (
                                    <>
                                        <br />
                                        {clientData.phone}
                                    </>
                                )}
                                {clientData?.hasVAT && clientData?.trn && (
                                    <>
                                        <br />
                                        <span style={{ fontWeight: '600' }}>
                                            TRN: {clientData.trn}
                                        </span>
                                    </>
                                )}
                            </AddressText>
                        </AddressGroup>
                        
                        <AddressGroup align="right">
                            <AddressTitle>Receipt #</AddressTitle>
                            <AddressText>
                                {receipt.customId || receipt.id}
                            </AddressText>
                            <br />
                            <AddressTitle>Payment Date</AddressTitle>
                            <AddressText>
                                {formatDate(receipt.paymentDate)}
                            </AddressText>
                        </AddressGroup>
                    </InfoAddresses>
                    
                    {receipt.clientEmail && (
                        <AddressGroup>
                            <AddressTitle>Sent to</AddressTitle>
                            <AddressText>
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    <Icon name="mail" size={13} style={{ marginRight: '6px', color: colors.purple }} />
                                    {receipt.clientEmail}
                                </span>
                            </AddressText>
                        </AddressGroup>
                    )}
                    
                    {/* Items section */}
                    <Details className="Details">
                        <ItemsHeader className="ItemsHeader" showVat={clientHasVAT}>
                            <HeaderCell>Item Name</HeaderCell>
                            <HeaderCell>QTY.</HeaderCell>
                            <HeaderCell>Price</HeaderCell>
                            {clientHasVAT && <HeaderCell>VAT (5%)</HeaderCell>}
                            <HeaderCell>Total</HeaderCell>
                        </ItemsHeader>
                        
                        <Items>
                            {receipt.items && receipt.items.map((item, index) => {
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
                                                    {item.quantity || 0} × {formatPrice(item.price || 0, receipt.currency)}
                                                    {clientHasVAT && ` (+${formatPrice(itemVAT, receipt.currency)} VAT)`}
                                                </span>
                                            </div>
                                        </div>
                                        <ItemQty>{item.quantity || 0}</ItemQty>
                                        <ItemPrice>
                                            {formatPrice(item.price || 0, receipt.currency)}
                                        </ItemPrice>
                                        {clientHasVAT && (
                                            <ItemVat>
                                                {formatPrice(itemVAT, receipt.currency)}
                                            </ItemVat>
                                        )}
                                        <ItemTotal>
                                            {formatPrice(clientHasVAT ? 
                                                calculateTotalWithVAT(item.total || 0) : 
                                                (item.total || 0), 
                                            receipt.currency)}
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
                                        Includes VAT: {formatPrice(vatAmount, receipt.currency)}
                                    </div>
                                )}
                            </div>
                            <TotalAmount>
                                {formatPrice(grandTotal, receipt.currency)}
                            </TotalAmount>
                        </Total>
                    </Details>
                    
                    {/* Terms and conditions section */}
                    {receipt.termsAndConditions && (
                        <TermsSection className="TermsSection">
                            <TermsTitle>Terms and Conditions</TermsTitle>
                            <TermsText>{receipt.termsAndConditions}</TermsText>
                        </TermsSection>
                    )}
                </InfoCard>
            </Container>
            
            {/* Mobile action buttons */}
            {!isDesktop && (
                <ButtonWrapper className="ButtonWrapper">
                    <Button
                        $secondary
                        onClick={handleEditClick}
                        disabled={isLoading}
                    >
                        Edit
                    </Button>
                    <Button
                        $delete
                        onClick={handleDeleteClick}
                        disabled={isLoading}
                    >
                        Delete
                    </Button>
                </ButtonWrapper>
            )}
            
            {/* Delete confirmation modal */}
            {showDeleteModal && (
                <ModalOverlay>
                    <ModalContent>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            marginBottom: '1.5rem',
                            gap: '12px'
                        }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                backgroundColor: '#FFE5E5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Icon name="trash" size={18} color="#FF4806" />
                            </div>
                            <h2 style={{ 
                                margin: 0,
                                fontSize: '1.25rem',
                                color: colors.text,
                                fontWeight: '600'
                            }}>Delete Receipt</h2>
                        </div>
                        <p style={{ 
                            marginBottom: '2rem',
                            color: colors.text,
                            fontSize: '0.95rem',
                            lineHeight: '1.5',
                            opacity: 0.8
                        }}>
                            Are you sure you want to delete receipt #{receipt?.customId || id}?
                        </p>
                        <ModalActions>
                            <Button
                                $secondary
                                onClick={() => setShowDeleteModal(false)}
                                style={{ marginRight: '8px' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                $delete
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                            >
                                Delete
                            </Button>
                        </ModalActions>
                    </ModalContent>
                </ModalOverlay>
            )}
        </StyledReceiptView>
    );
};

export default ReceiptView; 