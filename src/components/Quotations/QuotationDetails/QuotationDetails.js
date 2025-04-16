import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { useGlobalContext } from '../../contexts/GlobalContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
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
        </DetailsContainer>
    );
};

export default QuotationDetails; 