import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, getDoc, updateDoc, collection, getDocs, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useGlobalContext } from '../../App/context';
import { formatDate, formatPrice, calculateVAT, generateCustomId } from '../../../utilities/helpers';
import Modal from '../../Modal/Modal';
import Icon from '../../shared/Icon/Icon';
import { useTheme } from 'styled-components';
import EmailPreviewModal from '../../shared/EmailPreviewModal/EmailPreviewModal';
import Button from '../../shared/Button/Button';
import {
    Container,
    StyledInternalPOView,
    Controller,
    Text,
    StatusContainer,
    StatusBadge,
    StatusDot,
    ActionButtons,
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
    ButtonWrapper,
    PaymentDetailsSection,
    PaymentDetailsHeader,
    PaymentDetailsTitle,
    PaymentDetailsGrid,
    PaymentDetailItem,
    PaymentDetailLabel,
    PaymentDetailValue,
    CreateReceiptButton,
    ReceiptTimeline,
    ReceiptTimelineTitle,
    ReceiptItem,
    ReceiptInfo,
    ReceiptNumber,
    ReceiptDetails,
    ReceiptAmount,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalIconWrapper,
    ModalTitle,
    ModalText,
    FormGroup,
    FormLabel,
    FormInput,
    FormTextArea,
    ModalActions,
    PaymentModalContent,
    PaymentForm,
    FormRow,
    PaymentFormLabel,
    Link,
    BankDetailsSection,
    BankDetailsTitle,
    BankDetailsGrid,
    BankDetailItem,
    BankDetailLabel,
    BankDetailValue,
    HeaderSection,
    HeaderTitle,
    DownloadButton,
    InfoSectionsGrid,
    TermsSection,
    TermsHeader,
    TermsTitle,
    TermsActions
} from './InternalPOViewStyles';

const defaultTermsAndConditions = `1. Payment is due within 30 days
2. Please include invoice number on payment
3. Bank transfer is preferred method of payment`;

