import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { useReducedMotion } from 'framer-motion';
import { useGlobalContext } from '../App/context';
import Icon from '../shared/Icon/Icon';
import Button from '../shared/Button/Button';
import { formatDate, formatPrice, formatCurrency } from '../../utilities/helpers';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import styled from 'styled-components';
import {
    StyledInvoiceView,
    Container,
    Link,
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
    StatusContainer,
    TermsSection,
    TermsHeader,
    TermsTitle,
    TermsText,
    TermsTextArea,
    TermsActions,
    BankDetailsSection,
    BankDetailsTitle,
    BankDetailsGrid,
    BankDetailItem,
    BankDetailLabel,
    BankDetailValue,
    InfoSectionsGrid,
    HeaderSection,
    HeaderTitle,
    DownloadButton,
    PaymentDetailsSection,
    PaymentDetailsHeader,
    PaymentDetailsTitle,
    PaymentDetailsGrid,
    PaymentDetailItem,
    PaymentDetailLabel,
    PaymentDetailValue,
    PaymentDetailDueDate,
    ReceiptTimeline,
    ReceiptTimelineTitle,
    ReceiptItem,
    ReceiptInfo,
    ReceiptNumber,
    ReceiptDetails,
    ReceiptAmount,
    CreateReceiptButton,
    PaymentModalContent,
    PaymentForm,
    FormRow,
    PaymentFormLabel,
    FormInput,
    FormSelect,
    FormTextArea,
    PlusIcon
} from './InvoiceViewStyles';
import { generateEmailTemplate } from '../../services/emailService';
import EmailPreviewModal from '../shared/EmailPreviewModal/EmailPreviewModal';
import { format } from 'date-fns';
import { message } from 'antd';

// Add ModalOverlay styled component
const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 24px;
    background-color: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(5px);
    z-index: 100;
`;

const ModalContent = styled.div`
    width: 100%;
    max-width: 480px;
    padding: 32px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme?.backgrounds?.card || '#1E2139'};
    border: 1px solid ${({ theme }) => theme?.borders || '#252945'};
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
`;

const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
`;

const ModalIconWrapper = styled.div`
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 72, 6, 0.1);
    border-radius: 50%;
`;

const ModalTitle = styled.h2`
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    margin: 0;
`;

const ModalText = styled.p`
    font-size: 15px;
    line-height: 1.84;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
    margin-bottom: 24px;
`;

const FormGroup = styled.div`
    margin-bottom: 24px;
`;

const FormLabel = styled.label`
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
    margin-bottom: 8px;
`;

const TextArea = styled.textarea`
    width: 100%;
    min-height: 100px;
    padding: 12px;
    border: 1px solid ${({ theme }) => theme?.borders || '#252945'};
    border-radius: 4px;
    background-color: ${({ theme }) => theme?.backgrounds?.input || '#1E2139'};
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    font-size: 14px;
    line-height: 1.5;
    resize: vertical;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme?.colors?.purple || '#7C5DFA'};
    }
`;

const ModalActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 24px;

    button {
        min-width: 100px;
        padding: 16px 24px;
        border-radius: 24px;
        font-weight: 700;
        font-size: 15px;
        transition: all 0.3s ease;
    }
`;

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
    const history = useHistory();
    const [invoice, setInvoice] = useState(null);
    const [clientData, setClientData] = useState(null);
    const [companyProfile, setCompanyProfile] = useState(null);
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
    const [quotationData, setQuotationData] = useState(null);
    const [isFetchingQuotation, setIsFetchingQuotation] = useState(false);
    const [isEditingTerms, setIsEditingTerms] = useState(false);
    const [editedTerms, setEditedTerms] = useState('');
    const [isEditingLPO, setIsEditingLPO] = useState(false);
    const [editedLPO, setEditedLPO] = useState('');
    const [isEditingDueDate, setIsEditingDueDate] = useState(false);
    const [editedDueDate, setEditedDueDate] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({
        amount: '',
        mode: 'cash',
        date: formatDate(new Date(), 'YYYY-MM-DD'),
        chequeNumber: '',
        notes: ''
    });
    const [receipts, setReceipts] = useState([]);
    const [isCreatingReceipt, setIsCreatingReceipt] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [emailData, setEmailData] = useState(null);
    const [pdfData, setPdfData] = useState(null);
    
    // Add default terms and conditions
    const defaultTermsAndConditions = `50% advance payment along with the issuance of the LPO (Local Purchase Order), and the remaining 50% to be settled before the delivery of the order.

All prices are in local currency and include VAT where applicable.

