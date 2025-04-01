import { useEffect, useState } from 'react';
import { useParams, Redirect, useHistory } from 'react-router-dom';
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
    DownloadButton
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
                // Provide default company profile data
                companyProfile = {
                    name: 'Fortune Gifts',
                    address: 'Doha, Qatar',
                    phone: '+974 1234 5678',
                    vatNumber: 'VAT123456789',
                    crNumber: 'CR123456789'
                };
            }

            // Create a clone of the element to avoid modifying the original
            const element = document.getElementById('quotation-content');
            if (!element) {
                throw new Error('Quotation content element not found');
            }
            
            const elementClone = element.cloneNode(true);
            
            // Create a container for PDF content
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
            
            // Create letterhead with dynamic company details
            const letterhead = document.createElement('div');
            letterhead.className = 'letterhead';
            letterhead.style.cssText = `
                margin-bottom: 5mm;
            `;
            
            letterhead.innerHTML = `
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
            
            // Create a custom info section with quotation number and date
            const infoSection = document.createElement('div');
            infoSection.style.cssText = `
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                padding: 0;
                margin-top: 15px;
            `;
            
        
            
            // Add letterhead to container
            pdfContainer.appendChild(letterhead);

            // Add info section to container
            pdfContainer.appendChild(infoSection);
            
            // Extract and clean up the client section
            const clientSection = elementClone.querySelector('.InfoAddresses');
            if (clientSection) {
                // Set the section title (Bill To) to Fortune Gifts blue
                const clientAddressTitle = clientSection.querySelector('.AddressTitle');
                if (clientAddressTitle) {
                    clientAddressTitle.style.color = '#004359';
                    clientAddressTitle.style.fontWeight = 'bold';
                    clientAddressTitle.style.fontSize = '18px';
                }
                
                // Set ALL text within the client address section to black
                const addressTextElements = clientSection.querySelectorAll('.AddressText');
                addressTextElements.forEach(element => {
                    element.style.color = 'black';
                    element.style.fontSize = '16px';
                    
                    // Also set all child elements' text to black
                    const childElements = element.querySelectorAll('*');
                    childElements.forEach(child => {
                        child.style.color = 'black';
                        child.style.fontSize = '16px';
                    });
                    
                    // Make sure the TRN span has the right color
                    const trnSpan = element.querySelector('span');
                    if (trnSpan) {
                        trnSpan.style.color = 'black';
                        trnSpan.style.fontSize = '16px';
                    }
                    
                    // Set any inline styles directly on the element
                    element.setAttribute('style', element.getAttribute('style') + '; color: black !important; font-size: 16px !important;');
                });
                
                // Remove the quote date section as we've already added it above
                const dateSection = clientSection.querySelector('[align="right"]');
                if (dateSection) {
                    dateSection.remove();
                }

                // Add white background and border to client section
                clientSection.style.backgroundColor = 'white';
                clientSection.style.border = '1px solid #e0e0e0';
                clientSection.style.borderRadius = '4px';
                clientSection.style.padding = '20px';
                clientSection.style.marginBottom = '20px';

                // Set all text in the section to black
                const allTextElements = clientSection.querySelectorAll('*');
                allTextElements.forEach(element => {
                    if (element.tagName !== 'STRONG' && !element.classList.contains('AddressTitle')) {
                        element.style.color = 'black';
                        element.style.fontSize = '16px';
                    }
                });
                
                pdfContainer.appendChild(clientSection);
            }
            
            // Extract and append the client email section if it exists
            const clientEmailSection = elementClone.querySelector('.AddressGroup:not(.InfoAddresses)');
            if (clientEmailSection) {
                const emailTitle = clientEmailSection.querySelector('.AddressTitle');
                if (emailTitle) {
                    emailTitle.style.color = '#004359';
                    emailTitle.style.fontWeight = 'bold';
                    emailTitle.style.fontSize = '18px';
                }
                
                // Set all regular text to black in the email section
                const addressTextElements = clientEmailSection.querySelectorAll('.AddressText');
                addressTextElements.forEach(element => {
                    element.style.color = 'black';
                    element.style.fontSize = '16px';
                });
                
                // Update any icon colors to match Fortune Gifts branding
                const icons = clientEmailSection.querySelectorAll('svg');
                icons.forEach(icon => {
                    if (icon.style && icon.style.color) {
                        icon.style.color = '#004359';
                    }
                });

                // Add white background and border to email section
                clientEmailSection.style.backgroundColor = 'white';
                clientEmailSection.style.border = '1px solid #e0e0e0';
                clientEmailSection.style.borderRadius = '4px';
                clientEmailSection.style.padding = '20px';
                clientEmailSection.style.marginBottom = '20px';

                // Set all text in the section to black
                const allTextElements = clientEmailSection.querySelectorAll('*');
                allTextElements.forEach(element => {
                    if (element.tagName !== 'STRONG' && !element.classList.contains('AddressTitle')) {
                        element.style.color = 'black';
                        element.style.fontSize = '16px';
                    }
                });
                
                pdfContainer.appendChild(clientEmailSection);
            }
            
            // Extract and append the items section
            const itemsSection = elementClone.querySelector('.Details');
            if (itemsSection) {
                // Set all item names and descriptions to black
                const itemNames = itemsSection.querySelectorAll('.ItemName');
                itemNames.forEach(element => {
                    element.style.color = 'black';
                    element.style.fontSize = '16px';
                });
                
                const itemDescriptions = itemsSection.querySelectorAll('.ItemDescription');
                itemDescriptions.forEach(element => {
                    element.style.color = 'black';
                    element.style.fontSize = '14px';
                });
                
                // Set all prices, quantities, and totals to black except in the header and grand total
                const itemPrices = itemsSection.querySelectorAll('.ItemPrice:not(.ItemsHeader .ItemPrice)');
                itemPrices.forEach(element => {
                    element.style.color = 'black';
                    element.style.fontSize = '16px';
                });
                
                const itemQtys = itemsSection.querySelectorAll('.ItemQty:not(.ItemsHeader .ItemQty)');
                itemQtys.forEach(element => {
                    element.style.color = 'black';
                    element.style.fontSize = '16px';
                });
                
                const itemVats = itemsSection.querySelectorAll('.ItemVat:not(.ItemsHeader .ItemVat)');
                itemVats.forEach(element => {
                    element.style.color = 'black';
                    element.style.fontSize = '16px';
                });
                
                const itemTotals = itemsSection.querySelectorAll('.ItemTotal:not(.ItemsHeader .ItemTotal)');
                itemTotals.forEach(element => {
                    element.style.color = 'black';
                    element.style.fontSize = '16px';
                });

                // Set header text size
                const headerCells = itemsSection.querySelectorAll('.ItemsHeader .HeaderCell');
                headerCells.forEach(element => {
                    element.style.fontSize = '18px';
                });

                // Add white background and border to items section
                itemsSection.style.backgroundColor = 'white';
                itemsSection.style.border = '1px solid #e0e0e0';
                itemsSection.style.borderRadius = '4px';
                itemsSection.style.marginBottom = '20px';

                // Set all text in the section to black except headers
                const allTextElements = itemsSection.querySelectorAll('*');
                allTextElements.forEach(element => {
                    if (!element.classList.contains('ItemsHeader') && !element.classList.contains('Total')) {
                        element.style.color = 'black';
                        element.style.fontSize = '16px';
                    }
                });
                
                pdfContainer.appendChild(itemsSection);
            }
            
            // Extract and append the terms and conditions section if it exists
            const termsSection = elementClone.querySelector('.TermsSection');
            if (termsSection) {
                const termsTitle = termsSection.querySelector('.TermsTitle');
                if (termsTitle) {
                    termsTitle.style.color = '#004359';
                    termsTitle.style.fontWeight = 'bold';
                    termsTitle.style.fontSize = '18px';
                }
                
                // Set the terms text to black
                const termsText = termsSection.querySelector('.TermsText');
                if (termsText) {
                    termsText.style.color = 'black';
                    termsText.style.fontSize = '16px';
                }

                // Add white background and border to terms section
                termsSection.style.backgroundColor = 'white';
                termsSection.style.border = '1px solid #e0e0e0';
                termsSection.style.borderRadius = '4px';
                termsSection.style.padding = '20px';
                termsSection.style.marginBottom = '20px';

                // Set all text in the section to black except title
                const allTextElements = termsSection.querySelectorAll('*');
                allTextElements.forEach(element => {
                    if (!element.classList.contains('TermsTitle')) {
                        element.style.color = 'black';
                        element.style.fontSize = '16px';
                    }
                });
                
                pdfContainer.appendChild(termsSection);
            }
            
            // Add signature section at the bottom
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
                    <div style="font-weight: bold; color: #004359; font-size: 19px !important;">Authorized Signature</div>
                </div>
                <div style="width: 45%;">
                    <div style="border-bottom: 2px solid #004359; margin-bottom: 15px;"></div>
                    <div style="font-weight: bold; color: #004359; font-size: 19px !important;">Client Acceptance</div>
                </div>
            `;

            // Add extra space before the signature section
            const spacerDiv = document.createElement('div');
            spacerDiv.style.height = '150px'; // Add space before signatures
            pdfContainer.appendChild(spacerDiv);

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

    // Calculate VAT amount (5%)
    const calculateVAT = (amount) => {
        return parseFloat(amount) * 0.05;
    };
    
    // Calculate total with VAT
    const calculateTotalWithVAT = (amount) => {
        return parseFloat(amount) + calculateVAT(amount);
    };

    // Check if client has VAT when client data changes
    useEffect(() => {
        if (clientData) {
            const hasTRN = !!(
                clientData.trn || 
                clientData.TRN || 
                clientData.trnNumber ||
                clientData.taxRegistrationNumber || 
                clientData.tax_registration_number ||
                clientData.taxNumber
            );
            
            setClientHasVAT(hasTRN);
        } else if (quotation?.clientTRN) {
            setClientHasVAT(true);
        }
    }, [clientData, quotation]);

    // Render client section with TRN from client data if available
    const renderClientSection = () => {
        // Check for TRN in various possible field names
        const clientTRN = 
            clientData?.trn || 
            clientData?.TRN || 
            clientData?.trnNumber ||
            clientData?.taxRegistrationNumber || 
            clientData?.tax_registration_number ||
            clientData?.taxNumber ||
            quotation?.clientTRN;
            
        // Check if client is from UAE
        const isUAE = quotation?.clientAddress?.country?.toLowerCase().includes('emirates') || 
                      quotation?.clientAddress?.country?.toLowerCase().includes('uae') ||
                      clientData?.country?.toLowerCase().includes('emirates') ||
                      clientData?.country?.toLowerCase().includes('uae');

        return (
            <AddressGroup>
                <AddressTitle>Bill To</AddressTitle>
                <AddressText>
                    <strong>{quotation.clientName}</strong><br />
                    {clientData?.address || quotation.clientAddress?.street || ''}
                    {quotation.clientAddress?.city && `, ${quotation.clientAddress.city}`}
                    {quotation.clientAddress?.postCode && `, ${quotation.clientAddress.postCode}`}
                    {clientData?.country || quotation.clientAddress?.country ? `, ${clientData?.country || quotation.clientAddress?.country}` : ''}
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
                total: grandTotal,
                status: 'pending',
                quotationId: quotation.id, // Reference to original quotation
                currency: quotation.currency || 'USD'
            };

            // Add to Firestore
            const invoicesRef = collection(db, 'invoices');
            const docRef = await addDoc(invoicesRef, {
                ...newInvoice,
                createdAt: Timestamp.fromDate(newInvoice.createdAt),
                paymentDue: Timestamp.fromDate(newInvoice.paymentDue)
            });

            // Update quotation status to invoiced
            const quotationRef = doc(db, 'quotations', id);
            await updateDoc(quotationRef, {
                status: 'invoiced',
                convertedToInvoice: docRef.id // Reference to the new invoice
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
                
                {/* Status bar with action buttons */}
                <Controller
                    variants={variant('controller')}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="Controller"
                >
                    <div>
                        <StatusBadge status={quotation.status}>
                            <span>
                                {quotation.status === 'approved' ? 'Approved' : 
                                 quotation.status === 'pending' ? 'Pending' : 'Draft'}
                            </span>
                        </StatusBadge>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <DownloadButton onClick={handleDownloadPDF} className="DownloadButton">
                            <Icon name="download" size={13} />
                            Download PDF
                        </DownloadButton>
                        
                        {isDesktop && (
                            <ButtonWrapper className="ButtonWrapper">
                                <Button
                                    $secondary
                                    onClick={() => editQuotation(id)}
                                    disabled={isLoading || isApproved}
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
                                {isPending && (
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
                    </div>
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
                                <span>#</span>{quotation.customId || id}
                            </InfoID>
                            <InfoDesc>{quotation.description || 'No description'}</InfoDesc>
                            
                            <MetaInfo>
                                <MetaItem>
                                    <Icon name="calendar" size={13} />
                                    Created: {formatDate(quotation.createdAt)}
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
                                    <div style={{ marginTop: '4px', fontSize: '11px', opacity: 0.8 }}>
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
                    <Button
                        $secondary
                        onClick={() => editQuotation(id)}
                        disabled={isLoading || isApproved}
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
                    {isPending && (
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