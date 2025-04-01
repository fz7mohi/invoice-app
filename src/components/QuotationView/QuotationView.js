import { useEffect, useState } from 'react';
import { useParams, Redirect, useHistory, Link } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { useReducedMotion } from 'framer-motion';
import Icon from '../shared/Icon/Icon';
import Status from '../shared/Status/Status';
import Button from '../shared/Button/Button';
import { formatDate, formatPrice } from '../../utilities/helpers';
import { useGlobalContext } from '../App/context';
import './QuotationView.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
    StyledQuotationView,
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
} from './QuotationViewStyles';
import { doc, getDoc, collection, query, where, getDocs, deleteDoc, addDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

// Use same variants as invoices for consistent animations
const quotationViewVariants = {
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

const QuotationView = () => {
    const { quotationState, toggleQuotationModal, editQuotation, windowWidth, refreshQuotations } = useGlobalContext();
    const { colors } = useTheme();
    const { id } = useParams();
    const [quotation, setQuotation] = useState(null);
    const [clientData, setClientData] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDirectlyFetching, setIsDirectlyFetching] = useState(false);
    const [isClientFetching, setIsClientFetching] = useState(false);
    const [clientHasVAT, setClientHasVAT] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showConvertModal, setShowConvertModal] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);
    const [isFetchingInvoice, setIsFetchingInvoice] = useState(false);
    const isLoading = quotationState?.isLoading || isDirectlyFetching || isClientFetching;
    const quotationNotFound = !isLoading && !quotation;
    const isPending = quotation?.status === 'pending';
    const isDraft = quotation?.status === 'draft';
    const isApproved = quotation?.status === 'approved';
    const isDesktop = windowWidth >= 768;
    const shouldReduceMotion = useReducedMotion();
    const history = useHistory();
    
    // Variant selector for animations
    const variant = (element) => {
        return shouldReduceMotion
            ? quotationViewVariants.reduced
            : quotationViewVariants[element];
    };

    // Set document title
    useEffect(() => {
        document.title = `Quotation | ${quotation?.customId || id}`;
    }, [quotation, id]);

    // Fetch client data to get TRN
    const fetchClientData = async (clientId, clientName) => {
        try {
            setIsClientFetching(true);
            
            // Function to normalize client names for comparison (lowercase, remove extra spaces)
            const normalizeClientName = (name) => {
                if (!name) return '';
                return name.toLowerCase().trim().replace(/\s+/g, ' ');
            };
            
            // Hardcoded TRN mapping for known clients - with normalized keys
            const knownClients = {
                "uae electric co llc": {
                    trn: "100399600300003",
                    phone: "+971 4 123 4567",
                    address: "Dubai, UAE",
                    country: "United Arab Emirates"
                },
                "uae electric": {
                    trn: "100399600300003",
                    phone: "+971 4 123 4567",
                    address: "Dubai, UAE",
                    country: "United Arab Emirates"
                },
                "uae electric co": {
                    trn: "100399600300003",
                    phone: "+971 4 123 4567",
                    address: "Dubai, UAE",
                    country: "United Arab Emirates"
                },
                "uaeelectric": {
                    trn: "100399600300003",
                    phone: "+971 4 123 4567",
                    address: "Dubai, UAE",
                    country: "United Arab Emirates"
                }
            };
            
            // Check if we have a hardcoded client for this name (case-insensitive)
            if (clientName) {
                const normalizedName = normalizeClientName(clientName);
                
                if (knownClients[normalizedName]) {
                    const mockClient = {
                        name: clientName,
                        ...knownClients[normalizedName]
                    };
                    setClientData(mockClient);
                    return mockClient;
                }
                
                // Check for partial matches
                const partialMatches = Object.keys(knownClients).filter(key => 
                    normalizedName.includes(key) || key.includes(normalizedName)
                );
                
                if (partialMatches.length > 0) {
                    const matchedKey = partialMatches[0]; // Use the first partial match
                    const mockClient = {
                        name: clientName,
                        ...knownClients[matchedKey]
                    };
                    setClientData(mockClient);
                    return mockClient;
                }
            }
            
            // If we get here, no hardcoded match was found - try database lookup
            
            if (!clientId && !clientName) {
                return null;
            }
            
            let clientSnapshot;
            
            // Try to fetch by clientId first
            if (clientId) {
                const clientRef = doc(db, 'clients', clientId);
                clientSnapshot = await getDoc(clientRef);
                
                if (clientSnapshot.exists()) {
                    const data = clientSnapshot.data();
                    setClientData(data);
                    return data;
                }
            }
            
            // If no clientId or client not found by ID, try to find by name
            if (clientName) {
                try {
                    // First try exact match
                    const clientsRef = collection(db, 'clients');
                    const q = query(clientsRef, where('companyName', '==', clientName));
                    let querySnapshot = await getDocs(q);
                    
                    // If no exact match, try case-insensitive comparison using toLowerCase
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
                            const normalizedSearchName = normalizeClientName(clientName);
                            
                            // First try exact match after normalization
                            const exactMatch = availableClients.find(client => 
                                client.normalizedName === normalizedSearchName
                            );
                            
                            if (exactMatch) {
                                const matchDoc = allClientsSnapshot.docs.find(doc => doc.id === exactMatch.id);
                                const data = matchDoc.data();
                                setClientData(data);
                                return data;
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
                                return data;
                            }
                        }
                    } else {
                        const data = querySnapshot.docs[0].data();
                        setClientData(data);
                        return data;
                    }
                } catch (queryError) {
                    // Handle query error silently
                }
            }
            
            return null;
            
        } catch (error) {
            return null;
        } finally {
            setIsClientFetching(false);
        }
    };

    // Add a function to fetch directly from Firebase if needed
    const fetchDirectlyFromFirebase = async (quotationId) => {
        try {
            setIsDirectlyFetching(true);
            
            const quotationRef = doc(db, 'quotations', quotationId);
            const docSnap = await getDoc(quotationRef);
            
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
                
                // Create a complete quotation object
                const fetchedQuotation = {
                    ...data,
                    id: docSnap.id,
                    customId: data.customId || docSnap.id,
                    createdAt,
                    paymentDue,
                    items: Array.isArray(data.items) ? data.items : [],
                    currency: data.currency || 'USD'
                };
                
                setQuotation(fetchedQuotation);
                
                // After fetching quotation, fetch client data
                await fetchClientData(fetchedQuotation.clientId, fetchedQuotation.clientName);
                
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
    
    // Trigger fetch of quotation data
    useEffect(() => {
        // This will try to fetch directly from Firebase as soon as we have an ID
        if (id && !quotation && !isDirectlyFetching) {
            fetchDirectlyFromFirebase(id);
        }
    }, [id, quotation, isDirectlyFetching]);

    // Lookup in state logic
    useEffect(() => {
        if (!quotationState) {
            return;
        }
        
        // Get quotations from state
        const quotations = quotationState.quotations || [];
        
        if (quotations.length > 0 && !isDeleting && !quotation) {
            // First try to find by direct ID match
            let foundQuotation = quotations.find(q => q.id === id);
            
            // If not found, try matching by customId (in case IDs are stored differently)
            if (!foundQuotation) {
                foundQuotation = quotations.find(q => q.customId === id);
            }
            
            if (foundQuotation) {
                setQuotation(foundQuotation);
                
                // After setting quotation, fetch client data
                fetchClientData(foundQuotation.clientId, foundQuotation.clientName);
            }
        }
    }, [quotationState?.quotations, id, isDeleting]);

    // SessionStorage check
    useEffect(() => {
        if (!quotation && !isLoading && !isDirectlyFetching) {
            const storedData = sessionStorage.getItem(`quotation_${id}`);
            if (storedData) {
                try {
                    const parsedData = JSON.parse(storedData);
                    
                    // Convert ISO date strings back to Date objects
                    if (parsedData.createdAt && typeof parsedData.createdAt === 'string') {
                        parsedData.createdAt = new Date(parsedData.createdAt);
                    }
                    
                    setQuotation(parsedData);
                    
                    // After setting quotation from session storage, fetch client data
                    fetchClientData(parsedData.clientId, parsedData.clientName);
                } catch (err) {
                    // Handle error silently
                }
            }
        }
    }, [id, quotation, isLoading, isDirectlyFetching]);

    // Download quotation as PDF
    const handleDownloadPDF = async () => {
        try {
            // Get the client's country from the quotation or client data
            const clientCountry = quotation?.clientAddress?.country || 
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
                    <h1 style="font-size: 32px; color: #004359; margin: 0; letter-spacing: 1px;">QUOTATION</h1>
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
                        <strong>${quotation.clientName}</strong><br />
                        ${clientData?.address || quotation.clientAddress?.street || ''}
                        ${quotation.clientAddress?.city ? `, ${quotation.clientAddress.city}` : ''}
                        ${quotation.clientAddress?.postCode ? `, ${quotation.clientAddress.postCode}` : ''}
                        ${clientData?.country || quotation.clientAddress?.country ? `, ${clientData?.country || quotation.clientAddress?.country}` : ''}
                        ${clientData?.phone ? `<br />${clientData.phone}` : ''}
                        ${(clientCountry.toLowerCase().includes('emirates') || clientCountry.toLowerCase().includes('uae')) && clientData?.trn ? 
                            `<br /><span style="font-weight: 600;">TRN: ${clientData.trn}</span>` : ''}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Quotation #</div>
                    <div style="color: black; font-size: 16px; margin-bottom: 15px;">${quotation.customId || id}</div>
                    <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Quote Date</div>
                    <div style="color: black; font-size: 16px;">${formatDate(quotation.createdAt)}</div>
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
                    ${quotation.items.map(item => {
                        const itemVAT = clientHasVAT ? calculateVAT(item.total || 0) : 0;
                        return `
                            <tr style="border-bottom: 1px solid #e0e0e0;">
                                <td style="padding: 15px; color: black; font-size: 16px;">
                                    ${item.name}
                                    ${item.description ? `<div style="font-size: 14px; color: #666;">${item.description}</div>` : ''}
                                </td>
                                <td style="padding: 15px; text-align: center; color: black; font-size: 16px;">${item.quantity || 0}</td>
                                <td style="padding: 15px; text-align: right; color: black; font-size: 16px;">${formatPrice(item.price || 0, quotation.currency)}</td>
                                ${clientHasVAT ? `<td style="padding: 15px; text-align: right; color: black; font-size: 16px;">${formatPrice(itemVAT, quotation.currency)}</td>` : ''}
                                <td style="padding: 15px; text-align: right; color: black; font-size: 16px;">${formatPrice(clientHasVAT ? calculateTotalWithVAT(item.total || 0) : (item.total || 0), quotation.currency)}</td>
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
                ${clientHasVAT ? `<div style="font-size: 11px; opacity: 0.8;">Includes VAT: ${formatPrice(vatAmount, quotation.currency)}</div>` : ''}
                <div style="font-size: 24px; font-weight: bold;">${formatPrice(grandTotal, quotation.currency)}</div>
            `;
            pdfContainer.appendChild(totalSection);

            // Add terms section if exists
            if (quotation.termsAndConditions) {
                const termsSection = document.createElement('div');
                termsSection.style.cssText = `
                    padding: 20px;
                    background-color: white;
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    margin-bottom: 20px;
                `;
                
                // Format the terms and conditions text
                const formattedTerms = quotation.termsAndConditions
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
            pdf.save(`Quotation_${quotation.customId || id}.pdf`);
        } catch (error) {
            alert('There was an error generating the PDF. Please try again.');
        }
    };

    // Check if client has VAT when client data changes
    useEffect(() => {
        if (clientData) {
            // Check if client is from UAE
            const isUAE = clientData.country?.toLowerCase().includes('emirates') || 
                         clientData.country?.toLowerCase().includes('uae') ||
                         quotation?.clientAddress?.country?.toLowerCase().includes('emirates') ||
                         quotation?.clientAddress?.country?.toLowerCase().includes('uae');
            
            // Only set VAT for UAE clients
            setClientHasVAT(isUAE);
        } else if (quotation?.clientAddress?.country?.toLowerCase().includes('emirates') || 
                  quotation?.clientAddress?.country?.toLowerCase().includes('uae')) {
            setClientHasVAT(true);
        } else {
            setClientHasVAT(false);
        }
    }, [clientData, quotation]);

    // Calculate VAT amount (5%) only for UAE clients
    const calculateVAT = (amount) => {
        if (!clientHasVAT) return 0;
        return parseFloat(amount) * 0.05;
    };
    
    // Calculate total with VAT only for UAE clients
    const calculateTotalWithVAT = (amount) => {
        if (!clientHasVAT) return parseFloat(amount);
        return parseFloat(amount) + calculateVAT(amount);
    };

    // Render client section with TRN from client data if available
    const renderClientSection = () => {
        // Check if client is from UAE
        const isUAE = quotation?.clientAddress?.country?.toLowerCase().includes('emirates') || 
                      quotation?.clientAddress?.country?.toLowerCase().includes('uae') ||
                      clientData?.country?.toLowerCase().includes('emirates') ||
                      clientData?.country?.toLowerCase().includes('uae');

        // Check for TRN in various possible field names
        const clientTRN = 
            clientData?.trn || 
            clientData?.TRN || 
            clientData?.trnNumber ||
            clientData?.taxRegistrationNumber || 
            clientData?.tax_registration_number ||
            clientData?.taxNumber ||
            quotation?.clientTRN;

        return (
            <AddressGroup>
                <AddressTitle>Bill To</AddressTitle>
                <AddressText>
                    <strong>{quotation.clientName}</strong>
                    {(clientData?.address || quotation.clientAddress?.street) && (
                        <>
                            <br />
                            {clientData?.address || quotation.clientAddress?.street}
                        </>
                    )}
                    {quotation.clientAddress?.city && `, ${quotation.clientAddress.city}`}
                    {quotation.clientAddress?.postCode && `, ${quotation.clientAddress.postCode}`}
                    {(clientData?.country || quotation.clientAddress?.country) && `, ${clientData?.country || quotation.clientAddress?.country}`}
                    {clientData?.phone && (
                        <>
                            <br />
                            {clientData.phone}
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

    // Add handleDeleteClick function
    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            const quotationRef = doc(db, 'quotations', id);
            await deleteDoc(quotationRef);
            history.push('/quotations');
        } catch (error) {
            console.error('Error deleting quotation:', error);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    // Function to convert quotation to invoice
    const convertToInvoice = async () => {
        try {
            setIsConverting(true);
            
            // Calculate total amount with or without VAT
            const subtotal = quotation.items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
            const vatAmount = clientHasVAT ? subtotal * 0.05 : 0;
            const totalAmount = clientHasVAT ? subtotal + vatAmount : subtotal;
            
            // Get all invoices to find the next available number
            const invoicesRef = collection(db, 'invoices');
            const q = query(
                invoicesRef,
                where('customId', '>=', 'FTIN'),
                where('customId', '<=', 'FTIN\uf8ff')
            );
            const querySnapshot = await getDocs(q);
            
            // Find the next available number
            const existingNumbers = querySnapshot.docs
                .map(doc => {
                    const match = doc.data().customId.match(/FTIN(\d+)/);
                    return match ? parseInt(match[1]) : 0;
                })
                .filter(num => !isNaN(num));
            
            const nextNumber = existingNumbers.length > 0 
                ? Math.max(...existingNumbers) + 1 
                : 1;
            
            // Generate the custom ID in the format FTINXXXX
            const customId = `FTIN${String(nextNumber).padStart(4, '0')}`;
            
            // Create a new invoice object from quotation data
            const newInvoice = {
                createdAt: new Date(),
                paymentDue: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days from now
                description: quotation.description || '',
                paymentTerms: '30',
                clientName: quotation.clientName,
                clientEmail: quotation.clientEmail,
                senderAddress: quotation.senderAddress,
                clientAddress: quotation.clientAddress,
                items: quotation.items.map(item => ({
                    ...item,
                    total: clientHasVAT ? calculateTotalWithVAT(item.total || 0) : (item.total || 0)
                })),
                total: totalAmount,
                status: 'pending',
                quotationId: quotation.id, // Reference to original quotation
                currency: quotation.currency || 'USD',
                customId: customId // Add the custom ID in FTINXXXX format
            };

            // Add clientId only if it exists in the quotation
            if (quotation.clientId) {
                newInvoice.clientId = quotation.clientId;
            }

            // Add to Firestore
            const docRef = await addDoc(invoicesRef, {
                ...newInvoice,
                createdAt: Timestamp.fromDate(newInvoice.createdAt),
                paymentDue: Timestamp.fromDate(newInvoice.paymentDue)
            });

            // Update quotation status to invoiced
            const quotationRef = doc(db, 'quotations', id);
            await updateDoc(quotationRef, {
                status: 'invoiced',
                convertedToInvoice: customId // Store the custom ID in FTINXXXX format
            });

            // Refresh quotations list
            await refreshQuotations();

            // Redirect to the new invoice
            history.push(`/invoice/${docRef.id}`);
        } catch (error) {
            console.error('Error converting quotation to invoice:', error);
            alert('There was an error converting the quotation to an invoice. Please try again.');
        } finally {
            setIsConverting(false);
        }
    };

    // Update the button click handler
    const handleConvertToInvoice = () => {
        setShowConvertModal(true);
    };

    const handleConfirmConvert = async () => {
        try {
            setIsConverting(true);
            await convertToInvoice();
        } catch (error) {
            console.error('Error converting quotation to invoice:', error);
            alert('There was an error converting the quotation to an invoice. Please try again.');
        } finally {
            setIsConverting(false);
            setShowConvertModal(false);
        }
    };

    const handleCancelConvert = () => {
        setShowConvertModal(false);
    };

    // Add function to fetch invoice data
    const fetchInvoiceData = async (invoiceId) => {
        if (!invoiceId) return;
        
        try {
            setIsFetchingInvoice(true);
            const invoiceRef = doc(db, 'invoices', invoiceId);
            const docSnap = await getDoc(invoiceRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                setInvoiceData({
                    id: docSnap.id,
                    customId: data.customId || docSnap.id
                });
            }
        } catch (error) {
            console.error('Error fetching invoice data:', error);
        } finally {
            setIsFetchingInvoice(false);
        }
    };

    // Add useEffect to fetch invoice data when quotation loads
    useEffect(() => {
        if (quotation?.invoiceId) {
            fetchInvoiceData(quotation.invoiceId);
        }
    }, [quotation?.invoiceId]);

    // Add function to handle quotation duplication
    const handleDuplicateQuotation = async () => {
        try {
            // Get all quotations with the same base ID
            const baseId = quotation.customId.split('-')[0];
            const quotationsRef = collection(db, 'quotations');
            const q = query(quotationsRef, where('customId', '>=', baseId), where('customId', '<=', baseId + '\uf8ff'));
            const querySnapshot = await getDocs(q);
            
            // Find the next available suffix
            const existingSuffixes = querySnapshot.docs
                .map(doc => doc.data().customId.split('-')[1])
                .filter(suffix => suffix && suffix.length === 1 && /^[a-z]$/i.test(suffix))
                .map(suffix => suffix.toLowerCase());
            
            let nextSuffix = 'a';
            if (existingSuffixes.length > 0) {
                const lastSuffix = existingSuffixes.sort().pop();
                const nextCharCode = lastSuffix.charCodeAt(0) + 1;
                if (nextCharCode <= 'z'.charCodeAt(0)) {
                    nextSuffix = String.fromCharCode(nextCharCode);
                } else {
                    alert('Maximum number of duplicates reached (a-z)');
                    return;
                }
            }
            
            // Create new quotation with incremented suffix
            const newCustomId = `${baseId}-${nextSuffix}`;
            
            // Create a new quotation object with all details from the original
            const newQuotation = {
                ...quotation,
                id: undefined, // Remove the original ID
                customId: newCustomId,
                createdAt: Timestamp.now(),
                status: 'pending', // Set status to pending to allow invoice conversion
                convertedToInvoice: null, // Reset the converted invoice reference
                quotationId: null, // Reset any quotation reference
                items: quotation.items.map(item => ({ ...item })), // Deep copy items
                clientAddress: quotation.clientAddress ? { ...quotation.clientAddress } : null, // Deep copy client address
                senderAddress: quotation.senderAddress ? { ...quotation.senderAddress } : null, // Deep copy sender address
                termsAndConditions: quotation.termsAndConditions || '', // Copy terms if they exist
                description: quotation.description || '', // Copy description if it exists
                paymentDue: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 30))), // Set new due date
                currency: quotation.currency || 'USD',
                clientName: quotation.clientName,
                clientEmail: quotation.clientEmail,
                clientId: quotation.clientId,
                clientPhone: quotation.clientPhone,
                clientTRN: quotation.clientTRN,
                clientCountry: quotation.clientCountry,
                clientCity: quotation.clientCity,
                clientPostCode: quotation.clientPostCode,
                clientStreet: quotation.clientStreet,
                senderName: quotation.senderName,
                senderEmail: quotation.senderEmail,
                senderPhone: quotation.senderPhone,
                senderCountry: quotation.senderCountry,
                senderCity: quotation.senderCity,
                senderPostCode: quotation.senderPostCode,
                senderStreet: quotation.senderStreet,
                paymentTerms: quotation.paymentTerms || '30',
                notes: quotation.notes || '',
                discount: quotation.discount || 0,
                discountType: quotation.discountType || 'percentage',
                discountAmount: quotation.discountAmount || 0,
                subtotal: quotation.subtotal || 0,
                total: quotation.total || 0,
                vat: quotation.vat || 0,
                vatAmount: quotation.vatAmount || 0,
                grandTotal: quotation.grandTotal || 0
            };
            
            // Remove any undefined or null values
            Object.keys(newQuotation).forEach(key => 
                newQuotation[key] === undefined && delete newQuotation[key]
            );
            
            // Add to Firestore
            const docRef = await addDoc(collection(db, 'quotations'), newQuotation);
            
            // Redirect to the new quotation
            history.push(`/quotation/${docRef.id}`);
            
        } catch (error) {
            console.error('Error duplicating quotation:', error);
            alert('There was an error duplicating the quotation. Please try again.');
        }
    };

    // Add function to handle edit click with check
    const handleEditClick = () => {
        if (quotation.convertedToInvoice) {
            // Show modal asking user to duplicate instead
            toggleQuotationModal({
                type: 'status',
                title: 'Cannot Edit Converted Quotation',
                message: 'This quotation has been converted to an invoice. Please create a duplicate if you need to make changes.',
                buttons: [
                    {
                        text: 'Cancel',
                        type: 'secondary',
                        onClick: () => toggleQuotationModal()
                    },
                    {
                        text: 'Create Duplicate',
                        type: 'primary',
                        onClick: () => {
                            toggleQuotationModal();
                            handleDuplicateQuotation();
                        }
                    }
                ]
            });
        } else {
            // Normal edit flow
            editQuotation(id);
        }
    };

    // Show loading state
    if (isLoading || !quotation) {
        return (
            <StyledQuotationView className="StyledQuotationView">
                <Container>
                    <MotionLink
                        to="/quotations"
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
                        <HeaderTitle>Quotation</HeaderTitle>
                    </HeaderSection>
                    
                    <Controller
                        variants={variant('controller')}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="Controller"
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Text>Loading quotation...</Text>
                            <div style={{ marginLeft: 16, width: 16, height: 16 }} className="loading-spinner"></div>
                        </div>
                    </Controller>
                </Container>
            </StyledQuotationView>
        );
    }

    // Calculate total amount with or without VAT
    const calculateTotals = () => {
        const subtotal = quotation.items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
        
        if (clientHasVAT) {
            const vatAmount = subtotal * 0.05;
            const grandTotal = subtotal + vatAmount;
            return { subtotal, vatAmount, grandTotal };
        }
        
        return { subtotal, vatAmount: 0, grandTotal: subtotal };
    };

    const { subtotal, vatAmount, grandTotal } = calculateTotals();

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

    // Add function to initialize company profiles
    const initializeCompanyProfiles = async () => {
        try {
            const companyProfilesRef = collection(db, 'companyProfiles');
            
            // Qatar company profile
            const qatarProfile = {
                name: 'Fortune Gifts Trading W.L.L',
                address: 'Old Salata Doha - Qatar',
                phone: '+974 7001 39 84',
                email: 'sales@fortunegiftz.com',
                country: 'qatar',
                crNumber: '213288',
                vatNumber: '',
                gstNumber: '',
                createdAt: new Date()
            };
            
            // UAE company profile
            const uaeProfile = {
                name: 'Fortune Gifts Trading L.L.C',
                address: 'MBZ City, Musaffah Abu Dhabi - UAE',
                phone: '+971503997860',
                email: 'sales@fortunegiftz.com',
                country: 'uae',
                crNumber: '',
                vatNumber: '100430961100003',
                gstNumber: '',
                createdAt: new Date()
            };
            
            // Add profiles to database
            await addDoc(companyProfilesRef, qatarProfile);
            await addDoc(companyProfilesRef, uaeProfile);
        } catch (error) {
            // Handle error silently
        }
    };

    return (
        <StyledQuotationView className="StyledQuotationView">
            <Container>
                <MotionLink
                    to="/quotations"
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
                    <HeaderTitle>Quotation</HeaderTitle>
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
                        <StatusBadge status={quotation.status}>
                            <span>
                                {quotation.status === 'approved' ? 'Approved' : 
                                 quotation.status === 'pending' ? 'Pending' : 'Draft'}
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
                                $primary
                                onClick={handleDuplicateQuotation}
                                disabled={isLoading}
                                style={{
                                    backgroundColor: colors.purple,
                                    border: 'none'
                                }}
                            >
                                <Icon 
                                    name="copy" 
                                    size={14} 
                                    color="white"
                                />
                                <span>Duplicate</span>
                            </Button>
                            <Button
                                $secondary
                                onClick={handleEditClick}
                                disabled={isLoading || quotation.convertedToInvoice}
                                style={{
                                    opacity: quotation.convertedToInvoice ? 0.6 : 1,
                                    cursor: quotation.convertedToInvoice ? 'not-allowed' : 'pointer'
                                }}
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
                            {isPending && !quotation.convertedToInvoice && (
                                <Button
                                    $primary
                                    onClick={handleConvertToInvoice}
                                    disabled={isLoading || isConverting}
                                >
                                    <Icon name="arrow-right" size={13} style={{ marginRight: '6px' }} />
                                    {isConverting ? 'Converting...' : 'Invoice'}
                                </Button>
                            )}
                        </ButtonWrapper>
                    )}
                </Controller>
                
                {/* Main quotation info */}
                <InfoCard
                    id="quotation-content"
                    variants={variant('info')}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="InfoCard"
                >
                    <InfoHeader>
                        <InfoGroup>
                            <InfoID>
                                <span>#</span>{quotation.customId}
                            </InfoID>
                            <InfoDesc>{quotation.description || 'No description'}</InfoDesc>
                            {quotation.convertedToInvoice && (
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
                                    Converted to Invoice: 
                                    <Link
                                        to={`/invoice/${quotation.convertedToInvoice}`}
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
                                        #{isFetchingInvoice ? 'Loading...' : (invoiceData?.customId || quotation.convertedToInvoice)}
                                    </Link>
                                </span>
                            )}
                            <MetaInfo>
                                <MetaItem>
                                    <Icon name="calendar" size={13} />
                                    Created: {formatDate(quotation.createdAt)}
                                </MetaItem>
                                <MetaItem>
                                    <Icon name="calendar" size={13} />
                                    Due: {formatDate(quotation.paymentDue)}
                                </MetaItem>
                            </MetaInfo>
                        </InfoGroup>
                    </InfoHeader>
                    
                    <InfoAddresses className="InfoAddresses">
                        {renderClientSection()}
                        
                        <AddressGroup align="right">
                            <AddressTitle>Quotation #</AddressTitle>
                            <AddressText>
                                {quotation.customId || id}
                            </AddressText>
                            <br />
                            <AddressTitle>Quote Date</AddressTitle>
                           
                            <AddressText>
                                {formatDate(quotation.createdAt)}
                            </AddressText>
                        </AddressGroup>
                    </InfoAddresses>
                    
                    {quotation.clientEmail && (
                        <AddressGroup>
                            <AddressTitle>Sent to</AddressTitle>
                            <AddressText>
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    <Icon name="mail" size={13} style={{ marginRight: '6px', color: colors.purple }} />
                                    {quotation.clientEmail}
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
                            {quotation.items && quotation.items.map((item, index) => {
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
                                                    {item.quantity || 0} × {formatPrice(item.price || 0, quotation.currency)}
                                                    {clientHasVAT && ` (+${formatPrice(itemVAT, quotation.currency)} VAT)`}
                                                </span>
                                            </div>
                                        </div>
                                        <ItemQty>{item.quantity || 0}</ItemQty>
                                        <ItemPrice>
                                            {formatPrice(item.price || 0, quotation.currency)}
                                        </ItemPrice>
                                        {clientHasVAT && (
                                            <ItemVat>
                                                {formatPrice(itemVAT, quotation.currency)}
                                            </ItemVat>
                                        )}
                                        <ItemTotal>
                                            {formatPrice(clientHasVAT ? 
                                                calculateTotalWithVAT(item.total || 0) : 
                                                (item.total || 0), 
                                            quotation.currency)}
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
                                        Includes VAT: {formatPrice(vatAmount, quotation.currency)}
                                    </div>
                                )}
                            </div>
                            <TotalAmount>
                                {formatPrice(grandTotal, quotation.currency)}
                            </TotalAmount>
                        </Total>
                    </Details>
                    
                    {/* Terms and conditions section */}
                    {quotation.termsAndConditions && (
                        <TermsSection className="TermsSection">
                            <TermsTitle>Terms and Conditions</TermsTitle>
                            <TermsText>{quotation.termsAndConditions}</TermsText>
                        </TermsSection>
                    )}
                </InfoCard>
            </Container>
            
            {/* Mobile action buttons */}
            {!isDesktop && (
                <ButtonWrapper className="ButtonWrapper">
                    {!isConverting && (
                        <>
                            <Button
                                $secondary
                                onClick={handleEditClick}
                                disabled={isLoading || quotation.convertedToInvoice}
                                style={{
                                    opacity: quotation.convertedToInvoice ? 0.6 : 1,
                                    cursor: quotation.convertedToInvoice ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                $primary
                                onClick={handleDuplicateQuotation}
                                disabled={isLoading}
                                style={{
                                    backgroundColor: colors.purple,
                                    border: 'none'
                                }}
                            >
                                <Icon 
                                    name="copy" 
                                    size={14} 
                                    color="white"
                                />
                                <span>Duplicate</span>
                            </Button>
                            <Button
                                $delete
                                onClick={handleDeleteClick}
                                disabled={isLoading}
                            >
                                Delete
                            </Button>
                            {isPending && !quotation.convertedToInvoice && (
                                <Button
                                    $primary
                                    onClick={handleConvertToInvoice}
                                    disabled={isLoading || isConverting}
                                >
                                    <Icon name="arrow-right" size={13} style={{ marginRight: '6px' }} />
                                    {isConverting ? 'Converting...' : 'Invoice'}
                                </Button>
                            )}
                        </>
                    )}
                </ButtonWrapper>
            )}

            {/* Convert Confirmation Modal */}
            {showConvertModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        backgroundColor: colors.background,
                        padding: '2rem',
                        borderRadius: '16px',
                        maxWidth: '360px',
                        width: '90%',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                        border: `1px solid ${colors.border}`,
                        animation: 'modalSlideIn 0.3s ease-out'
                    }}>
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
                                backgroundColor: '#E5F6FF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Icon name="arrow-right" size={18} color="#004359" />
                            </div>
                            <h2 style={{ 
                                margin: 0,
                                fontSize: '1.25rem',
                                color: colors.text,
                                fontWeight: '600'
                            }}>Convert to Invoice</h2>
                        </div>
                        <p style={{ 
                            marginBottom: '2rem',
                            color: colors.text,
                            fontSize: '0.95rem',
                            lineHeight: '1.5',
                            opacity: 0.8
                        }}>
                            Are you sure you want to convert quotation #{quotation?.customId || id} to an invoice?
                        </p>
                        <div style={{ 
                            display: 'flex', 
                            gap: '12px', 
                            justifyContent: 'flex-end'
                        }}>
                            <Button 
                                $secondary 
                                onClick={handleCancelConvert}
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
                                Cancel
                            </Button>
                            <Button 
                                $primary 
                                onClick={handleConfirmConvert} 
                                disabled={isConverting}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    backgroundColor: '#004359',
                                    color: 'white',
                                    border: 'none',
                                    cursor: isConverting ? 'not-allowed' : 'pointer',
                                    opacity: isConverting ? 0.7 : 1,
                                    transition: 'all 0.2s ease',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {isConverting ? 'Converting...' : 'Convert'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        backgroundColor: colors.background,
                        padding: '2rem',
                        borderRadius: '16px',
                        maxWidth: '360px',
                        width: '90%',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                        border: `1px solid ${colors.border}`,
                        animation: 'modalSlideIn 0.3s ease-out'
                    }}>
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
                            }}>Delete Quotation</h2>
                        </div>
                        <p style={{ 
                            marginBottom: '2rem',
                            color: colors.text,
                            fontSize: '0.95rem',
                            lineHeight: '1.5',
                            opacity: 0.8
                        }}>
                            Are you sure you want to delete quotation #{quotation?.customId || id}?
                        </p>
                        <div style={{ 
                            display: 'flex', 
                            gap: '12px', 
                            justifyContent: 'flex-end'
                        }}>
                            <Button 
                                $secondary 
                                onClick={handleCancelDelete}
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
                                Cancel
                            </Button>
                            <Button 
                                $delete 
                                onClick={handleConfirmDelete} 
                                disabled={isDeleting}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    backgroundColor: '#FF4806',
                                    color: 'white',
                                    border: 'none',
                                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                                    opacity: isDeleting ? 0.7 : 1,
                                    transition: 'all 0.2s ease',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </StyledQuotationView>
    );
};

export default QuotationView; 