import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { useGlobalContext } from '../../contexts/GlobalContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { LoadingContainer, DetailsContainer, DetailsHeader, DetailsTitle, CloseButton, DetailsContent, DetailsSection, DetailsLabel, DetailsValue, StatusBadge, StatusDot } from '../../styles/QuotationDetailsStyles';
import { Icon } from '../../components/Icon';
import { formatDate, formatPrice } from '../../utils/formatters';

const QuotationDetails = ({ quotation, onClose }) => {
    const { colors } = useTheme();
    const { windowWidth } = useGlobalContext();
    const isDesktop = windowWidth >= 768;
    
    // State for direct Firebase data
    const [directData, setDirectData] = useState(null);
    const [loading, setLoading] = useState(false);
    
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