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
    const [invoiceCustomId, setInvoiceCustomId] = useState(null);
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
                console.log('Raw receipt data from Firebase:', data);
                
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
                
                console.log('Processed receipt data:', fetchedReceipt);
                console.log('Invoice ID fields:', {
                    invoiceCustomId: fetchedReceipt.invoiceCustomId,
                    invoiceId: fetchedReceipt.invoiceId,
                    invoice: fetchedReceipt.invoice
                });
                
                setReceipt(fetchedReceipt);
                
                // After fetching receipt, fetch client data
                await fetchClientData(fetchedReceipt.clientId, fetchedReceipt.clientName);
                
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error fetching receipt:', error);
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

    // Add useEffect to fetch invoice custom ID
    useEffect(() => {
        const fetchInvoiceCustomId = async () => {
            if (receipt?.invoiceId) {
                try {
                    const invoiceRef = doc(db, 'invoices', receipt.invoiceId);
                    const invoiceSnap = await getDoc(invoiceRef);
                    if (invoiceSnap.exists()) {
                        const invoiceData = invoiceSnap.data();
                        setInvoiceCustomId(invoiceData.customId);
                    }
                } catch (error) {
                    console.error('Error fetching invoice:', error);
                }
            }
        };

        fetchInvoiceCustomId();
    }, [receipt?.invoiceId]);

    // Calculate VAT for a single amount
    const calculateVAT = (amount) => {
        return clientHasVAT ? amount * 0.05 : 0;
    };

    // Add getCompanyProfile function
    const getCompanyProfile = async (country) => {
        try {
            // Convert country to lowercase and handle variations
            const countryLower = country.toLowerCase();
            let searchCountry = countryLower;
            
            // Handle UAE variations
            if (countryLower.includes('emirates') || countryLower.includes('uae')) {
                searchCountry = 'uae';
            }
            
            // Query the companies collection
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

    // Handle download PDF
    const handleDownloadPDF = async () => {
        try {
            // Get the client's country from the receipt or client data
            const clientCountry = receipt?.clientAddress?.country || 
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
                    <h1 style="font-size: 32px; color: #004359; margin: 0; letter-spacing: 1px;">RECEIPT</h1>
                </div>
            `;

            // Add client section
            const clientSection = document.createElement('div');
            clientSection.style.cssText = `
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
                margin-top: 30px;
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #e0e0e0;
            `;
            clientSection.innerHTML = `
                <div>
                    <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Bill To</div>
                    <div style="color: black; font-size: 16px; margin-bottom: 5px;">${receipt.clientName}</div>
                    ${receipt.clientAddress?.street ? `<div style="color: black; font-size: 16px;">${receipt.clientAddress.street}</div>` : ''}
                    ${receipt.clientAddress?.city ? `<div style="color: black; font-size: 16px;">${receipt.clientAddress.city}${receipt.clientAddress?.postCode ? `, ${receipt.clientAddress.postCode}` : ''}</div>` : ''}
                    ${receipt.clientAddress?.country ? `<div style="color: black; font-size: 16px;">${receipt.clientAddress.country}</div>` : ''}
                    ${receipt.clientPhone ? `<div style="color: black; font-size: 16px;">${receipt.clientPhone}</div>` : ''}
                    ${receipt.clientTRN ? `<div style="color: black; font-size: 16px;">TRN: ${receipt.clientTRN}</div>` : ''}
                </div>
                <div style="text-align: right;">
                    <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Receipt Details</div>
                    <div style="color: black; font-size: 16px; margin-bottom: 5px;">Receipt #: ${receipt.customId}</div>
                    <div style="color: black; font-size: 16px; margin-bottom: 5px;">Date: ${formatDate(receipt.paymentDate)}</div>
                    <div style="color: black; font-size: 16px;">Invoice #: ${invoiceCustomId || receipt.invoiceId}</div>
                </div>
            `;
            pdfContainer.appendChild(clientSection);

            // Add payment details section
            const paymentSection = document.createElement('div');
            paymentSection.style.cssText = `
                background-color: #004359;
                color: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 30px;
            `;
            paymentSection.innerHTML = `
                <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">Payment Details</div>
                <div style="font-size: 16px; margin-bottom: 10px;">Amount Paid: ${formatPrice(receipt.amount, receipt.currency)}</div>
                ${clientHasVAT ? `<div style="font-size: 16px; margin-bottom: 10px;">VAT (5%): ${formatPrice(calculateVAT(receipt.amount), receipt.currency)}</div>` : ''}
                <div style="font-size: 16px; margin-bottom: 10px;">Payment Mode: ${receipt.mode || 'Not specified'}</div>
                ${receipt.mode === 'cheque' && receipt.chequeNumber ? `<div style="font-size: 16px; margin-bottom: 10px;">Cheque Number: ${receipt.chequeNumber}</div>` : ''}
                ${receipt.notes ? `<div style="font-size: 16px;">Notes: ${receipt.notes}</div>` : ''}
            `;
            pdfContainer.appendChild(paymentSection);

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

            // Add footer text
            const footerText = document.createElement('div');
            footerText.style.cssText = `
                position: absolute;
                bottom: 20mm;
                left: 20mm;
                right: 20mm;
                text-align: center;
                color: #666;
                font-size: 12px;
                font-style: italic;
            `;
            footerText.innerHTML = 'This is a computer-generated receipt and does not require a physical signature.';
            pdfContainer.appendChild(footerText);

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
            pdf.save(`Receipt_${receipt.customId || receipt.id}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('There was an error generating the PDF. Please try again.');
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

    // Add renderClientSection function
    const renderClientSection = () => {
        // Check for TRN in various possible field names
        const clientTRN = 
            receipt.clientTRN ||
            clientData?.trn || 
            clientData?.TRN || 
            clientData?.trnNumber ||
            clientData?.taxRegistrationNumber || 
            clientData?.tax_registration_number ||
            clientData?.taxNumber;
            
        // Check if client is from UAE
        const isUAE = (receipt.clientAddress?.country || clientData?.country)?.toLowerCase().includes('emirates') || 
                      (receipt.clientAddress?.country || clientData?.country)?.toLowerCase().includes('uae');

        // Get client details from either receipt or clientData
        const clientName = receipt.clientName;
        const clientAddress = receipt.clientAddress?.street;
        const clientCity = receipt.clientAddress?.city;
        const clientPostCode = receipt.clientAddress?.postCode;
        const clientCountry = receipt.clientAddress?.country;
        const clientPhone = receipt.clientPhone;

        return (
            <AddressGroup>
                <AddressTitle>Bill To</AddressTitle>
                <AddressText>
                    <strong>{clientName}</strong>
                    {clientAddress && (
                        <>
                            <br />
                            {clientAddress}
                        </>
                    )}
                    {clientCity && `, ${clientCity}`}
                    {clientPostCode && `, ${clientPostCode}`}
                    {clientCountry && `, ${clientCountry}`}
                    {clientPhone && (
                        <>
                            <br />
                            {clientPhone}
                        </>
                    )}
                    {isUAE && clientTRN && (
                        <>
                            <br />
                            <span style={{ fontWeight: '600' }}>
                                TRN: {clientTRN}
                            </span>
                        </>
                    )}
                </AddressText>
            </AddressGroup>
        );
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
                        {renderClientSection()}
                        
                        <AddressGroup align="right">
                            <AddressTitle>Receipt #</AddressTitle>
                            <AddressText>
                                {receipt.customId || receipt.id}
                            </AddressText>
                            <br />
                            <AddressTitle>Invoice #</AddressTitle>
                            <AddressText>
                                {invoiceCustomId || receipt.invoiceId || 'N/A'}
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
                    
                    {/* Payment Details Section */}
                    <Details className="Details">
                        <Total className="Total">
                            <div>
                                <TotalText>Amount Paid</TotalText>
                                {clientHasVAT && (
                                    <div style={{ marginTop: '4px', fontSize: '11px', opacity: 0.8, color: 'white' }}>
                                        Includes VAT: {formatPrice(calculateVAT(receipt.amount), receipt.currency)}
                                    </div>
                                )}
                                <div style={{ marginTop: '8px', fontSize: '13px', opacity: 0.9, color: 'white' }}>
                                    Payment Mode: {receipt.mode || 'Not specified'}
                                </div>
                                {receipt.mode === 'cheque' && receipt.chequeNumber && (
                                    <div style={{ marginTop: '4px', fontSize: '13px', opacity: 0.9, color: 'white' }}>
                                        Cheque Number: {receipt.chequeNumber}
                                    </div>
                                )}
                            </div>
                            <TotalAmount>
                                {formatPrice(receipt.amount, receipt.currency)}
                            </TotalAmount>
                        </Total>
                    </Details>
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