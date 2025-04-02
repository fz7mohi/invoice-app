import React, { useState, useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { useReducedMotion } from 'framer-motion';
import Icon from '../../shared/Icon/Icon';
import Status from '../../shared/Status/Status';
import Button from '../../shared/Button/Button';
import { formatDate, formatPrice } from '../../../utilities/helpers';
import { useGlobalContext } from '../../App/context';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import './DeliveryOrderView.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
    StyledDeliveryOrderView,
    Container,
    StyledLink,
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
    ItemPackaging,
    ItemTotal,
    Total,
    TotalText,
    TotalAmount,
    StatusBadge,
    MetaInfo,
    MetaItem,
    DownloadButton,
    ActionButtons,
    StatusDot,
    HeaderSection,
    HeaderTitle,
    InfoSectionsGrid,
    CartonDetailsSection,
    CartonDetailsTitle,
    CartonDetailsTable,
    CartonDetailsRow,
    CartonDetailsCell,
    PackagingDetailsSection,
    PackagingDetailsTitle,
    PackagingDetailsTable,
    PackagingDetailsHeader,
    PackagingDetailsBody,
    PackagingDetailsRow,
    PackagingDetailsCell,
    PackagingDetailsHeaderCell,
    SectionDivider,
    TableContainer,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableHeaderCell,
    TableFooter,
    TableFooterRow,
    TableFooterCell,
    InfoSection,
    InfoSectionTitle,
    InfoSectionContent,
    InfoSectionGrid,
    InfoSectionItem,
    InfoSectionLabel,
    InfoSectionValue
} from './DeliveryOrderViewStyles';
import { motion, AnimatePresence } from 'framer-motion';
import NewDeliveryOrder from '../NewDeliveryOrder/NewDeliveryOrder';
import { ModalOverlay } from '../DeliveryOrdersStyles';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DeliveryOrderPDF from './DeliveryOrderPDF';

