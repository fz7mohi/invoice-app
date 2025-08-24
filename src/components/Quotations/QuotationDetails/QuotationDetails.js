import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from 'styled-components';
import { useGlobalContext } from '../../App/context';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { LoadingContainer, DetailsContainer, DetailsHeader, DetailsTitle, CloseButton, DetailsContent, DetailsSection, DetailsLabel, DetailsValue, StatusBadge, StatusDot } from './QuotationDetailsStyles';
import Icon from '../../shared/Icon/Icon';
import { formatDate, formatPrice } from '../../../utilities/helpers';
import { createQRScannerURL, generateScannerQRCode, generateTextQRCode } from '../../../utilities/qrCodeGenerator';

// Loading spinner animation
const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const QuotationDetails = ({ quotation, onClose }) => {
    const { colors } = useTheme();
    const { windowWidth } = useGlobalContext();
    const isDesktop = windowWidth >= 768;
    
    // State for direct Firebase data
    const [directData, setDirectData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [qrCodes, setQrCodes] = useState({});
    const [isGeneratingQR, setIsGeneratingQR] = useState(false);

    // Function to fetch directly from Firebase
    const fetchDirectly = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, 'quotations', quotation.id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                
                // Ensure each quotation has a custom ID in the correct format
                const customId = data.customId || `FTQ${Math.floor(1000 + Math.random() * 9000)}`;
                
                // Explicitly set currency with a clear default
                const currency = data.currency || 'USD';
                
                setDirectData({
                    ...data,
                    id: docSnap.id,
                    customId: customId,
                    clientName: data.clientName || 'Unnamed Client',
                    status: data.status || 'pending',
                    total: parseFloat(data.total) || 0,
                    currency: currency,
                    paymentDue: data.paymentDue?.toDate?.() || new Date()
                });
            }
        } catch (error) {
            // Error handling is done silently
        } finally {
            setLoading(false);
        }
    };

    // Generate QR codes for items with images
    useEffect(() => {
        const generateQRCodes = async () => {
            const dataToUse = quotation || directData;
            if (!dataToUse?.items) return;
            
            setIsGeneratingQR(true);
            const newQRCodes = {};
            
            try {
                for (const item of dataToUse.items) {
                    if (item.imageUrl) {
                        // Use stored QR code if available, otherwise generate new one
                        if (item.qrCodeUrl) {
                            console.log('Using stored QR code for item:', item.name);
                            newQRCodes[item.name] = item.qrCodeUrl;
                        } else {
                            console.log('Generating new QR code for item:', item.name);
                            try {
                                const qrCode = await generateScannerQRCode(
                                    item.imageUrl,
                                    item.name,
                                    dataToUse.customId || dataToUse.id,
                                    40
                                );
                                newQRCodes[item.name] = qrCode;
                            } catch (error) {
                                console.error('Error generating QR code for item:', item.name, error);
                                // Try fallback QR code
                                try {
                                    const fallbackText = `${item.name} - ${dataToUse.customId || dataToUse.id}`;
                                    const fallbackQR = await generateTextQRCode(fallbackText, 40);
                                    newQRCodes[item.name] = fallbackQR;
                                } catch (fallbackError) {
                                    console.error('Fallback QR generation also failed:', fallbackError);
                                }
                            }
                        }
                    }
                }
                setQrCodes(newQRCodes);
            } catch (error) {
                console.error('Error processing QR codes:', error);
            } finally {
                setIsGeneratingQR(false);
            }
        };

        generateQRCodes();
    }, [quotation, directData]);

    // Function to format status text
    const formatStatus = (status) => {
        switch (status) {
            case 'pending':
                return 'Pending';
            case 'invoiced':
                return 'Invoiced';
            case 'draft':
                return 'Draft';
            default:
                return 'Draft';
        }
    };

    // Choose which data to display
    const dataToDisplay = quotation || directData;
    
    // Show loading state if either the parent is loading or we're loading directly
    if (!dataToDisplay || loading) {
        return (
            <LoadingContainer>
                <Icon name="spinner" size={24} style={{ marginRight: '10px', animation: 'spin 1s linear infinite' }} />
                Loading quotation details...
            </LoadingContainer>
        );
    }
    
    return (
        <DetailsContainer>
            <DetailsHeader>
                <DetailsTitle>Quotation Details</DetailsTitle>
                <CloseButton onClick={onClose}>
                    <Icon name="close" size={24} color={colors.text.primary} />
                </CloseButton>
            </DetailsHeader>
            <DetailsContent>
                <DetailsSection>
                    <DetailsLabel>Quotation ID</DetailsLabel>
                    <DetailsValue>{dataToDisplay.customId || dataToDisplay.id}</DetailsValue>
                </DetailsSection>
                <DetailsSection>
                    <DetailsLabel>Client</DetailsLabel>
                    <DetailsValue>{dataToDisplay.clientName}</DetailsValue>
                </DetailsSection>
                <DetailsSection>
                    <DetailsLabel>Project</DetailsLabel>
                    <DetailsValue>{dataToDisplay.description || 'No description'}</DetailsValue>
                </DetailsSection>
                <DetailsSection>
                    <DetailsLabel>Created Date</DetailsLabel>
                    <DetailsValue>{formatDate(dataToDisplay.createdAt)}</DetailsValue>
                </DetailsSection>
                <DetailsSection>
                    <DetailsLabel>Due Date</DetailsLabel>
                    <DetailsValue>{formatDate(dataToDisplay.paymentDue)}</DetailsValue>
                </DetailsSection>
                <DetailsSection>
                    <DetailsLabel>Amount</DetailsLabel>
                    <DetailsValue>{formatPrice(dataToDisplay.total, dataToDisplay.currency)}</DetailsValue>
                </DetailsSection>
                <DetailsSection>
                    <DetailsLabel>Status</DetailsLabel>
                    <StatusBadge status={dataToDisplay.status}>
                        <StatusDot status={dataToDisplay.status} />
                        {formatStatus(dataToDisplay.status)}
                    </StatusBadge>
                </DetailsSection>
            </DetailsContent>
            {/* Items Table with S/N */}
            {Array.isArray(dataToDisplay.items) && dataToDisplay.items.length > 0 && (
                <div style={{ margin: '32px 0 0 0', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                        <thead>
                            <tr style={{ background: '#004359', color: '#fff' }}>
                                <th style={{ padding: '12px', textAlign: 'center', width: 60 }}>S/N</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Item Name</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>QTY.</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>Price</th>
                                {dataToDisplay.items.some(item => item.vat) && (
                                    <th style={{ padding: '12px', textAlign: 'right' }}>VAT</th>
                                )}
                                <th style={{ padding: '12px', textAlign: 'right' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataToDisplay.items.map((item, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #e0e0e0' }}>
                                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>{idx + 1}</td>
                                    <td style={{ padding: '12px', textAlign: 'left' }}>
                                        {item.name}
                                        {item.description && (
                                            <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{item.description}</div>
                                        )}
                                        {item.leadTime && (
                                            <div style={{ fontSize: 13, color: '#888EB0', marginTop: 2, fontStyle: 'italic' }}>
                                                Lead Time: {item.leadTime}
                                            </div>
                                        )}
                                        {/* Display images for the item */}
                                        {item.images && item.images.length > 0 ? (
                                            <div style={{ 
                                                display: 'flex', 
                                                flexDirection: 'column', 
                                                gap: '8px', 
                                                marginTop: '8px' 
                                            }}>
                                                <div style={{ 
                                                    fontSize: '12px', 
                                                    color: '#888EB0', 
                                                    fontWeight: '500' 
                                                }}>
                                                    Images ({item.images.length}):
                                                </div>
                                                <div style={{ 
                                                    display: 'flex', 
                                                    flexWrap: 'wrap', 
                                                    gap: '8px' 
                                                }}>
                                                    {item.images.map((image, imgIndex) => (
                                                        <div key={image.id || imgIndex} style={{ 
                                                            display: 'flex', 
                                                            flexDirection: 'column', 
                                                            alignItems: 'center', 
                                                            gap: '4px' 
                                                        }}>
                                                            {image.qrCodeUrl ? (
                                                                <img 
                                                                    src={image.qrCodeUrl} 
                                                                    alt={`QR Code for ${image.name}`}
                                                                    style={{ 
                                                                        width: '50px', 
                                                                        height: '50px',
                                                                        border: '1px solid #E0E0E0',
                                                                        borderRadius: '4px',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                    title="Click to open image or scan QR code"
                                                                    onClick={() => {
                                                                        // Open image in new browser window
                                                                        if (image.url) {
                                                                            const newWindow = window.open('', '_blank');
                                                                            if (newWindow) {
                                                                                newWindow.document.write(`
                                                                                    <!DOCTYPE html>
                                                                                    <html lang="en">
                                                                                    <head>
                                                                                        <meta charset="UTF-8">
                                                                                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                                                        <title>${item.name || 'Unknown Item'} - Item Image</title>
                                                                                        <style>
                                                                                            * {
                                                                                                margin: 0;
                                                                                                padding: 0;
                                                                                                box-sizing: border-box;
                                                                                            }
                                                                                            
                                                                                            body {
                                                                                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                                                                                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                                                                                min-height: 100vh;
                                                                                                padding: 20px;
                                                                                                color: #333;
                                                                                            }
                                                                                            
                                                                                            .container {
                                                                                                max-width: 100%;
                                                                                                margin: 0 auto;
                                                                                                background: white;
                                                                                                border-radius: 20px;
                                                                                                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                                                                                                overflow: hidden;
                                                                                            }
                                                                                            
                                                                                            .header {
                                                                                                background: linear-gradient(135deg, #7C5DFA 0%, #6B4CDB 100%);
                                                                                                color: white;
                                                                                                padding: 25px 20px;
                                                                                                text-align: center;
                                                                                                position: relative;
                                                                                            }
                                                                                            
                                                                                            .header::before {
                                                                                                content: '';
                                                                                                position: absolute;
                                                                                                top: 0;
                                                                                                left: 0;
                                                                                                right: 0;
                                                                                                bottom: 0;
                                                                                                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                                                                                                opacity: 0.3;
                                                                                            }
                                                                                            
                                                                                            .header h1 {
                                                                                                font-size: 1.5rem;
                                                                                                font-weight: 700;
                                                                                                margin-bottom: 8px;
                                                                                                position: relative;
                                                                                                z-index: 1;
                                                                                            }
                                                                                            
                                                                                            .header .subtitle {
                                                                                                font-size: 0.9rem;
                                                                                                opacity: 0.9;
                                                                                                position: relative;
                                                                                                z-index: 1;
                                                                                            }
                                                                                            
                                                                                            .content {
                                                                                                padding: 25px 20px;
                                                                                            }
                                                                                            
                                                                                            .image-section {
                                                                                                text-align: center;
                                                                                                margin-bottom: 25px;
                                                                                            }
                                                                                            
                                                                                            .image-container {
                                                                                                background: #f8f9fa;
                                                                                                border-radius: 15px;
                                                                                                padding: 20px;
                                                                                                margin-bottom: 20px;
                                                                                                border: 2px dashed #e9ecef;
                                                                                            }
                                                                                            
                                                                                            .image-display {
                                                                                                max-width: 100%;
                                                                                                height: auto;
                                                                                                border-radius: 12px;
                                                                                                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                                                                                                transition: transform 0.3s ease;
                                                                                            }
                                                                                            
                                                                                            .image-display:hover {
                                                                                                transform: scale(1.02);
                                                                                            }
                                                                                            
                                                                                            .item-info {
                                                                                                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                                                                                                border-radius: 15px;
                                                                                                padding: 25px;
                                                                                                margin-bottom: 25px;
                                                                                                border: 1px solid #e9ecef;
                                                                                            }
                                                                                            
                                                                                            .info-item {
                                                                                                display: flex;
                                                                                                justify-content: space-between;
                                                                                                align-items: center;
                                                                                                padding: 16px 20px;
                                                                                                background: white;
                                                                                                border-radius: 10px;
                                                                                                margin-bottom: 12px;
                                                                                                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                                                                                                border-left: 4px solid #7C5DFA;
                                                                                            }
                                                                                            
                                                                                            .info-item:last-child {
                                                                                                margin-bottom: 0;
                                                                                            }
                                                                                            
                                                                                            .info-label {
                                                                                                font-size: 0.8rem;
                                                                                                color: #6c757d;
                                                                                                font-weight: 600;
                                                                                                text-transform: uppercase;
                                                                                                letter-spacing: 0.5px;
                                                                                            }
                                                                                            
                                                                                            .info-value {
                                                                                                font-size: 1rem;
                                                                                                font-weight: 600;
                                                                                                color: #2c3e50;
                                                                                                text-align: right;
                                                                                            }
                                                                                            
                                                                                            .metadata {
                                                                                                background: #e9ecef;
                                                                                                border-radius: 10px;
                                                                                                padding: 15px;
                                                                                                font-size: 0.8rem;
                                                                                                color: #6c757d;
                                                                                                text-align: center;
                                                                                            }
                                                                                            
                                                                                            .close-btn {
                                                                                                position: fixed;
                                                                                                top: 20px;
                                                                                                right: 20px;
                                                                                                background: rgba(255,255,255,0.2);
                                                                                                border: none;
                                                                                                color: white;
                                                                                                width: 40px;
                                                                                                height: 40px;
                                                                                                border-radius: 50%;
                                                                                                cursor: pointer;
                                                                                                font-size: 1.2rem;
                                                                                                backdrop-filter: blur(10px);
                                                                                                transition: all 0.3s ease;
                                                                                            }
                                                                                            
                                                                                            .close-btn:hover {
                                                                                                background: rgba(255,255,255,0.3);
                                                                                                transform: scale(1.1);
                                                                                            }
                                                                                            
                                                                                            @media (max-width: 768px) {
                                                                                                body {
                                                                                                    padding: 10px;
                                                                                                }
                                                                                                
                                                                                                .container {
                                                                                                    border-radius: 15px;
                                                                                                }
                                                                                                
                                                                                                .header {
                                                                                                    padding: 20px 15px;
                                                                                                }
                                                                                                
                                                                                                .header h1 {
                                                                                                    font-size: 1.3rem;
                                                                                                }
                                                                                                
                                                                                                .content {
                                                                                                    padding: 20px 15px;
                                                                                                }
                                                                                                
                                                                                                .info-item {
                                                                                                    padding: 14px 18px;
                                                                                                }
                                                                                                
                                                                                                .close-btn {
                                                                                                    top: 15px;
                                                                                                    right: 15px;
                                                                                                    width: 35px;
                                                                                                    height: 35px;
                                                                                                }
                                                                                            }
                                                                                            
                                                                                            @media (max-width: 480px) {
                                                                                                .header h1 {
                                                                                                    font-size: 1.1rem;
                                                                                                }
                                                                                                
                                                                                                .content {
                                                                                                    padding: 15px 10px;
                                                                                                }
                                                                                                
                                                                                                .image-container {
                                                                                                    padding: 15px;
                                                                                                }
                                                                                                
                                                                                                .item-info {
                                                                                                    padding: 20px;
                                                                                                }
                                                                                                

                                                                                            }
                                                                                        </style>
                                                                                    </head>
                                                                                    <body>
                                                                                        <button class="close-btn" onclick="window.close()">×</button>
                                                                                        <div class="container">
                                                                                            <div class="header">
                                                                                                <h1>${item.name || 'Unknown Item'}</h1>
                                                                                                <div class="subtitle">Item Details & Image</div>
                                                                                            </div>
                                                                                            
                                                                                            <div class="content">
                                                                                                <div class="image-section">
                                                                                                    <div class="image-container">
                                                                                                        <img src="${image.url}" alt="${image.name}" class="image-display" />
                                                                                                    </div>
                                                                                                </div>
                                                                                                
                                                                                                <div class="item-info">
                                                                                                    ${item.name ? `
                                                                                                    <div class="info-item">
                                                                                                        <div class="info-label">Item Name</div>
                                                                                                        <div class="info-value">${item.name}</div>
                                                                                                    </div>
                                                                                                    ` : ''}
                                                                                                    
                                                                                                    ${item.description ? `
                                                                                                    <div class="info-item">
                                                                                                        <div class="info-label">Description</div>
                                                                                                        <div class="info-value">${item.description}</div>
                                                                                                    </div>
                                                                                                    ` : ''}
                                                                                                    
                                                                                                    ${item.leadTime ? `
                                                                                                    <div class="info-item">
                                                                                                        <div class="info-label">Lead Time</div>
                                                                                                        <div class="info-value">${item.leadTime}</div>
                                                                                                    </div>
                                                                                                    ` : ''}
                                                                                                    
                                                                                                    ${item.price ? `
                                                                                                    <div class="info-item">
                                                                                                        <div class="info-label">Price</div>
                                                                                                        <div class="info-value">${item.price} ${quotation.currency || 'USD'}</div>
                                                                                                    </div>
                                                                                                    ` : ''}
                                                                                                    
                                                                                                    ${item.quantity ? `
                                                                                                    <div class="info-item">
                                                                                                        <div class="info-label">Quantity</div>
                                                                                                        <div class="info-value">${item.quantity}</div>
                                                                                                    </div>
                                                                                                    ` : ''}
                                                                                                    
                                                                                                    ${item.total ? `
                                                                                                    <div class="info-item">
                                                                                                        <div class="info-label">Total</div>
                                                                                                        <div class="info-value">${item.total} ${quotation.currency || 'USD'}</div>
                                                                                                    </div>
                                                                                                    ` : ''}
                                                                                                </div>
                                                                                                
                                                                                                <div class="metadata">
                                                                                                    <strong>Image:</strong> ${image.name} | 
                                                                                                    <strong>Quotation ID:</strong> ${quotation.customId || quotation.id} | 
                                                                                                    <strong>Generated:</strong> ${new Date().toLocaleString()}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        
                                                                                        <script>
                                                                                            // Add smooth animations
                                                                                            document.addEventListener('DOMContentLoaded', function() {
                                                                                                const container = document.querySelector('.container');
                                                                                                container.style.opacity = '0';
                                                                                                container.style.transform = 'translateY(20px)';
                                                                                                
                                                                                                setTimeout(() => {
                                                                                                    container.style.transition = 'all 0.6s ease';
                                                                                                    container.style.opacity = '1';
                                                                                                    container.style.transform = 'translateY(0)';
                                                                                                }, 100);
                                                                                            });
                                                                                            
                                                                                            // Add keyboard support
                                                                                            document.addEventListener('keydown', function(e) {
                                                                                                if (e.key === 'Escape') {
                                                                                                    window.close();
                                                                                                }
                                                                                            });
                                                                                        </script>
                                                                                    </body>
                                                                                    </html>
                                                                                `);
                                                                                newWindow.document.close();
                                                                            }
                                                                        }
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div style={{ 
                                                                    width: '50px', 
                                                                    height: '50px',
                                                                    border: '1px solid #E0E0E0',
                                                                    borderRadius: '4px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    background: '#F8F9FA',
                                                                    color: '#6C757D',
                                                                    fontSize: '10px',
                                                                    textAlign: 'center'
                                                                }}>
                                                                    {isGeneratingQR ? (
                                                                        <div style={{ 
                                                                            width: '16px', 
                                                                            height: '16px', 
                                                                            border: '2px solid #E0E0E0', 
                                                                            borderTop: '2px solid #7C5DFA', 
                                                                            borderRadius: '50%', 
                                                                            animation: `${spin} 1s linear infinite` 
                                                                        }} />
                                                                    ) : (
                                                                        'QR Code'
                                                                    )}
                                                                </div>
                                                            )}
                                                            <div style={{ 
                                                                fontSize: '10px', 
                                                                color: '#888EB0', 
                                                                textAlign: 'center',
                                                                maxWidth: '50px'
                                                            }}>
                                                                {image.name.length > 10 ? 
                                                                    `${image.name.substring(0, 10)}...` : 
                                                                    image.name
                                                                }
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div style={{ 
                                                    fontSize: '11px', 
                                                    color: '#888EB0', 
                                                    fontStyle: 'italic' 
                                                }}>
                                                    Click QR codes or scan to view full images
                                                </div>
                                            </div>
                                        ) : item.imageUrl ? (
                                            // Backward compatibility for single image
                                            <div style={{ 
                                                display: 'flex', 
                                                flexDirection: 'column', 
                                                alignItems: 'center', 
                                                gap: '4px', 
                                                marginTop: '8px' 
                                            }}>
                                                {qrCodes[item.name] ? (
                                                    <img 
                                                        src={qrCodes[item.name]} 
                                                        alt="QR Code" 
                                                        style={{ 
                                                            width: '50px', 
                                                            height: '50px',
                                                            border: '1px solid #E0E0E0',
                                                            borderRadius: '4px'
                                                        }}
                                                        title="Scan QR to view image"
                                                    />
                                                ) : (
                                                    <div style={{ 
                                                        width: '50px', 
                                                        height: '50px',
                                                        border: '1px solid #E0E0E0',
                                                        borderRadius: '4px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        background: '#F8F9FA',
                                                        color: '#6C757D',
                                                        fontSize: '10px'
                                                    }}>
                                                        {isGeneratingQR ? (
                                                            <div style={{ 
                                                                width: '16px', 
                                                                height: '16px', 
                                                                border: '2px solid #E0E0E0', 
                                                                borderTop: '2px solid #7C5DFA', 
                                                                borderRadius: '50%', 
                                                                animation: `${spin} 1s linear infinite` 
                                                            }} />
                                                        ) : (
                                                            'Generating...'
                                                        )}
                                                    </div>
                                                )}
                                                <div style={{ 
                                                    fontSize: '11px', 
                                                    color: '#888EB0', 
                                                    fontStyle: 'italic' 
                                                }}>
                                                    Scan QR to view image
                                                </div>
                                            </div>
                                        ) : null}
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>{item.quantity || 0}</td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>{formatPrice(item.price || 0, dataToDisplay.currency)}</td>
                                    {dataToDisplay.items.some(i => i.vat) && (
                                        <td style={{ padding: '12px', textAlign: 'right' }}>{item.vat ? formatPrice(item.vat, dataToDisplay.currency) : '-'}</td>
                                    )}
                                    <td style={{ padding: '12px', textAlign: 'right' }}>{formatPrice(item.total || 0, dataToDisplay.currency)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </DetailsContainer>
    );
};

export default QuotationDetails; 