Goods remain the property of ${companyProfile?.name || 'Fortune Gifts'} until paid in full.`;

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

    // Ensure VAT is always set for UAE clients
    useEffect(() => {
        if (clientData) {
            const isUAE = clientData.country?.toLowerCase().includes('emirates') || 
                         clientData.country?.toLowerCase().includes('uae');
            setClientHasVAT(isUAE || clientData.hasVAT || false);
        }
    }, [clientData]);

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
                    setClientData(data);
                    // Always set VAT for UAE clients
                    const isUAE = data.country?.toLowerCase().includes('emirates') || 
                                 data.country?.toLowerCase().includes('uae');
                    setClientHasVAT(isUAE || data.hasVAT || false);
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
                                // Always set VAT for UAE clients
                                const isUAE = data.country?.toLowerCase().includes('emirates') || 
                                             data.country?.toLowerCase().includes('uae');
                                setClientHasVAT(isUAE || data.hasVAT || false);
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
                                // Always set VAT for UAE clients
                                const isUAE = data.country?.toLowerCase().includes('emirates') || 
                                             data.country?.toLowerCase().includes('uae');
                                setClientHasVAT(isUAE || data.hasVAT || false);
                                return;
                            }
                        }
                    } else {
                        const data = querySnapshot.docs[0].data();
                        setClientData(data);
                        // Always set VAT for UAE clients
                        const isUAE = data.country?.toLowerCase().includes('emirates') || 
                                     data.country?.toLowerCase().includes('uae');
                        setClientHasVAT(isUAE || data.hasVAT || false);
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
                setClientHasVAT(false);
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
                setClientHasVAT(false);
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
                    currency: data.currency || 'USD',
                    totalVat: data.totalVat || (data.items?.reduce((sum, item) => {
                        const itemTotal = parseFloat(item.total) || 0;
                        return sum + (clientHasVAT ? calculateVAT(itemTotal) : 0);
                    }, 0) || 0),
                    grandTotal: data.grandTotal || (data.totalVat ? data.totalVat + (data.total || 0) : data.total || 0)
                };
                
                setInvoice(fetchedInvoice);
                
                // Fetch client data from the clients collection
                if (data.clientId) {
                    const clientRef = doc(db, 'clients', data.clientId);
                    const clientSnap = await getDoc(clientRef);
                    
                    if (clientSnap.exists()) {
                        const clientData = clientSnap.data();
                        setClientData(clientData);
                        setClientHasVAT(clientData.hasVAT || false);
                    } else {
                        // If no client found, try to find by name
                        await fetchClientData(null, data.clientName);
                    }
                } else {
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
                // Update payment details when marking as paid
                const invoiceRef = doc(db, 'invoices', id);
                await updateDoc(invoiceRef, {
                    status: 'paid',
                    paidAmount: invoice.total, // Set paid amount to total
                    paymentDate: new Date(),
                    lastModified: new Date()
                });
                
                // Update local state
                setInvoice(prev => ({
                    ...prev,
                    status: 'paid',
                    paidAmount: prev.total,
                    paymentDate: new Date()
                }));
                
                toggleModal(id, 'status');
                await handleMarkAsPaid();
            } else if (newStatus === 'partially_paid') {
                // Update payment details when marking as partially paid
                const invoiceRef = doc(db, 'invoices', id);
                await updateDoc(invoiceRef, {
                    status: 'partially_paid',
                    lastModified: new Date()
                });
                
                // Update local state
                setInvoice(prev => ({
                    ...prev,
                    status: 'partially_paid'
                }));
            } else if (newStatus === 'edit') {
                editInvoice(id);
            }
        } catch (error) {
            console.error('Error updating invoice status:', error);
        }
    };

    // Add function to update payment amount
    const handlePaymentAmountUpdate = async (amount) => {
        try {
            const invoiceRef = doc(db, 'invoices', id);
            const newStatus = amount >= invoice.total ? 'paid' : 'partially_paid';
            
            await updateDoc(invoiceRef, {
                paidAmount: amount,
                status: newStatus,
                paymentDate: newStatus === 'paid' ? new Date() : null,
                lastModified: new Date()
            });
            
            // Update local state
            setInvoice(prev => ({
                ...prev,
                paidAmount: amount,
                status: newStatus,
                paymentDate: newStatus === 'paid' ? new Date() : null
            }));
        } catch (error) {
            console.error('Error updating payment amount:', error);
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

    // Update getCompanyProfile function
    const getCompanyProfile = async (country) => {
        try {
            // Convert country to lowercase and handle variations
            const countryLower = country.toLowerCase();
            let searchCountry = countryLower;
            
            // Handle UAE variations
            if (countryLower.includes('emirates') || countryLower.includes('uae')) {
                searchCountry = 'uae';
            }
            
            // Query the companies collection instead of companyProfiles
            const companiesRef = collection(db, 'companies');
            
            // Query for the specific country
            const q = query(companiesRef, where('country', '==', searchCountry));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const profile = querySnapshot.docs[0].data();
                
                const result = {
                    name: profile.name || '',
                    address: profile.address || '',
                    phone: profile.phone || '',
                    vatNumber: profile.vatNumber || '',
                    crNumber: profile.crNumber || '',
                    bankDetails: {
                        bankName: profile.bankName || '',
                        accountName: profile.accountName || '',
                        accountNumber: profile.accountNumber || '',
                        iban: profile.iban || '',
                        swift: profile.chequesPayableTo || '' // Using chequesPayableTo as SWIFT code
                    }
                };
                
                return result;
            }
            
            // If no profile found for UAE, return Qatar profile as default
            if (searchCountry === 'uae') {
                const qatarQuery = query(companiesRef, where('country', '==', 'qatar'));
                const qatarSnapshot = await getDocs(qatarQuery);
                
                if (!qatarSnapshot.empty) {
                    const qatarProfile = qatarSnapshot.docs[0].data();
                    
                    const result = {
                        name: qatarProfile.name || '',
                        address: qatarProfile.address || '',
                        phone: qatarProfile.phone || '',
                        vatNumber: qatarProfile.vatNumber || '',
                        crNumber: qatarProfile.crNumber || '',
                        bankDetails: {
                            bankName: qatarProfile.bankName || '',
                            accountName: qatarProfile.accountName || '',
                            accountNumber: qatarProfile.accountNumber || '',
                            iban: qatarProfile.iban || '',
                            swift: qatarProfile.chequesPayableTo || '' // Using chequesPayableTo as SWIFT code
                        }
                    };
                    
                    return result;
                }
            }
            
            throw new Error('No company profile found');
        } catch (error) {
            return null;
        }
    };

    // Update useEffect for fetching company profile
    useEffect(() => {
        const fetchCompanyProfile = async () => {
            if (clientData?.country) {
                const profile = await getCompanyProfile(clientData.country);
                setCompanyProfile(profile);
                // Update invoice with default terms if not set
                if (invoice && !invoice.termsAndConditions) {
                    const updatedInvoice = {
                        ...invoice,
                        termsAndConditions: defaultTermsAndConditions
                    };
                    setInvoice(updatedInvoice);
                }
            }
        };

        fetchCompanyProfile();
    }, [clientData?.country, invoice]);

    // Update renderBankDetails
    const renderBankDetails = () => {
        if (!companyProfile) {
            return (
                <BankDetailsSection>
                    <BankDetailsTitle>Bank Transfer Details</BankDetailsTitle>
                    <div style={{ 
                        color: colors.textTertiary, 
                        fontSize: '14px',
                        textAlign: 'center',
                        padding: '20px'
                    }}>
                        No bank details available. Please configure company profile in Settings.
                    </div>
                </BankDetailsSection>
            );
        }

        return (
            <BankDetailsSection>
                <BankDetailsTitle>Bank Transfer Details</BankDetailsTitle>
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
                        <BankDetailLabel>IBAN</BankDetailLabel>
                        <BankDetailValue>{companyProfile.bankDetails.iban}</BankDetailValue>
                    </BankDetailItem>
                    <BankDetailItem>
                        <BankDetailLabel>SWIFT Code</BankDetailLabel>
                        <BankDetailValue>{companyProfile.bankDetails.swift}</BankDetailValue>
                    </BankDetailItem>
                </BankDetailsGrid>
            </BankDetailsSection>
        );
    };

    // Add useEffect to fetch company profile when client data changes
    useEffect(() => {
        const fetchCompanyProfile = async () => {
            if (clientData?.country) {
                const profile = await getCompanyProfile(clientData.country);
                setCompanyProfile(profile);
            }
        };

        fetchCompanyProfile();
    }, [clientData?.country]);

    // Add handleDownloadPDF function
    const handleDownloadPDF = async () => {
        try {
            // Get the client's country from the invoice or client data
            const clientCountry = invoice?.clientAddress?.country || 
                                clientData?.country || 
                                'qatar';

            // Determine which company profile to use
            let companyProfile;
            try {
                if (clientCountry.toLowerCase().includes('emirates') || clientCountry.toLowerCase().includes('uae')) {
                    companyProfile = await getCompanyProfile('uae');
                } else {
                    companyProfile = await getCompanyProfile('qatar');
                }
            } catch (profileError) {
                companyProfile = {
                    name: 'Fortune Gifts',
                    address: 'Doha, Qatar',
                    phone: '+974 1234 5678',
                    vatNumber: 'VAT123456789',
                    crNumber: 'CR123456789'
                };
            }

            // Create a new container for PDF content
            const pdfContainer = document.createElement('div');
            pdfContainer.style.cssText = `
                width: 297mm;
                min-height: 420mm;
                padding: 5mm 20mm 20mm 20mm;
                margin: 0;
                background-color: white;
                box-sizing: border-box;
                position: relative;
                font-family: Arial, sans-serif;
                overflow: visible;
            `;

            // Add header
            pdfContainer.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div>
                        <img src="${window.location.origin}/images/invoice-logo.png" alt="${companyProfile.name} Logo" style="max-height: 80px;" onerror="this.onerror=null; this.src=''; this.alt='${companyProfile.name}'; this.style.fontSize='27px'; this.style.fontWeight='bold'; this.style.color='#004359';"/>
                    </div>
                    <div style="text-align: right; font-size: 19px; color: #000000;">
                        <div style="font-weight: bold; font-size: 21px; margin-bottom: 5px;">${companyProfile.name}</div>
                        <div>${companyProfile.address}</div>
                        <div>Tel: ${companyProfile.phone} | ${clientCountry.toLowerCase().includes('emirates') || clientCountry.toLowerCase().includes('uae') ? 'TRN' : 'CR'} Number: <span style="color: #FF4806;">${clientCountry.toLowerCase().includes('emirates') || clientCountry.toLowerCase().includes('uae') ? companyProfile.vatNumber : companyProfile.crNumber}</span></div>
                        <div>Email: sales@fortunegiftz.com | Website: www.fortunegiftz.com</div>
                    </div>
                </div>
                <div style="height: 2px; background-color: #004359; margin-bottom: 10px;"></div>
                <div style="text-align: center; margin-top: 25px;">
                    <h1 style="font-size: 32px; color: #004359; margin: 0; letter-spacing: 1px;">INVOICE</h1>
                </div>
            `;

            // Add client section
            const clientSection = document.createElement('div');
            clientSection.style.cssText = `
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                padding: 20px;
                background-color: white;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
            `;
            clientSection.innerHTML = `
                <div style="flex: 1;">
                    <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Bill To</div>
                    <div style="color: black; font-size: 16px;">
                        <strong>${invoice.clientName}</strong><br />
                        ${clientData?.address || invoice.clientAddress?.street || ''}
                        ${invoice.clientAddress?.city ? `, ${invoice.clientAddress.city}` : ''}
                        ${invoice.clientAddress?.postCode ? `, ${invoice.clientAddress.postCode}` : ''}
                        ${clientData?.country || invoice.clientAddress?.country ? `, ${clientData?.country || invoice.clientAddress?.country}` : ''}
                        ${clientData?.phone ? `<br />${clientData.phone}` : ''}
                        ${(clientCountry.toLowerCase().includes('emirates') || clientCountry.toLowerCase().includes('uae')) && clientData?.trn ? 
                            `<br /><span style="font-weight: 600;">TRN: ${clientData.trn}</span>` : ''}
                    </div>
                </div>
                <div style="display: flex; gap: 40px;">
                    <div style="text-align: right;">
                        <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Invoice #</div>
                        <div style="color: black; font-size: 16px; margin-bottom: 15px;">${invoice.customId || id}</div>
                        <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Due Date</div>
                        <div style="color: black; font-size: 16px;">${formatDate(invoice.paymentDue)}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Created Date</div>
                        <div style="color: black; font-size: 16px; margin-bottom: 15px;">${formatDate(invoice.createdAt)}</div>
                        ${invoice.lpoNumber ? `
                            <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">LPO Number</div>
                            <div style="color: black; font-size: 16px;">${invoice.lpoNumber}</div>
                        ` : ''}
                    </div>
                </div>
            `;
            pdfContainer.appendChild(clientSection);

            // Add items table
            const itemsTable = document.createElement('table');
            itemsTable.style.cssText = `
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                background-color: white;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                page-break-inside: auto;
            `;
            itemsTable.innerHTML = `
                <thead style="background-color: #004359; color: white;">
                    <tr>
                        <th style="padding: 15px; text-align: left; font-size: 18px;">Item Name</th>
                        <th style="padding: 15px; text-align: center; font-size: 18px;">QTY.</th>
                        <th style="padding: 15px; text-align: right; font-size: 18px;">Price</th>
                        ${clientHasVAT ? '<th style="padding: 15px; text-align: right; font-size: 18px;">VAT (5%)</th>' : ''}
                        <th style="padding: 15px; text-align: right; font-size: 18px;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoice.items.map(item => {
                        const itemVAT = item.vat || 0;
                        return `
                            <tr style="border-bottom: 1px solid #e0e0e0;">
                                <td style="padding: 15px; color: black; font-size: 16px;">
                                    ${item.name}
                                    ${item.description ? `<div style="font-size: 14px; color: #666;">${item.description}</div>` : ''}
                                </td>
                                <td style="padding: 15px; text-align: center; color: black; font-size: 16px;">${item.quantity || 0}</td>
                                <td style="padding: 15px; text-align: right; color: black; font-size: 16px;">${formatPrice(item.price || 0, invoice.currency)}</td>
                                ${clientHasVAT ? `<td style="padding: 15px; text-align: right; color: black; font-size: 16px;">${formatPrice(itemVAT, invoice.currency)}</td>` : ''}
                                <td style="padding: 15px; text-align: right; color: black; font-size: 16px;">${formatPrice(item.total || 0, invoice.currency)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            `;
            pdfContainer.appendChild(itemsTable);

            // Add total section
            const totalSection = document.createElement('div');
            totalSection.style.cssText = `
                background-color: #004359;
                color: white;
                padding: 15px;
                text-align: right;
                border-radius: 0 0 4px 4px;
                margin-bottom: 20px;
                page-break-inside: avoid;
            `;
            totalSection.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; opacity: 0.9;">
                        <span style="font-size: 14px;">Subtotal:</span>
                        <span style="font-size: 14px;">${formatPrice(invoice.subtotal || 0, invoice.currency)}</span>
                    </div>
                    ${clientHasVAT ? `
                        <div style="display: flex; justify-content: space-between; align-items: center; opacity: 0.9;">
                            <span style="font-size: 14px;">VAT (5%):</span>
                            <span style="font-size: 14px;">${formatPrice(invoice.totalVat || 0, invoice.currency)}</span>
                        </div>
                    ` : ''}
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                        <span style="font-size: 16px;">Total:</span>
                        <span style="font-size: 20px; font-weight: bold;">${formatPrice(invoice.total || 0, invoice.currency)}</span>
                    </div>
                </div>
            `;
            pdfContainer.appendChild(totalSection);

            // Add spacer for signature section
            const spacer = document.createElement('div');
            spacer.style.height = '50px';
            pdfContainer.appendChild(spacer);

            // Add Terms and Conditions and Bank Details in a two-column layout
            const infoSectionsGrid = document.createElement('div');
            infoSectionsGrid.style.cssText = `
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 24px;
                margin-bottom: 100px;
                page-break-inside: avoid;
            `;

            // Terms and Conditions section
            const termsSection = document.createElement('div');
            termsSection.style.cssText = `
                padding: 24px;
                background-color: #f5f7fa;
                border-radius: 8px;
                border: 1px solid #e0e0e0;
            `;
            termsSection.innerHTML = `
                <h3 style="font-size: 16px; font-weight: 600; color: #004359; margin: 0 0 16px; display: flex; align-items: center; gap: 8px;">
                    <span style="display: inline-block; width: 4px; height: 16px; background-color: #004359; border-radius: 2px;"></span>
                    Terms and Conditions
                </h3>
                <div style="font-size: 14px; line-height: 1.6; color: #666;">
                    ${invoice.termsAndConditions || defaultTermsAndConditions}
                </div>
            `;
            infoSectionsGrid.appendChild(termsSection);

            // Bank Details section
            const bankSection = document.createElement('div');
            bankSection.style.cssText = `
                padding: 24px;
                background-color: #f5f7fa;
                border-radius: 8px;
                border: 1px solid #e0e0e0;
            `;
            bankSection.innerHTML = `
                <h3 style="font-size: 16px; font-weight: 600; color: #004359; margin: 0 0 16px; display: flex; align-items: center; gap: 8px;">
                    <span style="display: inline-block; width: 4px; height: 16px; background-color: #004359; border-radius: 2px;"></span>
                    Bank Transfer Details
                </h3>
                <div style="font-size: 14px; line-height: 1.6; color: #666;">
                    ${companyProfile?.bankDetails ? `
                        <div style="margin-bottom: 8px;"><strong>Bank Name:</strong> ${companyProfile.bankDetails.bankName}</div>
                        <div style="margin-bottom: 8px;"><strong>Account Name:</strong> ${companyProfile.bankDetails.accountName}</div>
                        <div style="margin-bottom: 8px;"><strong>Account Number:</strong> ${companyProfile.bankDetails.accountNumber}</div>
                        <div style="margin-bottom: 8px;"><strong>IBAN:</strong> ${companyProfile.bankDetails.iban}</div>
                        <div style="margin-bottom: 8px;"><strong>SWIFT Code:</strong> ${companyProfile.bankDetails.swift}</div>
                    ` : 'No bank details available'}
                </div>
            `;
            infoSectionsGrid.appendChild(bankSection);

            pdfContainer.appendChild(infoSectionsGrid);

            // Add signature section
            const signatureSection = document.createElement('div');
            signatureSection.style.cssText = `
                position: absolute;
                bottom: 30mm;
                left: 20mm;
                right: 20mm;
                display: flex;
                flex-direction: column;
                background-color: white;
                padding: 20px;
                border-top: 1px solid #e0e0e0;
                z-index: 1000;
                page-break-inside: avoid;
            `;
            signatureSection.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <div style="width: 45%;">
                        <div style="border-bottom: 2px solid #004359; margin-bottom: 15px;"></div>
                        <div style="font-weight: bold; color: #004359; font-size: 19px;">Authorized Signature</div>
                    </div>
                    <div style="width: 45%;">
                        <div style="border-bottom: 2px solid #004359; margin-bottom: 15px;"></div>
                        <div style="font-weight: bold; color: #004359; font-size: 19px;">Client Acceptance</div>
                    </div>
                </div>
                <div style="text-align: center; color: #666; font-size: 12px; font-style: italic; margin-top: 10px;">
                    This is a computer-generated document and does not require a physical signature.
                </div>
            `;
            pdfContainer.appendChild(signatureSection);

            // Temporarily add to document to render
            pdfContainer.style.position = 'absolute';
            pdfContainer.style.left = '-9999px';
            document.body.appendChild(pdfContainer);

            // Create PDF with A3 size
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a3',
                compress: true
            });

            // Convert to canvas with A3 dimensions
            const canvas = await html2canvas(pdfContainer, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                width: 1122.5, // 297mm in pixels at 96 DPI
                height: 1587.4 // 420mm in pixels at 96 DPI
            });

            // Remove temporary elements
            document.body.removeChild(pdfContainer);

            // Add the image to fit A3 page
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, 297, 420);

            // Save the PDF
            pdf.save(`Invoice_${invoice.customId || id}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('There was an error generating the PDF. Please try again.');
        }
    };

    // Add this function to handle terms update
    const handleTermsUpdate = async () => {
        try {
            const invoiceRef = doc(db, 'invoices', id);
            await updateDoc(invoiceRef, {
                termsAndConditions: editedTerms,
                lastModified: new Date()
            });
            
            // Update local state
            setInvoice(prev => ({
                ...prev,
                termsAndConditions: editedTerms
            }));
            
            setIsEditingTerms(false);
        } catch (error) {
            console.error('Error updating terms:', error);
            alert('There was an error updating the notes. Please try again.');
        }
    };

    // Add this function to handle LPO update
    const handleLPOUpdate = async () => {
        try {
            const invoiceRef = doc(db, 'invoices', id);
            await updateDoc(invoiceRef, {
                lpoNumber: editedLPO,
                lastModified: new Date()
            });
            
            // Update local state
            setInvoice(prev => ({
                ...prev,
                lpoNumber: editedLPO
            }));
            
            setIsEditingLPO(false);
        } catch (error) {
            console.error('Error updating LPO number:', error);
            alert('There was an error updating the LPO number. Please try again.');
        }
    };

    // Add this function to handle due date update
    const handleDueDateUpdate = async () => {
        try {
            const invoiceRef = doc(db, 'invoices', id);
            await updateDoc(invoiceRef, {
                paymentDue: new Date(editedDueDate),
                lastModified: new Date()
            });
            
            // Update local state
            setInvoice(prev => ({
                ...prev,
                paymentDue: new Date(editedDueDate)
            }));
            
            setIsEditingDueDate(false);
        } catch (error) {
            console.error('Error updating due date:', error);
            alert('There was an error updating the due date. Please try again.');
        }
    };

    // Add function to handle receipt creation
    const handleCreateReceipt = async (e) => {
        e.preventDefault();
        setIsCreatingReceipt(true);

        try {
            // Validate payment amount
            const paymentAmount = parseFloat(paymentDetails.amount);
            if (isNaN(paymentAmount) || paymentAmount <= 0) {
                throw new Error('Please enter a valid payment amount');
            }

            // Check if payment amount exceeds remaining balance
            const remainingBalance = invoice.total - (invoice.paidAmount || 0);
            if (paymentAmount > remainingBalance) {
                throw new Error('Payment amount cannot exceed the remaining balance');
            }

            // Generate a custom ID for the receipt
            const customId = `FTRC${Math.floor(1000 + Math.random() * 9000)}`;

            // Create receipt in Firestore with all necessary invoice information
            const receiptData = {
                invoiceId: id,
                customId,
                clientName: invoice.clientName || '',
                clientId: clientData?.id || null,
                // Store complete client information
                clientAddress: {
                    street: clientData?.address || invoice.clientAddress?.street || '',
                    city: invoice.clientAddress?.city || '',
                    postCode: invoice.clientAddress?.postCode || '',
                    country: clientData?.country || invoice.clientAddress?.country || ''
                },
                clientPhone: clientData?.phone || '',
                clientEmail: invoice.clientEmail || '',
                items: invoice.items || [],
                total: invoice.total || 0,
                currency: invoice.currency || 'USD',
                amount: paymentAmount,
                mode: paymentDetails.mode,
                paymentDate: new Date(paymentDetails.date),
                chequeNumber: paymentDetails.mode === 'cheque' ? paymentDetails.chequeNumber : null,
                notes: paymentDetails.notes || '',
                termsAndConditions: invoice.termsAndConditions || defaultTermsAndConditions,
                createdAt: new Date(),
                lastModified: new Date(),
                status: 'paid'
            };

            // Add client data if available and valid
            if (clientData && clientData.id) {
                receiptData.clientId = clientData.id;
                receiptData.clientHasVAT = clientData.hasVAT || false;
                receiptData.clientTRN = clientData.trn || clientData.TRN || clientData.trnNumber || null;
            }

            // Create receipt document
            const receiptRef = await addDoc(collection(db, 'receipts'), receiptData);

            // Update invoice payment details
            const invoiceRef = doc(db, 'invoices', id);
            const currentPaidAmount = invoice.paidAmount || 0;
            const newPaidAmount = currentPaidAmount + paymentAmount;
            const newStatus = newPaidAmount >= invoice.total ? 'paid' : 'partially_paid';

            await updateDoc(invoiceRef, {
                paidAmount: newPaidAmount,
                status: newStatus,
                paymentDate: newStatus === 'paid' ? new Date() : null,
                lastModified: new Date()
            });

            // Update local state
            setInvoice(prev => ({
                ...prev,
                paidAmount: newPaidAmount,
                status: newStatus,
                paymentDate: newStatus === 'paid' ? new Date() : null
            }));

            // Add new receipt to receipts list with proper date handling
            setReceipts(prev => [{
                id: receiptRef.id,
                customId,
                ...paymentDetails,
                amount: paymentAmount,
                date: new Date(paymentDetails.date),
                createdAt: new Date(), // Add createdAt field
                paymentDate: new Date(paymentDetails.date) // Add paymentDate field
            }, ...prev]);

            // Reset form and close modal
            setPaymentDetails({
                amount: '',
                mode: 'cash',
                date: formatDate(new Date(), 'YYYY-MM-DD'),
                chequeNumber: '',
                notes: ''
            });
            setShowPaymentModal(false);
        } catch (error) {
            console.error('Error creating receipt:', error);
            alert(error.message || 'There was an error creating the receipt. Please try again.');
        } finally {
            setIsCreatingReceipt(false);
        }
    };

    // Add function to fetch receipts
    const fetchReceipts = async () => {
        try {
            const receiptsRef = collection(db, 'receipts');
            const q = query(receiptsRef, where('invoiceId', '==', id));
            const querySnapshot = await getDocs(q);
            
            const receiptsList = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    date: data.date?.toDate?.() || new Date(),
                    createdAt: data.createdAt?.toDate?.() || new Date(),
                    paymentDate: data.paymentDate?.toDate?.() || new Date(),
                    lastModified: data.lastModified?.toDate?.() || new Date()
                };
            });
            
            setReceipts(receiptsList);
        } catch (error) {
            console.error('Error fetching receipts:', error);
        }
    };

    // Add useEffect to fetch receipts when component mounts
    useEffect(() => {
        if (id) {
            fetchReceipts();
        }
    }, [id]);

    // Update renderPaymentDetails to include Create Receipt button and receipts timeline
    const renderPaymentDetails = () => {
        const { total, paidAmount, dueDate, currency } = invoice;
        const balanceDue = total - (paidAmount || 0);
        const isOverdue = dueDate && new Date(dueDate) < new Date();

        return (
            <PaymentDetailsSection>
                <PaymentDetailsHeader>
                    <PaymentDetailsTitle>Payment Details</PaymentDetailsTitle>
                    <CreateReceiptButton
                        onClick={() => setShowPaymentModal(true)}
                        disabled={invoice.status === 'void' || invoice.status === 'paid'}
                    >
                        <PlusIcon /> Create Receipt
                    </CreateReceiptButton>
                </PaymentDetailsHeader>
                <PaymentDetailsGrid>
                    <PaymentDetailItem>
                        <PaymentDetailLabel>Total Payment Due</PaymentDetailLabel>
                        <PaymentDetailValue>
                            {formatPrice(invoice.total, invoice.currency)}
                        </PaymentDetailValue>
                    </PaymentDetailItem>
                    <PaymentDetailItem>
                        <PaymentDetailLabel>Amount Paid</PaymentDetailLabel>
                        <PaymentDetailValue>
                            {formatPrice(invoice.paidAmount || 0, invoice.currency)}
                        </PaymentDetailValue>
                    </PaymentDetailItem>
                    <PaymentDetailItem>
                        <PaymentDetailLabel>Balance Due</PaymentDetailLabel>
                        <PaymentDetailValue>
                            {formatPrice(invoice.total - (invoice.paidAmount || 0), invoice.currency)}
                        </PaymentDetailValue>
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
                                    {formatPrice(receipt.amount, invoice.currency)}
                                </ReceiptAmount>
                            </ReceiptItem>
                        ))}
                    </ReceiptTimeline>
                )}
            </PaymentDetailsSection>
        );
    };

    // Add payment modal render function
    const renderPaymentModal = () => {
        if (!showPaymentModal) return null;

        const balanceDue = invoice.total - (invoice.paidAmount || 0);

        return (
            <ModalOverlay>
                <PaymentModalContent>
                    <ModalHeader>
                        <ModalIconWrapper>
                            <Icon name="receipt" size={20} color="#7C5DFA" />
                        </ModalIconWrapper>
                        <ModalTitle>Create Receipt</ModalTitle>
                    </ModalHeader>

                    <PaymentForm onSubmit={handleCreateReceipt}>
                        <FormRow>
                            <PaymentFormLabel>Invoice #</PaymentFormLabel>
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#f5f7fa',
                                border: '1px solid #e0e0e0',
                                borderRadius: '4px',
                                color: '#666',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <Icon name="file-text" size={14} color="#004359" />
                                {invoice.customId}
                            </div>
                        </FormRow>

                        <FormRow>
                            <PaymentFormLabel>Amount</PaymentFormLabel>
                            <div style={{ position: 'relative', width: '100%' }}>
                                <div style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#666',
                                    fontSize: '14px'
                                }}>
                                    {invoice.currency}
                                </div>
                                <FormInput
                                    type="text"
                                    value={paymentDetails.amount}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9.]/g, '');
                                        const numericValue = parseFloat(value);
                                        if (value === '' || (numericValue <= balanceDue && numericValue > 0)) {
                                            setPaymentDetails(prev => ({
                                                ...prev,
                                                amount: value
                                            }));
                                        }
                                    }}
                                    onBlur={(e) => {
                                        const value = e.target.value;
                                        if (value) {
                                            const numericValue = parseFloat(value);
                                            setPaymentDetails(prev => ({
                                                ...prev,
                                                amount: numericValue.toFixed(2)
                                            }));
                                        }
                                    }}
                                    required
                                    min="0"
                                    max={balanceDue}
                                    step="0.01"
                                    style={{ paddingLeft: '60px' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#666',
                                    fontSize: '12px'
                                }}>
                                    Balance Due: {formatPrice(balanceDue, invoice.currency)}
                                </div>
                            </div>
                        </FormRow>

                        <FormRow>
                            <PaymentFormLabel>Mode of Payment</PaymentFormLabel>
                            <FormSelect
                                value={paymentDetails.mode}
                                onChange={(e) => setPaymentDetails(prev => ({
                                    ...prev,
                                    mode: e.target.value,
                                    chequeNumber: e.target.value === 'cheque' ? prev.chequeNumber : ''
                                }))}
                                required
                            >
                                <option value="cash">Cash</option>
                                <option value="cheque">Cheque</option>
                                <option value="bank_transfer">Bank Transfer</option>
                            </FormSelect>
                        </FormRow>

                        {paymentDetails.mode === 'cheque' && (
                            <FormRow>
                                <PaymentFormLabel>Cheque Number</PaymentFormLabel>
                                <FormInput
                                    type="text"
                                    value={paymentDetails.chequeNumber}
                                    onChange={(e) => setPaymentDetails(prev => ({
                                        ...prev,
                                        chequeNumber: e.target.value
                                    }))}
                                    required
                                />
                            </FormRow>
                        )}

                        <FormRow>
                            <PaymentFormLabel>Date of Payment</PaymentFormLabel>
                            <FormInput
                                type="date"
                                value={paymentDetails.date}
                                onChange={(e) => setPaymentDetails(prev => ({
                                    ...prev,
                                    date: e.target.value
                                }))}
                                required
                                max={formatDate(new Date(), 'YYYY-MM-DD')}
                            />
                        </FormRow>

                        <FormRow>
                            <PaymentFormLabel>Notes (Optional)</PaymentFormLabel>
                            <FormTextArea
                                value={paymentDetails.notes}
                                onChange={(e) => setPaymentDetails(prev => ({
                                    ...prev,
                                    notes: e.target.value
                                }))}
                            />
                        </FormRow>

                        <ModalActions>
                            <Button
                                type="button"
                                onClick={() => setShowPaymentModal(false)}
                                $secondary
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                $primary
                                disabled={isCreatingReceipt || !paymentDetails.amount || parseFloat(paymentDetails.amount) <= 0}
                            >
                                {isCreatingReceipt ? (
                                    <>
                                        <Icon name="loading" size={16} color="white" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Receipt'
                                )}
                            </Button>
                        </ModalActions>
                    </PaymentForm>
                </PaymentModalContent>
            </ModalOverlay>
        );
    };

    const handleSendEmail = async () => {
        try {
            // Get the client's country from the invoice or client data
            const clientCountry = invoice?.clientAddress?.country || 
                                clientData?.country || 
                                'qatar';
            
            // Determine which company profile to use
            let companyProfile;
            try {
                if (clientCountry.toLowerCase().includes('emirates') || clientCountry.toLowerCase().includes('uae')) {
                    companyProfile = await getCompanyProfile('uae');
                } else {
                    companyProfile = await getCompanyProfile('qatar');
                }
            } catch (profileError) {
                companyProfile = {
                    name: 'Fortune Gifts',
                    address: 'Doha, Qatar',
                    phone: '+974 1234 5678',
                    vatNumber: 'VAT123456789',
                    crNumber: 'CR123456789'
                };
            }

            // Create a new container for PDF content
            const pdfContainer = document.createElement('div');
            pdfContainer.style.cssText = `
                width: 297mm;
                min-height: 420mm;
                padding: 5mm 20mm 20mm 20mm;
                margin: 0;
                background-color: white;
                box-sizing: border-box;
                position: relative;
                font-family: Arial, sans-serif;
                overflow: visible;
            `;

            // Add header
            pdfContainer.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div>
                        <img src="${window.location.origin}/images/invoice-logo.png" alt="${companyProfile.name} Logo" style="max-height: 80px;" onerror="this.onerror=null; this.src=''; this.alt='${companyProfile.name}'; this.style.fontSize='27px'; this.style.fontWeight='bold'; this.style.color='#004359';"/>
                    </div>
                    <div style="text-align: right; font-size: 19px; color: #000000;">
                        <div style="font-weight: bold; font-size: 21px; margin-bottom: 5px;">${companyProfile.name}</div>
                        <div>${companyProfile.address}</div>
                        <div>Tel: ${companyProfile.phone} | ${clientCountry.toLowerCase().includes('emirates') || clientCountry.toLowerCase().includes('uae') ? 'TRN' : 'CR'} Number: <span style="color: #FF4806;">${clientCountry.toLowerCase().includes('emirates') || clientCountry.toLowerCase().includes('uae') ? companyProfile.vatNumber : companyProfile.crNumber}</span></div>
                        <div>Email: sales@fortunegiftz.com | Website: www.fortunegiftz.com</div>
                    </div>
                </div>
                <div style="height: 2px; background-color: #004359; margin-bottom: 10px;"></div>
                <div style="text-align: center; margin-top: 25px;">
                    <h1 style="font-size: 32px; color: #004359; margin: 0; letter-spacing: 1px;">INVOICE</h1>
                </div>
            `;

            // Add client section
            const clientSection = document.createElement('div');
            clientSection.style.cssText = `
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                padding: 20px;
                background-color: white;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
            `;
            clientSection.innerHTML = `
                <div style="flex: 1;">
                    <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Bill To</div>
                    <div style="color: black; font-size: 16px;">
                        <strong>${invoice.clientName}</strong><br />
                        ${clientData?.address || invoice.clientAddress?.street || ''}
                        ${invoice.clientAddress?.city ? `, ${invoice.clientAddress.city}` : ''}
                        ${invoice.clientAddress?.postCode ? `, ${invoice.clientAddress.postCode}` : ''}
                        ${clientData?.country || invoice.clientAddress?.country ? `, ${clientData?.country || invoice.clientAddress?.country}` : ''}
                        ${clientData?.phone ? `<br />${clientData.phone}` : ''}
                        ${(clientCountry.toLowerCase().includes('emirates') || clientCountry.toLowerCase().includes('uae')) && clientData?.trn ? 
                            `<br /><span style="font-weight: 600;">TRN: ${clientData.trn}</span>` : ''}
                    </div>
                </div>
                <div style="display: flex; gap: 40px;">
                    <div style="text-align: right;">
                        <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Invoice #</div>
                        <div style="color: black; font-size: 16px; margin-bottom: 15px;">${invoice.customId || id}</div>
                        <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Due Date</div>
                        <div style="color: black; font-size: 16px;">${formatDate(invoice.paymentDue)}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Created Date</div>
                        <div style="color: black; font-size: 16px; margin-bottom: 15px;">${formatDate(invoice.createdAt)}</div>
                        ${invoice.lpoNumber ? `
                            <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">LPO Number</div>
                            <div style="color: black; font-size: 16px;">${invoice.lpoNumber}</div>
                        ` : ''}
                    </div>
                </div>
            `;
            pdfContainer.appendChild(clientSection);

            // Add items table
            const itemsTable = document.createElement('table');
            itemsTable.style.cssText = `
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                background-color: white;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                page-break-inside: auto;
            `;
            itemsTable.innerHTML = `
                <thead style="background-color: #004359; color: white;">
                    <tr>
                        <th style="padding: 15px; text-align: left; font-size: 18px;">Item Name</th>
                        <th style="padding: 15px; text-align: center; font-size: 18px;">QTY.</th>
                        <th style="padding: 15px; text-align: right; font-size: 18px;">Price</th>
                        ${clientHasVAT ? '<th style="padding: 15px; text-align: right; font-size: 18px;">VAT (5%)</th>' : ''}
                        <th style="padding: 15px; text-align: right; font-size: 18px;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoice.items.map(item => {
                        const itemVAT = item.vat || 0;
                        return `
                            <tr style="border-bottom: 1px solid #e0e0e0;">
                                <td style="padding: 15px; color: black; font-size: 16px;">
                                    ${item.name}
                                    ${item.description ? `<div style="font-size: 14px; color: #666;">${item.description}</div>` : ''}
                                </td>
                                <td style="padding: 15px; text-align: center; color: black; font-size: 16px;">${item.quantity || 0}</td>
                                <td style="padding: 15px; text-align: right; color: black; font-size: 16px;">${formatPrice(item.price || 0, invoice.currency)}</td>
                                ${clientHasVAT ? `<td style="padding: 15px; text-align: right; color: black; font-size: 16px;">${formatPrice(itemVAT, invoice.currency)}</td>` : ''}
                                <td style="padding: 15px; text-align: right; color: black; font-size: 16px;">${formatPrice(item.total || 0, invoice.currency)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            `;
            pdfContainer.appendChild(itemsTable);

            // Add total section
            const totalSection = document.createElement('div');
            totalSection.style.cssText = `
                background-color: #004359;
                color: white;
                padding: 15px;
                text-align: right;
                border-radius: 0 0 4px 4px;
                margin-bottom: 20px;
                page-break-inside: avoid;
            `;
            totalSection.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; opacity: 0.9;">
                        <span style="font-size: 14px;">Subtotal:</span>
                        <span style="font-size: 14px;">${formatPrice(invoice.subtotal || 0, invoice.currency)}</span>
                    </div>
                    ${clientHasVAT ? `
                        <div style="display: flex; justify-content: space-between; align-items: center; opacity: 0.9;">
                            <span style="font-size: 14px;">VAT (5%):</span>
                            <span style="font-size: 14px;">${formatPrice(invoice.totalVat || 0, invoice.currency)}</span>
                        </div>
                    ` : ''}
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                        <span style="font-size: 16px;">Total:</span>
                        <span style="font-size: 20px; font-weight: bold;">${formatPrice(invoice.total || 0, invoice.currency)}</span>
                    </div>
                </div>
            `;
            pdfContainer.appendChild(totalSection);

            // Add spacer for signature section
            const spacer = document.createElement('div');
            spacer.style.height = '50px';
            pdfContainer.appendChild(spacer);

            // Add Terms and Conditions and Bank Details in a two-column layout
            const infoSectionsGrid = document.createElement('div');
            infoSectionsGrid.style.cssText = `
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 24px;
                margin-bottom: 100px;
                page-break-inside: avoid;
            `;

            // Terms and Conditions section
            const termsSection = document.createElement('div');
            termsSection.style.cssText = `
                padding: 24px;
                background-color: #f5f7fa;
                border-radius: 8px;
                border: 1px solid #e0e0e0;
            `;
            termsSection.innerHTML = `
                <h3 style="font-size: 16px; font-weight: 600; color: #004359; margin: 0 0 16px; display: flex; align-items: center; gap: 8px;">
                    <span style="display: inline-block; width: 4px; height: 16px; background-color: #004359; border-radius: 2px;"></span>
                    Terms and Conditions
                </h3>
                <div style="font-size: 14px; line-height: 1.6; color: #666;">
                    ${invoice.termsAndConditions || defaultTermsAndConditions}
                </div>
            `;
            infoSectionsGrid.appendChild(termsSection);

            // Bank Details section
            const bankSection = document.createElement('div');
            bankSection.style.cssText = `
                padding: 24px;
                background-color: #f5f7fa;
                border-radius: 8px;
                border: 1px solid #e0e0e0;
            `;
            bankSection.innerHTML = `
                <h3 style="font-size: 16px; font-weight: 600; color: #004359; margin: 0 0 16px; display: flex; align-items: center; gap: 8px;">
                    <span style="display: inline-block; width: 4px; height: 16px; background-color: #004359; border-radius: 2px;"></span>
                    Bank Transfer Details
                </h3>
                <div style="font-size: 14px; line-height: 1.6; color: #666;">
                    ${companyProfile?.bankDetails ? `
                        <div style="margin-bottom: 8px;"><strong>Bank Name:</strong> ${companyProfile.bankDetails.bankName}</div>
                        <div style="margin-bottom: 8px;"><strong>Account Name:</strong> ${companyProfile.bankDetails.accountName}</div>
                        <div style="margin-bottom: 8px;"><strong>Account Number:</strong> ${companyProfile.bankDetails.accountNumber}</div>
                        <div style="margin-bottom: 8px;"><strong>IBAN:</strong> ${companyProfile.bankDetails.iban}</div>
                        <div style="margin-bottom: 8px;"><strong>SWIFT Code:</strong> ${companyProfile.bankDetails.swift}</div>
                    ` : 'No bank details available'}
                </div>
            `;
            infoSectionsGrid.appendChild(bankSection);

            pdfContainer.appendChild(infoSectionsGrid);

            // Add signature section
            const signatureSection = document.createElement('div');
            signatureSection.style.cssText = `
                position: absolute;
                bottom: 30mm;
                left: 20mm;
                right: 20mm;
                display: flex;
                flex-direction: column;
                background-color: white;
                padding: 20px;
                border-top: 1px solid #e0e0e0;
                z-index: 1000;
                page-break-inside: avoid;
            `;
            signatureSection.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <div style="width: 45%;">
                        <div style="border-bottom: 2px solid #004359; margin-bottom: 15px;"></div>
                        <div style="font-weight: bold; color: #004359; font-size: 19px;">Authorized Signature</div>
                    </div>
                    <div style="width: 45%;">
                        <div style="border-bottom: 2px solid #004359; margin-bottom: 15px;"></div>
                        <div style="font-weight: bold; color: #004359; font-size: 19px;">Client Acceptance</div>
                    </div>
                </div>
                <div style="text-align: center; color: #666; font-size: 12px; font-style: italic; margin-top: 10px;">
                    This is a computer-generated document and does not require a physical signature.
                </div>
            `;
            pdfContainer.appendChild(signatureSection);

            // Temporarily add to document to render
            pdfContainer.style.position = 'absolute';
            pdfContainer.style.left = '-9999px';
            document.body.appendChild(pdfContainer);

            // Create PDF with A3 size
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a3',
                compress: true
            });

            // Convert to canvas with A3 dimensions
            const canvas = await html2canvas(pdfContainer, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                width: 1122.5, // 297mm in pixels at 96 DPI
                height: 1587.4 // 420mm in pixels at 96 DPI
            });

            // Remove temporary elements
            document.body.removeChild(pdfContainer);

            // Add the image to fit A3 page
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, 297, 420);

            // Convert to base64
            const pdfBase64 = pdf.output('datauristring').split(',')[1];

            // Generate email content
            const emailContent = generateEmailTemplate({
                clientName: invoice.clientName,
                documentType: 'Invoice',
                documentId: invoice.customId,
                amount: invoice.total,
                currency: invoice.currency,
                dueDate: invoice.paymentDue ? format(new Date(invoice.paymentDue), 'dd/MM/yyyy') : 'N/A'
            });

            // Set email data and open modal
            setEmailData({
                to: invoice.clientEmail,
                subject: `Invoice ${invoice.customId} from ${companyProfile.name}`,
                content: emailContent
            });
            setPdfData({
                content: pdfBase64,
                name: `Invoice_${invoice.customId}.pdf`
            });
            setIsEmailModalOpen(true);
        } catch (error) {
            console.error('Error preparing email:', error);
            message.error('Failed to prepare email. Please try again.');
        }
    };

    const handleEmailSent = () => {
        // Handle post-email actions (e.g., show success message, update status)
        console.log('Email sent successfully');
        message.success('Email sent successfully');
        
        // Close the email modal if it's still open
        if (isEmailModalOpen) {
            setIsEmailModalOpen(false);
        }
    };

    // Show loading state
    if (isLoading || !invoice) {
        return (
            <StyledInvoiceView className="StyledInvoiceView">
                <Container>
                    <Link
                        to="/invoices"
                        variants={variant('link')}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="Link"
                        style={{ marginBottom: '28px' }}
                    >
                        <Icon name={'arrow-left'} size={10} color={colors.purple} />
                        Go back
                    </Link>
                    
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
                <Link
                    to="/invoices"
                    variants={variant('link')}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <Icon name="arrow-left" size={16} color="inherit" />
                    Go back
                </Link>

                <HeaderSection>
                    <HeaderTitle>Invoice</HeaderTitle>
                </HeaderSection>

                <Controller
                    variants={variant('controller')}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <StatusBadge status={invoice.status}>
                            <span>
                                {invoice.status === 'paid' ? 'Paid' : 
                                 invoice.status === 'pending' ? 'Pending' : 
                                 invoice.status === 'partially_paid' ? 'Partially Paid' : 
                                 invoice.status === 'void' ? 'Void' : 'Draft'}
                            </span>
                        </StatusBadge>
                        <DownloadButton onClick={handleDownloadPDF} className="DownloadButton">
                            <Icon name="download" size={13} />
                            Share
                        </DownloadButton>
                    </div>
                    
                    {isDesktop && (
                        <ButtonWrapper className="ButtonWrapper">
                            {!isVoid && !isPaid && (
                                <>
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

                {renderPaymentDetails()}

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
                                    <Link
                                        to={`/quotation/${invoice.quotationId}`}
                                        style={{ 
                                            color: 'white',
                                            textDecoration: 'none',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            marginLeft: '4px',
                                            marginTop: '10px',
                                            verticalAlign: 'middle'
                                        }}
                                    >
                                        #{isFetchingQuotation ? 'Loading...' : (quotationData?.customId || invoice.quotationId)}
                                    </Link>
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
                            {!isEditingDueDate ? (
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    backgroundColor: '#f5f7fa',
                                    border: '1px solid #e0e0e0',
                                    transition: 'all 0.2s ease',
                                    marginTop: '4px'
                                }}>
                                    <Icon 
                                        name="calendar" 
                                        size={14} 
                                        color="#004359"
                                    />
                                    <span style={{ 
                                        color: '#004359',
                                        fontWeight: '500'
                                    }}>
                                        {formatDate(invoice.paymentDue)}
                                    </span>
                                    <Button
                                        onClick={() => {
                                            setEditedDueDate(formatDate(invoice.paymentDue, 'YYYY-MM-DD'));
                                            setIsEditingDueDate(true);
                                        }}
                                        $secondary
                                        style={{ 
                                            padding: '4px 8px', 
                                            fontSize: '12px',
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            color: '#004359',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(0, 67, 89, 0.05)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        <Icon name="edit" size={12} />
                                        Edit
                                    </Button>
                                </div>
                            ) : (
                                <div style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    gap: '8px',
                                    padding: '8px',
                                    backgroundColor: '#f5f7fa',
                                    borderRadius: '4px',
                                    border: '1px solid #e0e0e0',
                                    marginTop: '4px'
                                }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px'
                                    }}>
                                        <Icon name="calendar" size={14} color="#004359" />
                                        <input
                                            type="date"
                                            value={editedDueDate}
                                            onChange={(e) => setEditedDueDate(e.target.value)}
                                            style={{
                                                padding: '6px 12px',
                                                border: '1px solid #e0e0e0',
                                                borderRadius: '4px',
                                                fontSize: '14px',
                                                width: '200px',
                                                backgroundColor: 'white',
                                                transition: 'all 0.2s ease'
                                            }}
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleDueDateUpdate();
                                                }
                                            }}
                                        />
                                    </div>
                                    <div style={{ 
                                        display: 'flex', 
                                        gap: '8px',
                                        justifyContent: 'flex-end'
                                    }}>
                                        <Button
                                            onClick={() => setIsEditingDueDate(false)}
                                            $secondary
                                            style={{ 
                                                padding: '6px 12px', 
                                                fontSize: '12px',
                                                backgroundColor: 'transparent',
                                                border: '1px solid #e0e0e0',
                                                color: '#666'
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleDueDateUpdate}
                                            $primary
                                            style={{ 
                                                padding: '6px 12px', 
                                                fontSize: '12px',
                                                backgroundColor: '#004359',
                                                border: 'none',
                                                color: 'white'
                                            }}
                                            disabled={!editedDueDate}
                                        >
                                            Save Due Date
                                        </Button>
                                    </div>
                                </div>
                            )}
                            <br />
                            <AddressTitle>LPO Number</AddressTitle>
                            {!isEditingLPO ? (
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    backgroundColor: invoice.lpoNumber ? '#f5f7fa' : '#fff3e0',
                                    border: `1px solid ${invoice.lpoNumber ? '#e0e0e0' : '#ffb74d'}`,
                                    transition: 'all 0.2s ease',
                                    marginTop: '4px'
                                }}>
                                    <Icon 
                                        name={invoice.lpoNumber ? "file-text" : "alert-circle"} 
                                        size={14} 
                                        color={invoice.lpoNumber ? "#004359" : "#ff9800"}
                                    />
                                    <span style={{ 
                                        color: invoice.lpoNumber ? '#004359' : '#ff9800',
                                        fontWeight: invoice.lpoNumber ? 'normal' : '500'
                                    }}>
                                        {invoice.lpoNumber || 'LPO Number Required'}
                                    </span>
                                    <Button
                                        onClick={() => {
                                            setEditedLPO(invoice.lpoNumber || '');
                                            setIsEditingLPO(true);
                                        }}
                                        $secondary
                                        style={{ 
                                            padding: '4px 8px', 
                                            fontSize: '12px',
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            color: invoice.lpoNumber ? '#004359' : '#ff9800',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(0, 67, 89, 0.05)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        <Icon name="edit" size={12} />
                                        {invoice.lpoNumber ? 'Edit' : 'Add'}
                                    </Button>
                                </div>
                            ) : (
                                <div style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    gap: '8px',
                                    padding: '8px',
                                    backgroundColor: '#f5f7fa',
                                    borderRadius: '4px',
                                    border: '1px solid #e0e0e0',
                                    marginTop: '4px'
                                }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px'
                                    }}>
                                        <Icon name="file-text" size={14} color="#004359" />
                                        <input
                                            type="text"
                                            value={editedLPO}
                                            onChange={(e) => setEditedLPO(e.target.value)}
                                            style={{
                                                padding: '6px 12px',
                                                border: '1px solid #e0e0e0',
                                                borderRadius: '4px',
                                                fontSize: '14px',
                                                width: '200px',
                                                backgroundColor: 'white',
                                                transition: 'all 0.2s ease'
                                            }}
                                            placeholder="Enter LPO number"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleLPOUpdate();
                                                }
                                            }}
                                        />
                                    </div>
                                    <div style={{ 
                                        display: 'flex', 
                                        gap: '8px',
                                        justifyContent: 'flex-end'
                                    }}>
                                        <Button
                                            onClick={() => setIsEditingLPO(false)}
                                            $secondary
                                            style={{ 
                                                padding: '6px 12px', 
                                                fontSize: '12px',
                                                backgroundColor: 'transparent',
                                                border: '1px solid #e0e0e0',
                                                color: '#666'
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleLPOUpdate}
                                            $primary
                                            style={{ 
                                                padding: '6px 12px', 
                                                fontSize: '12px',
                                                backgroundColor: '#004359',
                                                border: 'none',
                                                color: 'white'
                                            }}
                                            disabled={!editedLPO.trim()}
                                        >
                                            Save LPO Number
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </AddressGroup>
                    </InfoAddresses>
                    
                    {invoice.clientEmail && (
                        <AddressGroup style={{
                            border: `1px solid ${colors.border}`,
                            borderRadius: '8px',
                            padding: '16px',
                            backgroundColor: colors.backgroundItem || colors.background,
                            marginBottom: '32px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <AddressTitle>Sent to</AddressTitle>
                                <AddressText>
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        <Icon name="mail" size={13} style={{ marginRight: '6px', color: colors.purple }} />
                                        {invoice.clientEmail}
                                    </span>
                                </AddressText>
                            </div>
                            <Button
                                $secondary
                                onClick={handleSendEmail}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: `1px solid ${colors.border}`,
                                    backgroundColor: 'transparent',
                                    color: colors.text,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <Icon name="mail" size={13} style={{ marginRight: '6px' }} />
                                Send
                            </Button>
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
                                const itemVAT = item.vat || 0;
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
                                            {formatPrice(item.total || 0, invoice.currency)}
                                        </ItemTotal>
                                    </Item>
                                );
                            })}
                        </Items>
                        
                        <Total>
                            <div>
                                <TotalText>Subtotal</TotalText>
                                <TotalAmount>{formatPrice(invoice.subtotal || 0, invoice.currency)}</TotalAmount>
                            </div>
                            {clientHasVAT && (
                                <div>
                                    <TotalText>VAT (5%)</TotalText>
                                    <TotalAmount>{formatPrice(invoice.totalVat || 0, invoice.currency)}</TotalAmount>
                                </div>
                            )}
                            <div className="grand-total">
                                <TotalText>Total</TotalText>
                                <TotalAmount>{formatPrice(invoice.total || 0, invoice.currency)}</TotalAmount>
                            </div>
                        </Total>
                    </Details>
                    
                    <InfoSectionsGrid>
                        <TermsSection className="TermsSection">
                            <TermsHeader>
                                <TermsTitle>Notes</TermsTitle>
                                {!isEditingTerms ? (
                                    <Button
                                        onClick={() => {
                                            setEditedTerms(invoice.termsAndConditions || defaultTermsAndConditions);
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
                                            onClick={handleTermsUpdate}
                                            $primary
                                            style={{ padding: '6px 12px', fontSize: '13px' }}
                                        >
                                            Save
                                        </Button>
                                    </TermsActions>
                                )}
                            </TermsHeader>
                            {isEditingTerms ? (
                                <TermsTextArea
                                    value={editedTerms}
                                    onChange={(e) => setEditedTerms(e.target.value)}
                                    placeholder="Enter notes..."
                                />
                            ) : (
                                <TermsText>
                                    {invoice.termsAndConditions || defaultTermsAndConditions}
                                </TermsText>
                            )}
                        </TermsSection>

                        {renderBankDetails()}
                    </InfoSectionsGrid>
                </InfoCard>
            </Container>

            {/* Mobile action buttons */}
            {!isDesktop && (
                <ButtonWrapper>
                    {!isVoid && !isPaid && (
                        <>
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

            {renderPaymentModal()}

            {isEmailModalOpen && emailData && pdfData && (
                <EmailPreviewModal
                    isOpen={isEmailModalOpen}
                    onClose={() => setIsEmailModalOpen(false)}
                    onSend={handleEmailSent}
                    emailData={emailData}
                    documentType="invoice"
                    documentId={invoice.id}
                    clientName={invoice.clientName}
                    clientEmail={invoice.clientEmail}
                    amount={invoice.total}
                    currency={invoice.currency}
                    dueDate={invoice.dueDate}
                    pdfBase64={pdfData.content}
                    pdfName={pdfData.name}
                />
            )}
        </StyledInvoiceView>
    );
};

export default InvoiceView;