const DeliveryOrderView = () => {
    const { colors } = useTheme();
    const { id } = useParams();
    const [deliveryOrder, setDeliveryOrder] = useState(null);
    const [clientData, setClientData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDirectlyFetching, setIsDirectlyFetching] = useState(false);
    const [isClientFetching, setIsClientFetching] = useState(false);
    const shouldReduceMotion = useReducedMotion();
    const history = useHistory();
    const { theme, companyProfile } = useGlobalContext();
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    // Set document title
    useEffect(() => {
        document.title = `Delivery Order | ${deliveryOrder?.customId || id}`;
    }, [deliveryOrder, id]);

    // Fetch delivery order data
    useEffect(() => {
        const fetchDeliveryOrder = async () => {
            try {
                setIsLoading(true);
                const deliveryOrderRef = doc(db, 'deliveryOrders', id);
                const docSnap = await getDoc(deliveryOrderRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log('Raw delivery order data from Firebase:', data);
                    
                    // Convert Firestore Timestamp back to Date object safely
                    let createdAt = new Date();
                    let updatedAt = new Date();
                    
                    try {
                        createdAt = data.createdAt?.toDate() || new Date();
                        updatedAt = data.updatedAt?.toDate() || new Date();
                    } catch (dateError) {
                        // Handle date error silently
                    }
                    
                    // Create a complete delivery order object
                    const fetchedDeliveryOrder = {
                        ...data,
                        id: docSnap.id,
                        customId: data.customId || docSnap.id,
                        createdAt,
                        updatedAt,
                        items: Array.isArray(data.items) ? data.items : [],
                        currency: data.currency || 'USD'
                    };
                    
                    console.log('Processed delivery order data:', fetchedDeliveryOrder);
                    
                    setDeliveryOrder(fetchedDeliveryOrder);
                    
                    // After fetching delivery order, fetch client data
                    await fetchClientData(fetchedDeliveryOrder.clientName);
                    
                    return true;
                } else {
                    console.error('No delivery order found with ID:', id);
                    setError('Delivery order not found');
                    return false;
                }
            } catch (error) {
                console.error('Error fetching delivery order:', error);
                setError('Error fetching delivery order');
                return false;
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeliveryOrder();
    }, [id]);

    // Fetch client data
    const fetchClientData = async (clientName) => {
        if (!clientName) {
            return;
        }
        
        try {
            setIsClientFetching(true);
            
            // Try to find client by name
            const clientsRef = collection(db, 'clients');
            const q = query(clientsRef, where('name', '==', clientName));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const data = querySnapshot.docs[0].data();
                setClientData(data);
            }
        } catch (error) {
            console.error('Error fetching client data:', error);
        } finally {
            setIsClientFetching(false);
        }
    };

    // Handle PDF download
    const handleDownloadPDF = async () => {
        try {
            // Get the client's country from the delivery order or client data
            const clientCountry = deliveryOrder?.clientAddress?.country || 
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
                    <h1 style="font-size: 32px; color: #004359; margin: 0; letter-spacing: 1px;">DELIVERY ORDER</h1>
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
                    <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Deliver To</div>
                    <div style="color: black; font-size: 16px; margin-bottom: 5px;">${deliveryOrder.clientName}</div>
                    ${deliveryOrder.clientAddress?.street ? `<div style="color: black; font-size: 16px;">${deliveryOrder.clientAddress.street}</div>` : ''}
                    ${deliveryOrder.clientAddress?.city ? `<div style="color: black; font-size: 16px;">${deliveryOrder.clientAddress.city}${deliveryOrder.clientAddress?.postCode ? `, ${deliveryOrder.clientAddress.postCode}` : ''}</div>` : ''}
                    ${deliveryOrder.clientAddress?.country ? `<div style="color: black; font-size: 16px;">${deliveryOrder.clientAddress.country}</div>` : ''}
                    ${deliveryOrder.clientPhone ? `<div style="color: black; font-size: 16px;">${deliveryOrder.clientPhone}</div>` : ''}
                </div>
                <div style="text-align: right;">
                    <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Delivery Order Details</div>
                    <div style="color: black; font-size: 16px; margin-bottom: 5px;">Delivery Order #: ${deliveryOrder.customId}</div>
                    <div style="color: black; font-size: 16px; margin-bottom: 5px;">Date: ${formatDate(deliveryOrder.createdAt)}</div>
                    <div style="color: black; font-size: 16px;">Invoice #: ${deliveryOrder.invoiceCustomId || deliveryOrder.invoiceId}</div>
                </div>
            `;
            pdfContainer.appendChild(clientSection);

            // Add items table
            const itemsTable = document.createElement('table');
            itemsTable.style.cssText = `
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
            `;
            itemsTable.innerHTML = `
                <thead>
                    <tr style="background-color: #004359; color: white;">
                        <th style="padding: 12px; text-align: left; font-size: 14px;">Item</th>
                        <th style="padding: 12px; text-align: left; font-size: 14px;">Invoice Qty</th>
                        <th style="padding: 12px; text-align: left; font-size: 14px;">Packaging Type</th>
                        <th style="padding: 12px; text-align: left; font-size: 14px;">Details</th>
                        <th style="padding: 12px; text-align: right; font-size: 14px;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${deliveryOrder.items.map(item => `
                        <tr style="border-bottom: 1px solid #e0e0e0;">
                            <td style="padding: 12px; font-size: 14px;">${item.name}</td>
                            <td style="padding: 12px; font-size: 14px;">${item.quantity}</td>
                            <td style="padding: 12px; font-size: 14px;">${item.packagingType === 'piece' ? 'Individual Pieces' : 'Carton Packaging'}</td>
                            <td style="padding: 12px; font-size: 14px;">
                                ${item.packagingType === 'piece' 
                                    ? `${item.deliveryPieces} pieces`
                                    : `${item.cartons} cartons (${item.piecesPerCarton} pieces each)`}
                            </td>
                            <td style="padding: 12px; font-size: 14px; text-align: right;">
                                ${item.packagingType === 'piece'
                                    ? `${item.deliveryPieces} pieces`
                                    : `${item.cartons * item.piecesPerCarton} pieces`}
                            </td>
                        </tr>
                        ${item.packagingType === 'carton' && item.cartonDetails ? `
                            <tr style="background-color: #f8f9fa;">
                                <td colspan="5" style="padding: 12px;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <thead>
                                            <tr style="background-color: #e9ecef;">
                                                <th style="padding: 8px; text-align: left; font-size: 12px;">Carton Size</th>
                                                <th style="padding: 8px; text-align: left; font-size: 12px;">Number of Cartons</th>
                                                <th style="padding: 8px; text-align: left; font-size: 12px;">Pieces per Carton</th>
                                                <th style="padding: 8px; text-align: right; font-size: 12px;">Total Pieces</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${item.cartonDetails.map(carton => `
                                                <tr style="border-bottom: 1px solid #e0e0e0;">
                                                    <td style="padding: 8px; font-size: 12px;">${carton.size}</td>
                                                    <td style="padding: 8px; font-size: 12px;">${carton.count}</td>
                                                    <td style="padding: 8px; font-size: 12px;">${carton.piecesPerCarton}</td>
                                                    <td style="padding: 8px; font-size: 12px; text-align: right;">${carton.count * carton.piecesPerCarton}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        ` : ''}
                    `).join('')}
                </tbody>
            `;
            pdfContainer.appendChild(itemsTable);

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
            footerText.innerHTML = 'This is a computer-generated delivery order and does not require a physical signature.';
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
            pdf.save(`Delivery_Order_${deliveryOrder.customId || deliveryOrder.id}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('There was an error generating the PDF. Please try again.');
        }
    };

    // Render client section
    const renderClientSection = () => {
        if (!clientData) return null;

        return (
            <AddressGroup>
                <AddressTitle>Client</AddressTitle>
                <AddressText>{clientData.name}</AddressText>
                <AddressText>{clientData.email}</AddressText>
                <AddressText>{clientData.phone}</AddressText>
                <AddressText>{clientData.address}</AddressText>
            </AddressGroup>
        );
    };

    // Render packaging details in a table format
    const renderPackagingDetails = () => {
        if (!deliveryOrder || !deliveryOrder.items) return null;

        // Calculate totals
        let totalQuantity = 0;
        deliveryOrder.items.forEach(item => {
            totalQuantity += parseInt(item.quantity) || 0;
        });

        // Get total from invoice
        const totalAmount = deliveryOrder.invoiceTotal || 0;

        return (
            <PackagingDetailsSection>
                <PackagingDetailsTitle>Packaging Details</PackagingDetailsTitle>
                <TableContainer>
                    <PackagingDetailsTable>
                        <TableHeader>
                            <tr>
                                <TableHeaderCell>Item</TableHeaderCell>
                                <TableHeaderCell>Qty</TableHeaderCell>
                                <TableHeaderCell>Packaging Type</TableHeaderCell>
                                <TableHeaderCell>Details</TableHeaderCell>
                            </tr>
                        </TableHeader>
                        <TableBody>
                            {deliveryOrder.items.map((item, index) => {
                                // Calculate total pieces delivered for this item
                                let totalPiecesDelivered = 0;
                                if (item.packagingType === 'piece') {
                                    totalPiecesDelivered = parseInt(item.deliveryPieces) || parseInt(item.quantity) || 0;
                                } else if (item.packagingType === 'carton' && item.cartonDetails) {
                                    totalPiecesDelivered = item.cartonDetails.reduce((sum, carton) => 
                                        sum + (carton.count * carton.piecesPerCarton), 0);
                                }
                                
                                // Calculate undelivered pieces
                                const totalItemQuantity = parseInt(item.quantity) || 0;
                                const undeliveredPieces = Math.max(0, totalItemQuantity - totalPiecesDelivered);
                                
                                return (
                                    <React.Fragment key={index}>
                                        <TableRow>
                                            <TableCell>
                                                <div>
                                                    <strong>{item.name}</strong>
                                                    {item.description && (
                                                        <div style={{ color: '#DFE3FA', fontSize: '0.9em', marginTop: '4px' }}>
                                                            {item.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>
                                                {item.packagingType === 'piece' ? 'Individual Pieces' : 'Carton Packaging'}
                                            </TableCell>
                                            <TableCell>
                                                {item.packagingType === 'piece' ? (
                                                    <div>
                                                        <span style={{ color: '#DFE3FA' }}>Pieces: </span>
                                                        <span style={{ fontWeight: '500' }}>{item.deliveryPieces || item.quantity}</span>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <span style={{ color: '#DFE3FA' }}>Cartons: </span>
                                                        <span style={{ fontWeight: '500' }}>
                                                            {item.cartonDetails ? item.cartonDetails.reduce((sum, carton) => sum + carton.count, 0) : 0}
                                                        </span>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        
                                        {item.packagingType === 'carton' && item.cartonDetails && item.cartonDetails.length > 0 && (
                                            <TableRow style={{ backgroundColor: 'rgba(34, 34, 34, 0.5)' }}>
                                                <TableCell colSpan="4" style={{ padding: '0' }}>
                                                    <table style={{ 
                                                        width: '100%', 
                                                        borderCollapse: 'collapse',
                                                        marginLeft: '0'
                                                    }}>
                                                        <thead>
                                                            <tr style={{ 
                                                                backgroundColor: 'rgba(51, 51, 51, 0.5)', 
                                                                borderBottom: '1px solid #444' 
                                                            }}>
                                                                <th style={{ 
                                                                    padding: '8px 16px', 
                                                                    textAlign: 'left',
                                                                    fontWeight: '600',
                                                                    fontSize: '0.9em',
                                                                    color: '#DFE3FA'
                                                                }}>Carton Size</th>
                                                                <th style={{ 
                                                                    padding: '8px 16px', 
                                                                    textAlign: 'left',
                                                                    fontWeight: '600',
                                                                    fontSize: '0.9em',
                                                                    color: '#DFE3FA'
                                                                }}>Number of Cartons</th>
                                                                <th style={{ 
                                                                    padding: '8px 16px', 
                                                                    textAlign: 'left',
                                                                    fontWeight: '600',
                                                                    fontSize: '0.9em',
                                                                    color: '#DFE3FA'
                                                                }}>Pieces per Carton</th>
                                                                <th style={{ 
                                                                    padding: '8px 16px', 
                                                                    textAlign: 'right',
                                                                    fontWeight: '600',
                                                                    fontSize: '0.9em',
                                                                    color: '#DFE3FA'
                                                                }}>Total Pieces</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {item.cartonDetails.map((carton, cartonIndex) => (
                                                                <tr key={cartonIndex} style={{ 
                                                                    borderBottom: '1px solid #444',
                                                                    fontSize: '0.9em'
                                                                }}>
                                                                    <td style={{ padding: '8px 16px', color: '#FFFFFF' }}>
                                                                        {carton.size}
                                                                    </td>
                                                                    <td style={{ padding: '8px 16px', color: '#FFFFFF' }}>
                                                                        {carton.count}
                                                                    </td>
                                                                    <td style={{ padding: '8px 16px', color: '#FFFFFF' }}>
                                                                        {carton.piecesPerCarton}
                                                                    </td>
                                                                    <td style={{ 
                                                                        padding: '8px 16px',
                                                                        textAlign: 'right',
                                                                        fontWeight: '500',
                                                                        color: '#FFFFFF'
                                                                    }}>
                                                                        {carton.count * carton.piecesPerCarton}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                        <tfoot>
                                                            <tr style={{ 
                                                                backgroundColor: 'rgba(51, 51, 51, 0.7)',
                                                                borderTop: '1px solid #444',
                                                                fontSize: '0.9em'
                                                            }}>
                                                                <td colSpan="3" style={{ 
                                                                    padding: '8px 16px',
                                                                    textAlign: 'right',
                                                                    fontWeight: '600',
                                                                    color: '#DFE3FA'
                                                                }}>
                                                                    Total Delivered:
                                                                </td>
                                                                <td style={{ 
                                                                    padding: '8px 16px',
                                                                    textAlign: 'right',
                                                                    fontWeight: '600',
                                                                    color: '#FFFFFF'
                                                                }}>
                                                                    {totalPiecesDelivered} pieces
                                                                </td>
                                                            </tr>
                                                            <tr style={{ 
                                                                backgroundColor: 'rgba(51, 51, 51, 0.7)',
                                                                fontSize: '0.9em'
                                                            }}>
                                                                <td colSpan="3" style={{ 
                                                                    padding: '8px 16px',
                                                                    textAlign: 'right',
                                                                    fontWeight: '600',
                                                                    color: '#DFE3FA'
                                                                }}>
                                                                    Undelivered:
                                                                </td>
                                                                <td style={{ 
                                                                    padding: '8px 16px',
                                                                    textAlign: 'right',
                                                                    fontWeight: '600',
                                                                    color: '#FFFFFF'
                                                                }}>
                                                                    {undeliveredPieces} pieces
                                                                </td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        
                                        {item.packagingType === 'piece' && (
                                            <TableRow style={{ backgroundColor: 'rgba(34, 34, 34, 0.5)' }}>
                                                <TableCell colSpan="4" style={{ padding: '0' }}>
                                                    <table style={{ 
                                                        width: '100%', 
                                                        borderCollapse: 'collapse',
                                                        marginLeft: '0'
                                                    }}>
                                                        <tfoot>
                                                            <tr style={{ 
                                                                backgroundColor: 'rgba(51, 51, 51, 0.7)',
                                                                borderTop: '1px solid #444',
                                                                fontSize: '0.9em'
                                                            }}>
                                                                <td colSpan="3" style={{ 
                                                                    padding: '8px 16px',
                                                                    textAlign: 'right',
                                                                    fontWeight: '600',
                                                                    color: '#DFE3FA'
                                                                }}>
                                                                    Total Delivered:
                                                                </td>
                                                                <td style={{ 
                                                                    padding: '8px 16px',
                                                                    textAlign: 'right',
                                                                    fontWeight: '600',
                                                                    color: '#FFFFFF'
                                                                }}>
                                                                    {totalPiecesDelivered} pieces
                                                                </td>
                                                            </tr>
                                                            <tr style={{ 
                                                                backgroundColor: 'rgba(51, 51, 51, 0.7)',
                                                                fontSize: '0.9em'
                                                            }}>
                                                                <td colSpan="3" style={{ 
                                                                    padding: '8px 16px',
                                                                    textAlign: 'right',
                                                                    fontWeight: '600',
                                                                    color: '#DFE3FA'
                                                                }}>
                                                                    Undelivered:
                                                                </td>
                                                                <td style={{ 
                                                                    padding: '8px 16px',
                                                                    textAlign: 'right',
                                                                    fontWeight: '600',
                                                                    color: '#FFFFFF'
                                                                }}>
                                                                    {undeliveredPieces} pieces
                                                                </td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </TableBody>
                        <TableFooter>
                            <TableFooterRow>
                                <TableFooterCell colSpan="4" style={{ textAlign: 'center' }}>Thank you for your business!</TableFooterCell>
                            </TableFooterRow>
                        </TableFooter>
                    </PackagingDetailsTable>
                </TableContainer>
            </PackagingDetailsSection>
        );
    };

    // Render delivery information
    const renderDeliveryInfo = () => {
        if (!deliveryOrder) return null;

        return (
            <InfoSection>
                <InfoSectionTitle>Delivery Information</InfoSectionTitle>
                <InfoSectionGrid>
                    <InfoSectionItem>
                        <InfoSectionLabel>Delivery Order #</InfoSectionLabel>
                        <InfoSectionValue>{deliveryOrder.customId}</InfoSectionValue>
                    </InfoSectionItem>
                    <InfoSectionItem>
                        <InfoSectionLabel>Invoice #</InfoSectionLabel>
                        <InfoSectionValue>
                            {deliveryOrder.invoiceCustomId || deliveryOrder.invoiceId ? (
                                <Link 
                                    to={`/invoice/${deliveryOrder.invoiceId}`}
                                    style={{ 
                                        color: colors.purple,
                                        textDecoration: 'none',
                                        fontWeight: '500'
                                    }}
                                >
                                    {deliveryOrder.invoiceCustomId || deliveryOrder.invoiceId}
                                </Link>
                            ) : 'N/A'}
                        </InfoSectionValue>
                    </InfoSectionItem>
                    <InfoSectionItem>
                        <InfoSectionLabel>Created Date</InfoSectionLabel>
                        <InfoSectionValue>{formatDate(deliveryOrder.createdAt)}</InfoSectionValue>
                    </InfoSectionItem>
                </InfoSectionGrid>
            </InfoSection>
        );
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    // Show loading state
    if (isLoading || !deliveryOrder) {
        return (
            <StyledDeliveryOrderView className="StyledDeliveryOrderView">
                <Container>
                    <StyledLink
                        to="/delivery-orders"
                        className="StyledLink"
                        style={{ marginBottom: '28px' }}
                    >
                        <Icon name={'arrow-left'} size={10} color={colors.purple} />
                        Go back
                    </StyledLink>
                    
                    <HeaderSection>
                        <HeaderTitle>Delivery Order</HeaderTitle>
                    </HeaderSection>
                    
                    <Controller className="Controller">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Text>Loading delivery order...</Text>
                            <div style={{ marginLeft: 16, width: 16, height: 16 }} className="loading-spinner"></div>
                        </div>
                    </Controller>
                </Container>
            </StyledDeliveryOrderView>
        );
    }

    if (error) {
        return (
            <StyledDeliveryOrderView className="StyledDeliveryOrderView">
                <Container>
                    <StyledLink
                        to="/delivery-orders"
                        className="StyledLink"
                        style={{ marginBottom: '28px' }}
                    >
                        <Icon name={'arrow-left'} size={10} color={colors.purple} />
                        Go back
                    </StyledLink>
                    
                    <HeaderSection>
                        <HeaderTitle>Delivery Order</HeaderTitle>
                    </HeaderSection>
                    
                    <Controller className="Controller">
                        <div className="error-message">{error}</div>
                    </Controller>
                </Container>
            </StyledDeliveryOrderView>
        );
    }

    return (
        <StyledDeliveryOrderView className="StyledDeliveryOrderView">
            <Container>
                <StyledLink
                    to="/delivery-orders"
                    className="StyledLink"
                    style={{ marginBottom: '28px' }}
                >
                    <Icon name={'arrow-left'} size={10} color={colors.purple} />
                    Go back
                </StyledLink>
                
                <HeaderSection>
                    <HeaderTitle>Delivery Order</HeaderTitle>
                    <ActionButtons>
                        <DownloadButton onClick={handleDownloadPDF} className="DownloadButton">
                            <Icon name="download" size={13} />
                            Download PDF
                        </DownloadButton>
                        <Button
                            onClick={() => setIsEditModalOpen(true)}
                            variant="secondary"
                            style={{
                                backgroundColor: colors.purple,
                                color: '#FFFFFF',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                    backgroundColor: colors.purpleHover,
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                                }
                            }}
                        >
                            <Icon name="edit" size={16} />
                            Edit Delivery Order
                        </Button>
                    </ActionButtons>
                </HeaderSection>
                
                <InfoCard
                    id="delivery-order-content"
                    className="InfoCard"
                >
                    <InfoHeader>
                        <InfoGroup>
                            <InfoID>
                                <span>#</span>{deliveryOrder.customId}
                            </InfoID>
                            <InfoDesc>Delivery Order</InfoDesc>
                        </InfoGroup>
                    </InfoHeader>
                    
                    <InfoAddresses className="InfoAddresses">
                        {renderClientSection()}
                    </InfoAddresses>
                    
                    <SectionDivider />
                    
                    {renderDeliveryInfo()}
                    
                    <SectionDivider />
                    
                    <Details className="Details">
                        {renderPackagingDetails()}
                    </Details>
                </InfoCard>

                <AnimatePresence>
                    {isEditModalOpen && (
                        <ModalOverlay
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseEditModal}
                        >
                            <NewDeliveryOrder 
                                onClose={handleCloseEditModal}
                                editMode={true}
                                deliveryOrder={deliveryOrder}
                            />
                        </ModalOverlay>
                    )}
                </AnimatePresence>
            </Container>
        </StyledDeliveryOrderView>
    );
};

export default DeliveryOrderView; 