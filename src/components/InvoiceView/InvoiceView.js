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
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
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
    DownloadButton,
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

    // Add getCompanyProfile function
    const getCompanyProfile = async (country) => {
        try {
            // Convert country to lowercase for database query
            const countryLower = country.toLowerCase();
            
            const companyProfilesRef = collection(db, 'companyProfiles');
            
            // Query for the specific country
            const q = query(companyProfilesRef, where('country', '==', countryLower));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const profile = querySnapshot.docs[0].data();
                return {
                    name: profile.name || 'Fortune Gifts',
                    address: profile.address || '',
                    phone: profile.phone || '',
                    vatNumber: profile.vatNumber || '',
                    crNumber: profile.crNumber || ''
                };
            }
            
            // If no profile found for UAE, return Qatar profile as default
            if (countryLower === 'uae') {
                return getCompanyProfile('qatar');
            }
            
            // Default Qatar profile
            return {
                name: 'Fortune Gifts',
                address: 'P.O Box 123456, Doha, Qatar',
                phone: '+974 1234 5678',
                vatNumber: '',
                crNumber: 'CR123456789'
            };
        } catch (error) {
            // Return default Qatar profile in case of error
            return {
                name: 'Fortune Gifts',
                address: 'P.O Box 123456, Doha, Qatar',
                phone: '+974 1234 5678',
                vatNumber: '',
                crNumber: 'CR123456789'
            };
        }
    };

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
                <div style="text-align: right;">
                    <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Invoice #</div>
                    <div style="color: black; font-size: 16px; margin-bottom: 15px;">${invoice.customId || id}</div>
                    <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Due Date</div>
                    <div style="color: black; font-size: 16px;">${formatDate(invoice.paymentDue)}</div>
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
                        const itemVAT = clientHasVAT ? calculateVAT(item.total || 0) : 0;
                        return `
                            <tr style="border-bottom: 1px solid #e0e0e0;">
                                <td style="padding: 15px; color: black; font-size: 16px;">
                                    ${item.name}
                                    ${item.description ? `<div style="font-size: 14px; color: #666;">${item.description}</div>` : ''}
                                </td>
                                <td style="padding: 15px; text-align: center; color: black; font-size: 16px;">${item.quantity || 0}</td>
                                <td style="padding: 15px; text-align: right; color: black; font-size: 16px;">${formatPrice(item.price || 0, invoice.currency)}</td>
                                ${clientHasVAT ? `<td style="padding: 15px; text-align: right; color: black; font-size: 16px;">${formatPrice(itemVAT, invoice.currency)}</td>` : ''}
                                <td style="padding: 15px; text-align: right; color: black; font-size: 16px;">${formatPrice(clientHasVAT ? calculateTotalWithVAT(item.total || 0) : (item.total || 0), invoice.currency)}</td>
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
            `;
            totalSection.innerHTML = `
                <div style="font-size: 18px; margin-bottom: 4px;">Grand Total</div>
                ${clientHasVAT ? `<div style="font-size: 11px; opacity: 0.8;">Includes VAT: ${formatPrice(vatAmount, invoice.currency)}</div>` : ''}
                <div style="font-size: 24px; font-weight: bold;">${formatPrice(grandTotal, invoice.currency)}</div>
            `;
            pdfContainer.appendChild(totalSection);

            // Add terms section if exists
            if (invoice.termsAndConditions) {
                const termsSection = document.createElement('div');
                termsSection.style.cssText = `
                    padding: 20px;
                    background-color: white;
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    margin-bottom: 20px;
                `;
                
                // Format the terms and conditions text
                const formattedTerms = invoice.termsAndConditions
                    .split('\n') // Split by newlines
                    .map(line => line.trim()) // Trim whitespace
                    .filter(line => line.length > 0) // Remove empty lines
                    .map(line => {
                        // Check if line starts with a number (for numbered lists)
                        if (/^\d+\./.test(line)) {
                            return `<div style="margin-bottom: 8px; color: black; font-size: 16px;">${line}</div>`;
                        }
                        // Check if line is a heading (all caps or starts with common heading words)
                        else if (line.toUpperCase() === line || 
                                /^(Terms|Conditions|Payment|Delivery|Warranty|Cancellation|Force Majeure|Governing Law)/i.test(line)) {
                            return `<div style="margin-top: 16px; margin-bottom: 8px; color: #004359; font-weight: bold; font-size: 18px;">${line}</div>`;
                        }
                        // Regular paragraph
                        else {
                            return `<div style="margin-bottom: 8px; color: black; font-size: 16px;">${line}</div>`;
                        }
                    })
                    .join('');

                termsSection.innerHTML = `
                    <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 16px;">Terms and Conditions</div>
                    <div style="color: black; font-size: 16px; line-height: 1.5;">
                        ${formattedTerms}
                    </div>
                `;
                pdfContainer.appendChild(termsSection);
            }

            // Add spacer for signature section
            const spacer = document.createElement('div');
            spacer.style.height = '150px';
            pdfContainer.appendChild(spacer);

            // Add signature section
            const signatureSection = document.createElement('div');
            signatureSection.style.cssText = `
                position: absolute;
                bottom: 30mm;
                left: 20mm;
                right: 20mm;
                display: flex;
                justify-content: space-between;
            `;
            signatureSection.innerHTML = `
                <div style="width: 45%;">
                    <div style="border-bottom: 2px solid #004359; margin-bottom: 15px;"></div>
                    <div style="font-weight: bold; color: #004359; font-size: 19px;">Authorized Signature</div>
                </div>
                <div style="width: 45%;">
                    <div style="border-bottom: 2px solid #004359; margin-bottom: 15px;"></div>
                    <div style="font-weight: bold; color: #004359; font-size: 19px;">Client Acceptance</div>
                </div>
            `;
            pdfContainer.appendChild(signatureSection);

            // Temporarily add to document to render
            pdfContainer.style.position = 'absolute';
            pdfContainer.style.left = '-9999px';
            document.body.appendChild(pdfContainer);

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

            // Create PDF with A3 size
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a3',
                compress: true
            });

            // Add the image to fit A3 page
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, 297, 420);

            // Save the PDF
            pdf.save(`Invoice_${invoice.customId || id}.pdf`);
        } catch (error) {
            alert('There was an error generating the PDF. Please try again.');
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
                            Download PDF
                        </DownloadButton>
                    </div>
                    
                    {isDesktop && (
                        <ButtonWrapper className="ButtonWrapper">
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
