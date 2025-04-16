import { useEffect, useState, useRef } from 'react';
import { useParams, Redirect, useHistory, Link } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { useReducedMotion } from 'framer-motion';
import Icon from '../shared/Icon/Icon';
import Status from '../shared/Status/Status';
import Button from '../shared/Button/Button';
import { formatDate, formatPrice, formatCurrency } from '../../utilities/helpers';
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
    ActionButton,
} from './QuotationViewStyles';
import { doc, getDoc, collection, query, where, getDocs, deleteDoc, addDoc, updateDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { generateEmailTemplate, generateQuotationEmailTemplate } from '../../services/emailService';
import EmailPreviewModal from '../shared/EmailPreviewModal/EmailPreviewModal';
import { format } from 'date-fns';
import { message } from 'antd';
import styled from 'styled-components';

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
    const [isLoading, setIsLoading] = useState(true);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [emailData, setEmailData] = useState(null);
    const [pdfData, setPdfData] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const quotationNotFound = !isLoading && !quotation;
    const isPending = quotation?.status === 'pending';
    const isDraft = quotation?.status === 'draft';
    const isApproved = quotation?.status === 'approved';
    const isDesktop = windowWidth >= 768;
    const shouldReduceMotion = useReducedMotion();
    const history = useHistory();
    const [isTimelineOpen, setIsTimelineOpen] = useState(false);
    const timelineRef = useRef(null);
    const toggleButtonRef = useRef(null);
    
    // Add click outside handler for timeline drawer
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isTimelineOpen && 
                timelineRef.current && 
                !timelineRef.current.contains(event.target) &&
                toggleButtonRef.current &&
                !toggleButtonRef.current.contains(event.target)
            ) {
                setIsTimelineOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isTimelineOpen]);

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

    // Update loading state when other loading states change
    useEffect(() => {
        const isCurrentlyLoading = quotationState?.isLoading || 
                                 isDirectlyFetching || 
                                 isClientFetching || 
                                 isFetchingInvoice;
        setIsLoading(isCurrentlyLoading);
    }, [quotationState?.isLoading, isDirectlyFetching, isClientFetching, isFetchingInvoice]);

    // Add subscription to quotation changes
    useEffect(() => {
        let unsubscribe;
        
        const subscribeToQuotation = async () => {
            if (!id) return;
            
            const quotationRef = doc(db, 'quotations', id);
            unsubscribe = onSnapshot(quotationRef, async (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    
                    // Convert Firestore Timestamp to Date
                    const createdAt = data.createdAt?.toDate() || new Date();
                    const paymentDue = data.paymentDue?.toDate() || new Date();
                    
                    setQuotation({
                        ...data,
                        id: docSnapshot.id,
                        createdAt,
                        paymentDue
                    });
                    
                    // If client data exists, fetch it
                    if (data.clientId) {
                        try {
                            const clientDoc = await getDoc(doc(db, 'clients', data.clientId));
                            if (clientDoc.exists()) {
                                setClientData(clientDoc.data());
                                setClientHasVAT(clientDoc.data().hasVAT || false);
                            }
                        } catch (error) {
                            console.error('Error fetching client data:', error);
                        }
                    }
                    
                    // If quotation was converted to invoice, fetch that data
                    if (data.invoiceId) {
                        fetchInvoiceData(data.invoiceId);
                    }
                    
                    setIsLoading(false);
                } else {
                    // Handle non-existent quotation
                    history.push('/quotations');
                }
            }, (error) => {
                console.error('Error listening to quotation:', error);
                setIsLoading(false);
            });
        };
        
        subscribeToQuotation();
        
        // Cleanup subscription
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [id, history]);

    // Add a function to fetch all data in parallel
    const fetchAllData = async (quotationId) => {
        try {
            setIsDirectlyFetching(true);
            setIsClientFetching(true);
            
            // First fetch the quotation
            const quotationDoc = await getDoc(doc(db, 'quotations', quotationId));
            
            if (quotationDoc.exists()) {
                const data = quotationDoc.data();
                
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
                    id: quotationDoc.id,
                    customId: data.customId || quotationDoc.id,
                    createdAt,
                    paymentDue,
                    items: Array.isArray(data.items) ? data.items : [],
                    currency: data.currency || 'USD'
                };
                
                setQuotation(fetchedQuotation);
                
                // Now that we have the quotation data, fetch the client data if we have a clientId
                if (fetchedQuotation.clientId) {
                    const clientDoc = await getDoc(doc(db, 'clients', fetchedQuotation.clientId));
                    if (clientDoc.exists()) {
                        const clientData = clientDoc.data();
                        setClientData(clientData);
                        setClientHasVAT(clientData.hasVAT || false);
                    }
                }
                
                // If quotation was converted to invoice, fetch that data
                if (fetchedQuotation.invoiceId) {
                    fetchInvoiceData(fetchedQuotation.invoiceId);
                }
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error fetching data:', error);
            return false;
        } finally {
            setIsDirectlyFetching(false);
            setIsClientFetching(false);
        }
    };

    // Trigger fetch of all data
    useEffect(() => {
        if (id && !quotation && !isDirectlyFetching) {
            fetchAllData(id);
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
                fetchAllData(foundQuotation.id);
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
                    fetchAllData(parsedData.id);
                } catch (err) {
                    // Handle error silently
                }
            }
        }
    }, [id, quotation, isLoading, isDirectlyFetching]);

    // Add this new function before handleDownloadPDF
    const generatePDF = async () => {
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

            // Debug logs
            console.log('PDF Generation - Client Data:', clientData);
            console.log('PDF Generation - Client Country:', clientCountry);
            console.log('PDF Generation - Client TRN:', clientData?.trn || clientData?.trnNumber || quotation?.clientTRN);

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
                        ${(clientCountry.toLowerCase().includes('emirates') || clientCountry.toLowerCase().includes('uae')) && (clientData?.trn || clientData?.trnNumber || quotation?.clientTRN) ? 
                            `<br /><span style="font-weight: 600;">TRN: ${clientData?.trn || clientData?.trnNumber || quotation?.clientTRN}</span>` : ''}
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
                        const itemVAT = item.vat || 0;
                        return `
                            <tr style="border-bottom: 1px solid #e0e0e0;">
                                <td style="padding: 15px; color: black; font-size: 16px;">
                                    ${item.name}
                                    ${item.description ? `<div style="font-size: 14px; color: #666;">${item.description}</div>` : ''}
                                </td>
                                <td style="padding: 15px; text-align: center; color: black; font-size: 16px;">${item.quantity || 0}</td>
                                <td style="padding: 15px; text-align: right; color: black; font-size: 16px;">${formatPrice(item.price || 0, quotation.currency)}</td>
                                ${clientHasVAT ? `<td style="padding: 15px; text-align: right; color: black; font-size: 16px;">${formatPrice(itemVAT, quotation.currency)}</td>` : ''}
                                <td style="padding: 15px; text-align: right; color: black; font-size: 16px;">${formatPrice(item.total || 0, quotation.currency)}</td>
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
                ${clientHasVAT ? `<div style="font-size: 11px; opacity: 0.8;">Includes VAT: ${formatPrice(quotation.items.reduce((sum, item) => sum + (parseFloat(item.vat) || 0), 0), quotation.currency)}</div>` : ''}
                <div style="font-size: 24px; font-weight: bold;">${formatPrice(quotation.grandTotal || quotation.total || 0, quotation.currency)}</div>
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
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0)
                    .map(line => {
                        if (/^\d+\./.test(line)) {
                            return `<div style="margin-bottom: 8px; color: black; font-size: 16px;">${line}</div>`;
                        }
                        else if (line.toUpperCase() === line || 
                                /^(Terms|Conditions|Payment|Delivery|Warranty|Cancellation|Force Majeure|Governing Law)/i.test(line)) {
                            return `<div style="margin-top: 16px; margin-bottom: 8px; color: #004359; font-weight: bold; font-size: 18px;">${line}</div>`;
                        }
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

            return pdf;
        } catch (error) {
            throw new Error('Error generating PDF: ' + error.message);
        }
    };

    // Update handleDownloadPDF to use generatePDF
    const handleDownloadPDF = async () => {
        try {
            const pdf = await generatePDF();
            pdf.save(`Quotation_${quotation.customId || id}.pdf`);
        } catch (error) {
            message.error('There was an error generating the PDF. Please try again.');
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

        console.log('Client Data:', clientData);
        console.log('Is UAE Client:', isUAE);
        console.log('Client TRN:', clientTRN);
        console.log('Client Country:', clientData?.country || quotation?.clientAddress?.country);

        // Get address and country from either source
        const clientAddress = quotation.clientAddress?.street || clientData?.address || '';
        const clientCountry = quotation.clientAddress?.country || clientData?.country || '';
        const clientCity = quotation.clientAddress?.city || '';
        const clientPostCode = quotation.clientAddress?.postCode || '';

        // Format the address parts
        const addressParts = [];
        if (clientAddress) addressParts.push(clientAddress);
        if (clientCity) addressParts.push(clientCity);
        if (clientPostCode) addressParts.push(clientPostCode);
        if (clientCountry) addressParts.push(clientCountry);

        return (
            <AddressGroup>
                <AddressTitle>Bill To</AddressTitle>
                <AddressText>
                    <strong>{quotation.clientName}</strong>
                    {addressParts.length > 0 && (
                        <>
                            <br />
                            {addressParts.join(', ')}
                        </>
                    )}
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
            
            // Calculate subtotal first (without VAT)
            const subtotal = quotation.items.reduce((sum, item) => {
                const itemPrice = parseFloat(item.price) || 0;
                const itemQuantity = parseFloat(item.quantity) || 0;
                return sum + (itemPrice * itemQuantity);
            }, 0);
            
            // Calculate VAT amount
            const vatAmount = quotation.items.reduce((sum, item) => sum + (parseFloat(item.vat) || 0), 0);
            
            // Total is subtotal plus VAT
            const totalAmount = subtotal + vatAmount;
            
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
                    total: parseFloat(item.total) || 0,
                    vat: parseFloat(item.vat) || 0
                })),
                subtotal: subtotal,
                total: totalAmount,
                totalVat: vatAmount,
                status: 'pending',
                quotationId: quotation.id,
                currency: quotation.currency || 'USD',
                customId: customId,
                clientId: quotation.clientId || null // Ensure clientId is set
            };

            // If we have client data but no clientId, try to find the client by name
            if (!newInvoice.clientId && quotation.clientName) {
                try {
                    const clientsRef = collection(db, 'clients');
                    const q = query(clientsRef, where('companyName', '==', quotation.clientName));
                    const querySnapshot = await getDocs(q);
                    
                    if (!querySnapshot.empty) {
                        newInvoice.clientId = querySnapshot.docs[0].id;
                    }
                } catch (error) {
                    console.error('Error finding client by name:', error);
                }
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
                convertedToInvoice: customId
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
            
            // Calculate totalVat for UAE clients
            if (quotation.clientAddress?.country?.toLowerCase().includes('emirates') || 
                quotation.clientAddress?.country?.toLowerCase().includes('uae')) {
                // Calculate 5% VAT for each product individually and sum them up
                const totalVat = quotation.items.reduce((sum, item) => {
                    const itemTotal = parseFloat(item.total) || 0;
                    const itemVat = itemTotal * 0.05; // 5% VAT for each product
                    return sum + itemVat;
                }, 0);
                
                newQuotation.totalVat = totalVat;
            } else {
                newQuotation.totalVat = 0;
            }
            
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

    // Update handleSendEmail to use generatePDF
    const handleSendEmail = async () => {
        try {
            const pdf = await generatePDF();
            const pdfBase64 = pdf.output('datauristring').split(',')[1];

            // Get the client's country for company profile
            const clientCountry = quotation?.clientAddress?.country || 
                                clientData?.country || 
                                'qatar';
            
            // Get company profile for email
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

            // Generate email content
            const emailContent = generateQuotationEmailTemplate({
                clientName: quotation.clientName
            });

            // Set email data and open modal
            setEmailData({
                to: quotation.clientEmail,
                subject: `Quotation ${quotation.customId} from ${companyProfile.name}`,
                content: emailContent
            });
            setPdfData({
                content: pdfBase64,
                name: `Quotation_${quotation.customId}.pdf`
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

    // Mock timeline data
    const timelineData = [
        {
            id: 1,
            type: 'edit',
            icon: 'edit',
            title: 'Quotation Edited',
            description: 'Updated item quantities and prices',
            timestamp: '2024-03-20T10:30:00',
            user: 'John Doe'
        },
        {
            id: 2,
            type: 'email',
            icon: 'mail',
            title: 'Email Sent',
            description: 'Quotation sent to client@example.com',
            timestamp: '2024-03-19T15:45:00',
            user: 'System'
        },
        {
            id: 3,
            type: 'download',
            icon: 'download',
            title: 'PDF Downloaded',
            description: 'Client downloaded quotation PDF',
            timestamp: '2024-03-19T14:20:00',
            user: 'Client'
        },
        {
            id: 4,
            type: 'duplicate',
            icon: 'copy',
            title: 'Quotation Duplicated',
            description: 'Created duplicate quotation #QT-2024-002',
            timestamp: '2024-03-18T11:15:00',
            user: 'Jane Smith'
        },
        {
            id: 5,
            type: 'create',
            icon: 'plus',
            title: 'Quotation Created',
            description: 'New quotation created',
            timestamp: '2024-03-18T10:00:00',
            user: 'Jane Smith'
        }
    ];

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
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                            <Text>Loading quotation...</Text>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: 16, height: 16 }} className="loading-spinner"></div>
                                <Text style={{ fontSize: '13px', color: colors.textTertiary }}>
                                    {isDirectlyFetching ? 'Fetching quotation data...' :
                                     isClientFetching ? 'Loading client information...' :
                                     isFetchingInvoice ? 'Loading invoice details...' :
                                     'Preparing view...'}
                                </Text>
                            </div>
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
                <div style={{ display: 'flex', gap: '24px', position: 'relative' }}>
                    <div style={{ flex: 1 }}>
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
                            <HeaderTitle>
                                Quotation
                                <StatusBadge status={quotation.status}>
                                    <StatusDot />
                                    <span>
                                        {quotation.status === 'approved' ? 'Approved' : 
                                         quotation.status === 'pending' ? 'Pending' : 'Draft'}
                                    </span>
                                </StatusBadge>
                            </HeaderTitle>
                            <ActionButtons>
                                <ActionButton onClick={handleDuplicateQuotation} disabled={isLoading}>
                                    <Icon name="copy" size={13} />
                                    
                                </ActionButton>
                                <ActionButton onClick={handleEditClick} disabled={isLoading || quotation.convertedToInvoice}>
                                    <Icon name="edit" size={13} />
                                    
                                </ActionButton>
                                <ActionButton onClick={handleDeleteClick} disabled={isLoading}>
                                    <Icon name="trash" size={13} color="red" />
                                    
                                </ActionButton>
                                <DownloadButton onClick={handleDownloadPDF} className="DownloadButton">
                                    <Icon name="download" size={13} />
                                    
                                </DownloadButton>
                                {isPending && !quotation.convertedToInvoice && (
                                    <ActionButton onClick={handleConvertToInvoice} disabled={isLoading || isConverting}>
                                        <Icon name="arrow-right" size={13} />
                                        {isConverting ? 'Converting...' : 'Invoice'}
                                    </ActionButton>
                                )}
                            </ActionButtons>
                            
                        </HeaderSection>
                        
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
                                    <InfoDesc>Project: {quotation.description || 'No description'}</InfoDesc>
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
                                            Invoice 
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
                                        {/* <MetaItem>
                                            <Icon name="calendar" size={13} />
                                            Due: {formatDate(quotation.paymentDue)}
                                        </MetaItem> */}
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
                                <AddressGroup style={{
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: '8px',
                                    padding: '16px',
                                    backgroundColor: colors.backgroundItem,
                                    marginBottom: '32px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <AddressTitle>Email to</AddressTitle>
                                        <AddressText>
                                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                                <Icon name="mail" size={8} style={{ marginRight: '6px', color: colors.purple }} />
                                                {quotation.clientEmail}
                                            </span>
                                        </AddressText>
                                    </div>
                                    <Button
                                        $secondary
                                        onClick={async () => {
                                            setIsSending(true);
                                            await handleSendEmail();
                                            setIsSending(false);
                                        }}
                                        disabled={isSending}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            border: `1px solid ${colors.border}`,
                                            backgroundColor: colors.background,
                                            color: colors.text,
                                            cursor: isSending ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.2s ease',
                                            fontSize: '0.9rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {isSending ? (
                                            <Icon name="spinner" size={13} style={{ animation: 'spin 1s linear infinite' }} />
                                        ) : (
                                            <Icon name="mail" size={13} />
                                        )}
                                        {isSending ? 'Sending...' : 'Email'}
                                    </Button>
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
                                        // Use the stored VAT value from the database instead of recalculating
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
                                                    {formatPrice(item.total || 0, quotation.currency)}
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
                                                Includes VAT: {formatPrice(quotation.items.reduce((sum, item) => sum + (parseFloat(item.vat) || 0), 0), quotation.currency)}
                                            </div>
                                        )}
                                    </div>
                                    <TotalAmount>
                                        {formatPrice(quotation.total || quotation.items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0), quotation.currency)}
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
                    </div>

                    {/* Timeline Drawer Toggle Button */}
                    <div 
                        ref={toggleButtonRef}
                        style={{
                            position: 'fixed',
                            right: isTimelineOpen ? '320px' : '0',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 1000,
                            transition: 'right 0.3s ease',
                            height: '120px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <button
                            onClick={() => setIsTimelineOpen(!isTimelineOpen)}
                            style={{
                                padding: '12px 8px',
                                background: '#181b2e',
                                border: '2px solid #a78bfa',
                                borderRadius: '0px 8px 8px 0px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 0 10px rgba(167, 139, 250, 0.5)',
                                transition: 'all 0.3s ease',
                                color: 'white',
                                fontWeight: '200',
                                fontSize: '10px',
                                letterSpacing: '0.5px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '80%',
                                width: '40px',
                                writingMode: 'vertical-rl',
                                textOrientation: 'mixed',
                                transform: 'rotate(180deg)',
                                whiteSpace: 'nowrap',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15), 0 0 15px rgba(167, 139, 250, 0.7)';
                                e.currentTarget.style.border = '2px solid #b794f4';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15), 0 0 10px rgba(167, 139, 250, 0.5)';
                                e.currentTarget.style.border = '2px solid #a78bfa';
                            }}
                        >
                            {isTimelineOpen ? 'Close' : 'Activity Monitor'}
                        </button>
                    </div>

                    {/* Timeline Drawer */}
                    <div 
                        ref={timelineRef}
                        style={{
                            position: 'fixed',
                            right: isTimelineOpen ? '0' : '-320px',
                            top: 0,
                            bottom: 0,
                            width: '320px',
                            background: '#181b2e',
                            borderLeft: 'none',
                            boxShadow: isTimelineOpen ? '-4px 0 20px rgba(0, 0, 0, 0.2)' : 'none',
                            transition: 'all 0.3s ease',
                            zIndex: 999,
                            overflowY: 'auto'
                        }}
                    >
                        <div style={{
                            padding: '24px',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '24px',
                                paddingBottom: '16px',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    color: 'white'
                                }}>
                                    Activity Timeline
                                </h3>
                                <button
                                    onClick={() => setIsTimelineOpen(false)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: '8px',
                                        cursor: 'pointer',
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '50%',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <Icon name="x" size={16} color="white" />
                                </button>
                            </div>
                            
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                                flex: 1
                            }}>
                                {timelineData.map((item) => (
                                    <div key={item.id} style={{
                                        display: 'flex',
                                        gap: '16px',
                                        position: 'relative',
                                        paddingLeft: '28px'
                                    }}>
                                        {/* Timeline line */}
                                        {item.id !== timelineData.length && (
                                            <div style={{
                                                position: 'absolute',
                                                left: '13px',
                                                top: '28px',
                                                bottom: '-20px',
                                                width: '2px',
                                                background: 'rgba(255, 255, 255, 0.1)'
                                            }} />
                                        )}
                                        
                                        {/* Icon */}
                                        <div style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            background: item.type === 'edit' ? 'rgba(0, 123, 255, 0.2)' :
                                                       item.type === 'email' ? 'rgba(40, 167, 69, 0.2)' :
                                                       item.type === 'download' ? 'rgba(255, 193, 7, 0.2)' :
                                                       item.type === 'duplicate' ? 'rgba(111, 66, 193, 0.2)' :
                                                       'rgba(23, 162, 184, 0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            zIndex: 1,
                                            border: '2px solid rgba(255, 255, 255, 0.1)'
                                        }}>
                                            <Icon 
                                                name={item.icon} 
                                                size={12} 
                                                color={item.type === 'edit' ? '#007bff' :
                                                       item.type === 'email' ? '#28a745' :
                                                       item.type === 'download' ? '#ffc107' :
                                                       item.type === 'duplicate' ? '#6f42c1' :
                                                       '#17a2b8'}
                                            />
                                        </div>
                                        
                                        {/* Content */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                marginBottom: '6px'
                                            }}>
                                                <h4 style={{
                                                    margin: 0,
                                                    fontSize: '15px',
                                                    fontWeight: '500',
                                                    color: 'white'
                                                }}>
                                                    {item.title}
                                                </h4>
                                                <span style={{
                                                    fontSize: '12px',
                                                    color: 'rgba(255, 255, 255, 0.5)'
                                                }}>
                                                    {formatDate(new Date(item.timestamp))}
                                                </span>
                                            </div>
                                            <p style={{
                                                margin: '0 0 6px 0',
                                                fontSize: '13px',
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                lineHeight: '1.5'
                                            }}>
                                                {item.description}
                                            </p>
                                            <span style={{
                                                fontSize: '12px',
                                                color: 'rgba(255, 255, 255, 0.5)',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                                <span style={{ 
                                                    width: '6px', 
                                                    height: '6px', 
                                                    borderRadius: '50%', 
                                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                                    marginRight: '6px'
                                                }}></span>
                                                By {item.user}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
            
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
                            }}>Invoice</h2>
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

            {isEmailModalOpen && emailData && pdfData && (
                <EmailPreviewModal
                    isOpen={isEmailModalOpen}
                    onClose={() => setIsEmailModalOpen(false)}
                    onSend={handleEmailSent}
                    emailData={emailData}
                    documentType="quotation"
                    documentId={quotation.id}
                    clientName={quotation.clientName}
                    clientEmail={quotation.clientEmail}
                    amount={quotation.total}
                    currency={quotation.currency}
                    dueDate={quotation.paymentDue}
                    pdfBase64={pdfData.content}
                    pdfName={pdfData.name}
                />
            )}
        </StyledQuotationView>
    );
};

export default QuotationView; 