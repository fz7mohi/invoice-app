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
    const { theme } = useGlobalContext();
    const [error, setError] = useState(null);
    
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
            const element = document.getElementById('delivery-order-content');
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`delivery-order-${deliveryOrder.customId}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
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
                        <InfoSectionValue>{deliveryOrder.invoiceCustomId || deliveryOrder.invoiceId || 'N/A'}</InfoSectionValue>
                    </InfoSectionItem>
                    <InfoSectionItem>
                        <InfoSectionLabel>Created Date</InfoSectionLabel>
                        <InfoSectionValue>{formatDate(deliveryOrder.createdAt)}</InfoSectionValue>
                    </InfoSectionItem>
                    <InfoSectionItem>
                        <InfoSectionLabel>Updated Date</InfoSectionLabel>
                        <InfoSectionValue>{formatDate(deliveryOrder.updatedAt)}</InfoSectionValue>
                    </InfoSectionItem>
                    <InfoSectionItem>
                        <InfoSectionLabel>Status</InfoSectionLabel>
                        <InfoSectionValue>
                            <StatusBadge $status={deliveryOrder.status}>
                                <StatusDot $status={deliveryOrder.status} />
                                {deliveryOrder.status.charAt(0).toUpperCase() + deliveryOrder.status.slice(1)}
                            </StatusBadge>
                        </InfoSectionValue>
                    </InfoSectionItem>
                </InfoSectionGrid>
            </InfoSection>
        );
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
                        <DownloadButton onClick={handleDownloadPDF}>
                            <Icon name="download" size={16} />
                            Download PDF
                        </DownloadButton>
                        <Button
                            onClick={() => history.push(`/delivery-orders/${id}/edit`)}
                            variant="secondary"
                        >
                            <Icon name="edit" size={16} />
                            Edit
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
                        
                        <AddressGroup align="right">
                            <AddressTitle>Delivery Order #</AddressTitle>
                            <AddressText>
                                {deliveryOrder.customId}
                            </AddressText>
                            <br />
                            <AddressTitle>Invoice #</AddressTitle>
                            <AddressText>
                                {deliveryOrder.invoiceCustomId || deliveryOrder.invoiceId || 'N/A'}
                            </AddressText>
                        </AddressGroup>
                    </InfoAddresses>
                    
                    <SectionDivider />
                    
                    {renderDeliveryInfo()}
                    
                    <SectionDivider />
                    
                    <Details className="Details">
                        {renderPackagingDetails()}
                    </Details>
                </InfoCard>
            </Container>
        </StyledDeliveryOrderView>
    );
};

export default DeliveryOrderView; 