const InternalPOView = () => {
    const { id } = useParams();
    const history = useHistory();
    const theme = useTheme();
    const { colors, windowWidth, showNotification } = useGlobalContext();
    const [internalPO, setInternalPO] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showVoidModal, setShowVoidModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [receipts, setReceipts] = useState([]);
    const [companyProfile, setCompanyProfile] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [newTerms, setNewTerms] = useState('');
    const [quotationData, setQuotationData] = useState(null);
    const [isFetchingQuotation, setIsFetchingQuotation] = useState(false);
    const [isEditingTerms, setIsEditingTerms] = useState(false);
    const [editedTerms, setEditedTerms] = useState('');
    const [isEditingDueDate, setIsEditingDueDate] = useState(false);
    const [editedDueDate, setEditedDueDate] = useState('');
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [emailData, setEmailData] = useState(null);
    const [pdfData, setPdfData] = useState(null);
    const [voidReason, setVoidReason] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDirectlyFetching, setIsDirectlyFetching] = useState(false);
    const [clientData, setClientData] = useState(null);
    const [clientHasVAT, setClientHasVAT] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);
    const isDesktop = windowWidth >= 768;

    const fetchClientData = async (clientId, fallbackName) => {
        if (!clientId) return;

        try {
            const clientDoc = await getDoc(doc(db, 'clients', clientId));
            if (clientDoc.exists()) {
                const data = clientDoc.data();
                setClientData(data);
                const isUAE = data.country?.toLowerCase().includes('emirates') || 
                             data.country?.toLowerCase().includes('uae');
                setClientHasVAT(isUAE || data.hasVAT || false);
                return;
            }

            // If no direct match, try searching by name
            const clientsRef = collection(db, 'clients');
            const q = query(clientsRef, where('name', '>=', fallbackName), where('name', '<=', fallbackName + '\uf8ff'));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const data = querySnapshot.docs[0].data();
                setClientData(data);
                const isUAE = data.country?.toLowerCase().includes('emirates') || 
                             data.country?.toLowerCase().includes('uae');
                setClientHasVAT(isUAE || data.hasVAT || false);
            }
        } catch (err) {
            console.error('Error fetching client data:', err);
        }
    };

    useEffect(() => {
        const fetchInternalPOData = async () => {
            try {
                setLoading(true);
                setError(null);
                const internalPODoc = await getDoc(doc(db, 'internalPOs', id));
                
                if (!internalPODoc.exists()) {
                    setError('Internal PO not found');
                    setLoading(false);
                    return;
                }

                const data = internalPODoc.data();
                setInternalPO({
                    id: internalPODoc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate(),
                    paymentDue: data.paymentDue?.toDate()
                });

                // Fetch invoice data if available
                if (data.invoiceId) {
                    const invoiceDoc = await getDoc(doc(db, 'invoices', data.invoiceId));
                    if (invoiceDoc.exists()) {
                        const invoiceData = invoiceDoc.data();
                        setInvoiceData({
                            ...invoiceData,
                            id: invoiceDoc.id,
                            createdAt: invoiceData.createdAt?.toDate(),
                            paymentDue: invoiceData.paymentDue?.toDate()
                        });
                    }
                }

                // Fetch client data if available
                if (data.clientId) {
                    await fetchClientData(data.clientId, data.clientName);
                }

                // Fetch related receipts
                const receiptsQuery = query(
                    collection(db, 'receipts'),
                    where('internalPOId', '==', id)
                );
                const receiptsSnapshot = await getDocs(receiptsQuery);
                const receiptsData = receiptsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setReceipts(receiptsData);

                // Fetch company profile
                const companyProfileDoc = await getDoc(doc(db, 'companyProfile', 'default'));
                if (companyProfileDoc.exists()) {
                    setCompanyProfile(companyProfileDoc.data());
                }

            } catch (err) {
                console.error('Error fetching internal PO:', err);
                setError('Failed to load internal PO');
            } finally {
                setLoading(false);
            }
        };

        fetchInternalPOData();
    }, [id]);

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, 'internalPOs', id));
            showNotification('Internal PO deleted successfully', 'success');
            history.push('/internal-pos');
        } catch (err) {
            console.error('Error deleting internal PO:', err);
            showNotification('Failed to delete internal PO', 'error');
        }
    };

    const handleVoid = async () => {
        try {
            await updateDoc(doc(db, 'internalPOs', id), {
                status: 'void',
                voidedAt: new Date().toISOString()
            });
            setInternalPO(prev => ({
                ...prev,
                status: 'void',
                voidedAt: new Date().toISOString()
            }));
            showNotification('Internal PO voided successfully', 'success');
            setShowVoidModal(false);
        } catch (err) {
            console.error('Error voiding internal PO:', err);
            showNotification('Failed to void internal PO', 'error');
        }
    };

    const handlePaymentUpdate = async (amount) => {
        try {
            const newAmount = parseFloat(amount);
            const currentPaid = internalPO.paid || 0;
            const totalPaid = currentPaid + newAmount;
            const status = totalPaid >= internalPO.total ? 'paid' : 'partially_paid';

            await updateDoc(doc(db, 'internalPOs', id), {
                paid: totalPaid,
                status
            });

            setInternalPO(prev => ({
                ...prev,
                paid: totalPaid,
                status
            }));
            setShowPaymentModal(false);
            setPaymentAmount('');
        } catch (err) {
            console.error('Error updating payment:', err);
            showNotification('Failed to update payment', 'error');
        }
    };

    const handleEditTerms = async (terms) => {
        try {
            await updateDoc(doc(db, 'internalPOs', id), {
                terms
            });
            setInternalPO(prev => ({ ...prev, terms }));
            setShowEditModal(false);
            setNewTerms('');
        } catch (err) {
            console.error('Error updating terms:', err);
            showNotification('Failed to update terms', 'error');
        }
    };

    const handleCreateReceipt = async () => {
        try {
            const receiptData = {
                internalPOId: id,
                amount: internalPO.total - (internalPO.paid || 0),
                date: new Date(),
                status: 'pending'
            };

            await addDoc(collection(db, 'receipts'), receiptData);
            history.push(`/receipts/new?internalPOId=${id}`);
        } catch (err) {
            console.error('Error creating receipt:', err);
            showNotification('Failed to create receipt', 'error');
        }
    };

    const fetchQuotationData = async (quotationId) => {
        if (!quotationId) return;
        
        setIsFetchingQuotation(true);
        try {
            const quotationDoc = await getDoc(doc(db, 'quotations', quotationId));
            if (quotationDoc.exists()) {
                setQuotationData({
                    ...quotationDoc.data(),
                    id: quotationDoc.id
                });
            }
        } catch (err) {
            console.error('Error fetching quotation:', err);
        } finally {
            setIsFetchingQuotation(false);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            // Implementation for PDF generation and download
            // This would be similar to InvoiceView's implementation
        } catch (err) {
            console.error('Error generating PDF:', err);
        }
    };

    const handleSendEmail = async () => {
        try {
            // Generate PDF data
            const pdfContent = await generatePDF();
            setPdfData({
                content: pdfContent,
                name: `internal_po_${internalPO.customId}.pdf`
            });

            // Prepare email data
            setEmailData({
                to: internalPO.clientEmail,
                subject: `Internal PO #${internalPO.customId}`,
                body: `Dear ${internalPO.clientName},\n\nPlease find attached the Internal PO #${internalPO.customId}.`
            });

            setIsEmailModalOpen(true);
        } catch (err) {
            console.error('Error preparing email:', err);
        }
    };

    const handleEmailSent = async () => {
        try {
            // Update internal PO status or add email log
            await updateDoc(doc(db, 'internalPOs', id), {
                lastEmailSent: new Date()
            });
            setIsEmailModalOpen(false);
        } catch (err) {
            console.error('Error updating email status:', err);
        }
    };

    const renderBankDetails = () => {
        if (!companyProfile?.bankDetails) return null;

        return (
            <BankDetailsSection>
                <BankDetailsTitle>Bank Details</BankDetailsTitle>
                <BankDetailsGrid>
                    <BankDetailItem>
                        <BankDetailLabel>Bank Name</BankDetailLabel>
                        <BankDetailValue>{companyProfile.bankDetails.bankName}</BankDetailValue>
                    </BankDetailItem>
                    <BankDetailItem>
                        <BankDetailLabel>Account Name</BankDetailLabel>
                        <BankDetailValue>{companyProfile.bankDetails.accountName}</BankDetailValue>
                    </BankDetailItem>
                    <BankDetailItem>
                        <BankDetailLabel>Account Number</BankDetailLabel>
                        <BankDetailValue>{companyProfile.bankDetails.accountNumber}</BankDetailValue>
                    </BankDetailItem>
                    <BankDetailItem>
                        <BankDetailLabel>Sort Code</BankDetailLabel>
                        <BankDetailValue>{companyProfile.bankDetails.sortCode}</BankDetailValue>
                    </BankDetailItem>
                </BankDetailsGrid>
            </BankDetailsSection>
        );
    };

    const variant = (key) => {
        const variants = {
            link: {
                hidden: { x: -20, opacity: 0 },
                visible: { x: 0, opacity: 1 },
                exit: { x: -20, opacity: 0 }
            },
            controller: {
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 },
                exit: { y: 20, opacity: 0 }
            }
        };

        return variants[key];
    };

    const calculateTotals = () => {
        if (!internalPO?.items) {
            return {
                subtotal: 0,
                vatAmount: 0,
                grandTotal: 0
            };
        }

        const subtotal = internalPO.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        const vatAmount = subtotal * 0.15; // 15% VAT
        const grandTotal = subtotal + vatAmount;

        return {
            subtotal,
            vatAmount,
            grandTotal
        };
    };

    // Show loading state
    if (loading || !internalPO) {
        return (
            <StyledInternalPOView>
                <Container>
                    <Link
                        to="/internal-pos"
                        variants={variant('link')}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{ marginBottom: '28px' }}
                    >
                        <Icon name="arrow-left" size={10} color={theme?.colors?.primary || '#000'} />
                        Go back
                    </Link>
                    
                    <Controller
                        variants={variant('controller')}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Text>Loading internal PO...</Text>
                            <div style={{ marginLeft: 16, width: 16, height: 16 }} className="loading-spinner"></div>
                        </div>
                    </Controller>
                </Container>
            </StyledInternalPOView>
        );
    }

    const { subtotal, vatAmount, grandTotal } = calculateTotals();

    return (
        <StyledInternalPOView>
            <Container>
                <Link
                    to="/internal-pos"
                    variants={variant('link')}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <Icon name="arrow-left" size={16} color="inherit" />
                    Go back
                </Link>

                <HeaderSection>
                    <HeaderTitle>Internal PO</HeaderTitle>
                </HeaderSection>

                <Controller
                    variants={variant('controller')}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <StatusBadge status={internalPO.status}>
                            <span>
                                {internalPO.status === 'paid' ? 'Paid' : 
                                 internalPO.status === 'pending' ? 'Pending' : 
                                 internalPO.status === 'partially_paid' ? 'Partially Paid' : 
                                 internalPO.status === 'void' ? 'Void' : 'Draft'}
                            </span>
                        </StatusBadge>
                        <DownloadButton onClick={handleDownloadPDF}>
                            <Icon name="download" size={13} />
                            Share
                        </DownloadButton>
                    </div>

                    <ButtonWrapper>
                        {internalPO.status !== 'void' && (
                            <>
                                <Button onClick={() => setShowEditModal(true)} $secondary>
                                    <Icon name="edit" size={13} />
                                    Edit
                                </Button>
                                <Button onClick={() => setShowDeleteModal(true)} $danger>
                                    <Icon name="delete" size={13} />
                                    Delete
                                </Button>
                                <Button onClick={() => setShowVoidModal(true)} $warning>
                                    <Icon name="void" size={13} />
                                    Void
                                </Button>
                                {internalPO.status !== 'paid' && (
                                    <Button onClick={() => setShowPaymentModal(true)} $primary>
                                        <Icon name="payment" size={13} />
                                        Mark as Paid
                                    </Button>
                                )}
                            </>
                        )}
                    </ButtonWrapper>
                </Controller>

                <InfoCard>
                    <InfoHeader>
                        <InfoGroup>
                            <InfoID>
                                <span>Internal PO #</span>{internalPO.customId}
                            </InfoID>
                            <InfoDesc>{internalPO.description}</InfoDesc>
                            <MetaInfo>
                                <MetaItem>
                                    <Icon name="calendar" size={13} />
                                    Created: {formatDate(internalPO.createdAt)}
                                </MetaItem>
                                <MetaItem>
                                    <Icon name="calendar" size={13} />
                                    Due: {formatDate(internalPO.paymentDue)}
                                </MetaItem>
                            </MetaInfo>
                        </InfoGroup>
                    </InfoHeader>

                    <InfoAddresses>
                        <AddressGroup align="left">
                            <AddressTitle>Bill To</AddressTitle>
                            <AddressText>
                                <strong>{clientData?.name || internalPO.clientName}</strong><br />
                                {clientData?.address}<br />
                                {clientData?.country}<br />
                                {clientData?.phone}<br />
                                {clientHasVAT && clientData?.trnNumber && (
                                    <span style={{ fontWeight: '600' }}>
                                        TRN: {clientData.trnNumber}
                                    </span>
                                )}
                            </AddressText>
                        </AddressGroup>
                    </InfoAddresses>

                    <Details className="Details">
                        <ItemsHeader className="ItemsHeader" showVat={clientHasVAT}>
                            <HeaderCell>Item Name</HeaderCell>
                            <HeaderCell>QTY.</HeaderCell>
                            <HeaderCell>Price</HeaderCell>
                            {clientHasVAT && <HeaderCell>VAT (5%)</HeaderCell>}
                            <HeaderCell>Total</HeaderCell>
                        </ItemsHeader>
                        
                        <Items>
                            {internalPO.items?.map((item, index) => {
                                const itemVAT = item.vat || 0;
                                // Get the corresponding invoice item description
                                const invoiceItem = invoiceData?.items?.find(invItem => invItem.name === item.name);
                                return (
                                    <Item key={index} showVat={clientHasVAT}>
                                        <div className="item-details">
                                            <ItemName>{item.name}</ItemName>
                                            {(item.description || invoiceItem?.description) && (
                                                <ItemDescription>
                                                    {item.description || invoiceItem?.description}
                                                </ItemDescription>
                                            )}
                                            <div className="item-mobile-details">
                                                <span>
                                                    {item.quantity || 0} × {formatPrice(item.price || 0, internalPO.currency)}
                                                    {clientHasVAT && ` (+${formatPrice(itemVAT, internalPO.currency)} VAT)`}
                                                </span>
                                            </div>
                                        </div>
                                        <ItemQty>{item.quantity || 0}</ItemQty>
                                        <ItemPrice>
                                            {formatPrice(item.price || 0, internalPO.currency)}
                                        </ItemPrice>
                                        {clientHasVAT && (
                                            <ItemVat>
                                                {formatPrice(itemVAT, internalPO.currency)}
                                            </ItemVat>
                                        )}
                                        <ItemTotal>
                                            {formatPrice(item.total || 0, internalPO.currency)}
                                        </ItemTotal>
                                    </Item>
                                );
                            })}
                        </Items>
                        
                        <Total>
                            <div>
                                <TotalText>Subtotal</TotalText>
                                <TotalAmount>{formatPrice(internalPO.subtotal || 0, internalPO.currency)}</TotalAmount>
                            </div>
                            {clientHasVAT && (
                                <div>
                                    <TotalText>VAT (5%)</TotalText>
                                    <TotalAmount>{formatPrice(internalPO.totalVat || 0, internalPO.currency)}</TotalAmount>
                                </div>
                            )}
                            <div className="grand-total">
                                <TotalText>Total</TotalText>
                                <TotalAmount>{formatPrice(internalPO.total || 0, internalPO.currency)}</TotalAmount>
                            </div>
                        </Total>
                    </Details>

                    <InfoSectionsGrid>
                        <TermsSection>
                            <TermsHeader>
                                <TermsTitle>Notes</TermsTitle>
                                {!isEditingTerms ? (
                                    <Button
                                        onClick={() => {
                                            setEditedTerms(internalPO.termsAndConditions || defaultTermsAndConditions);
                                            setIsEditingTerms(true);
                                        }}
                                        $secondary
                                        style={{ padding: '6px 12px', fontSize: '13px' }}
                                    >
                                        <Icon name="edit" size={13} />
                                        Edit
                                    </Button>
                                ) : (
                                    <TermsActions>
                                        <Button
                                            onClick={() => setIsEditingTerms(false)}
                                            $secondary
                                            style={{ padding: '6px 12px', fontSize: '13px' }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleEditTerms}
                                            $primary
                                            style={{ padding: '6px 12px', fontSize: '13px' }}
                                        >
                                            Save
                                        </Button>
                                    </TermsActions>
                                )}
                            </TermsHeader>
                            {!isEditingTerms ? (
                                <div style={{ whiteSpace: 'pre-line' }}>
                                    {internalPO.termsAndConditions || defaultTermsAndConditions}
                                </div>
                            ) : (
                                <FormTextArea
                                    value={editedTerms}
                                    onChange={(e) => setEditedTerms(e.target.value)}
                                    rows={5}
                                />
                            )}
                        </TermsSection>

                        {renderBankDetails()}
                    </InfoSectionsGrid>

                    <PaymentDetailsSection>
                        <PaymentDetailsHeader>
                            <PaymentDetailsTitle>Payment Details</PaymentDetailsTitle>
                            {internalPO.status !== 'paid' && (
                                <CreateReceiptButton onClick={handleCreateReceipt}>
                                    <Icon name="plus" size={13} />
                                    Create Receipt
                                </CreateReceiptButton>
                            )}
                        </PaymentDetailsHeader>

                        <PaymentDetailsGrid>
                            <PaymentDetailItem>
                                <PaymentDetailLabel>Total Amount</PaymentDetailLabel>
                                <PaymentDetailValue>{formatPrice(grandTotal, internalPO.currency)}</PaymentDetailValue>
                            </PaymentDetailItem>
                            <PaymentDetailItem>
                                <PaymentDetailLabel>Amount Paid</PaymentDetailLabel>
                                <PaymentDetailValue>{formatPrice(internalPO.paid || 0, internalPO.currency)}</PaymentDetailValue>
                            </PaymentDetailItem>
                            <PaymentDetailItem>
                                <PaymentDetailLabel>Amount Due</PaymentDetailLabel>
                                <PaymentDetailValue>{formatPrice(grandTotal - (internalPO.paid || 0), internalPO.currency)}</PaymentDetailValue>
                            </PaymentDetailItem>
                        </PaymentDetailsGrid>

                        {receipts.length > 0 && (
                            <ReceiptTimeline>
                                <ReceiptTimelineTitle>Created Receipts</ReceiptTimelineTitle>
                                {receipts.map((receipt) => (
                                    <ReceiptItem
                                        key={receipt.id}
                                        onClick={() => history.push(`/receipt/${receipt.id}`)}
                                    >
                                        <ReceiptInfo>
                                            <ReceiptNumber>{receipt.customId}</ReceiptNumber>
                                            <ReceiptDetails>
                                                {formatDate(receipt.date, 'MMM DD, YYYY h:mm A')}
                                            </ReceiptDetails>
                                        </ReceiptInfo>
                                        <ReceiptAmount>
                                            {formatPrice(receipt.amount, internalPO.currency)}
                                        </ReceiptAmount>
                                    </ReceiptItem>
                                ))}
                            </ReceiptTimeline>
                        )}
                    </PaymentDetailsSection>
                </InfoCard>
            </Container>

            {/* Modals */}
            {showDeleteModal && (
                <Modal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    title="Delete Internal PO"
                    message="Are you sure you want to delete this internal PO? This action cannot be undone."
                    primaryAction={{
                        label: 'Delete',
                        onClick: handleDelete,
                        variant: 'danger'
                    }}
                    secondaryAction={{
                        label: 'Cancel',
                        onClick: () => setShowDeleteModal(false)
                    }}
                />
            )}

            {showVoidModal && (
                <Modal
                    isOpen={showVoidModal}
                    onClose={() => setShowVoidModal(false)}
                    title="Void Internal PO"
                    message="Are you sure you want to void this internal PO? This action cannot be undone."
                    primaryAction={{
                        label: 'Void',
                        onClick: handleVoid,
                        variant: 'warning'
                    }}
                    secondaryAction={{
                        label: 'Cancel',
                        onClick: () => setShowVoidModal(false)
                    }}
                />
            )}

            {showPaymentModal && (
                <Modal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    title="Add Payment"
                    content={
                        <PaymentForm onSubmit={(e) => {
                            e.preventDefault();
                            handlePaymentUpdate(paymentAmount);
                        }}>
                            <FormRow>
                                <PaymentFormLabel>Payment Amount</PaymentFormLabel>
                                <FormInput
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    required
                                />
                            </FormRow>
                        </PaymentForm>
                    }
                    primaryAction={{
                        label: 'Add Payment',
                        onClick: () => handlePaymentUpdate(paymentAmount),
                        variant: 'primary'
                    }}
                    secondaryAction={{
                        label: 'Cancel',
                        onClick: () => setShowPaymentModal(false)
                    }}
                />
            )}

            {isEmailModalOpen && emailData && pdfData && (
                <EmailPreviewModal
                    isOpen={isEmailModalOpen}
                    onClose={() => setIsEmailModalOpen(false)}
                    onSend={handleEmailSent}
                    emailData={emailData}
                    documentType="internal_po"
                    documentId={internalPO.id}
                    clientName={internalPO.clientName}
                    clientEmail={internalPO.clientEmail}
                    amount={internalPO.total}
                    currency={internalPO.currency}
                    dueDate={internalPO.dueDate}
                    pdfBase64={pdfData.content}
                    pdfName={pdfData.name}
                />
            )}
        </StyledInternalPOView>
    );
};

export default InternalPOView; 