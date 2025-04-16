import { useEffect, useState, useRef } from 'react';
import { useParams, Redirect, useHistory, Link } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { useReducedMotion } from 'framer-motion';
import Icon from '../shared/Icon/Icon';
import Status from '../shared/Status/Status';
import Button from '../shared/Button/Button';
import { formatDate, formatPrice, formatCurrency } from '../../utilities/helpers';
import { useGlobalContext } from '../App/context';
import './PurchaseOrderView.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
    StyledPurchaseOrderView,
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
} from './PurchaseOrderViewStyles';
import { doc, getDoc, collection, query, where, getDocs, deleteDoc, addDoc, updateDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { generateEmailTemplate } from '../../services/emailService';
import EmailPreviewModal from '../shared/EmailPreviewModal/EmailPreviewModal';
import { format } from 'date-fns';
import { message } from 'antd';
import styled from 'styled-components';

const PurchaseOrderView = () => {
    const { purchaseOrderState, togglePurchaseOrderModal, editPurchaseOrder, windowWidth, refreshPurchaseOrders } = useGlobalContext();
    const { colors } = useTheme();
    const { id } = useParams();
    const [purchaseOrder, setPurchaseOrder] = useState(null);
    const [clientData, setClientData] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDirectlyFetching, setIsDirectlyFetching] = useState(false);
    const [isClientFetching, setIsClientFetching] = useState(false);
    const [clientHasVAT, setClientHasVAT] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [emailData, setEmailData] = useState(null);
    const [pdfData, setPdfData] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const purchaseOrderNotFound = !isLoading && !purchaseOrder;
    const isPending = purchaseOrder?.status === 'pending';
    const isDraft = purchaseOrder?.status === 'draft';
    const isApproved = purchaseOrder?.status === 'approved';
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
            ? purchaseOrderViewVariants.reduced
            : purchaseOrderViewVariants[element];
    };

    // Set document title
    useEffect(() => {
        document.title = `Purchase Order | ${purchaseOrder?.customId || id}`;
    }, [purchaseOrder, id]);

    // Update loading state when other loading states change
    useEffect(() => {
        const isCurrentlyLoading = purchaseOrderState?.isLoading || 
                                 isDirectlyFetching || 
                                 isClientFetching;
        setIsLoading(isCurrentlyLoading);
    }, [purchaseOrderState?.isLoading, isDirectlyFetching, isClientFetching]);

    // Add subscription to purchase order changes
    useEffect(() => {
        let unsubscribe;
        
        const subscribeToPurchaseOrder = async () => {
            if (!id) return;
            
            const purchaseOrderRef = doc(db, 'purchaseOrders', id);
            unsubscribe = onSnapshot(purchaseOrderRef, async (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    
                    // Convert Firestore Timestamp to Date
                    const createdAt = data.createdAt?.toDate() || new Date();
                    const paymentDue = data.paymentDue?.toDate() || new Date();
                    
                    setPurchaseOrder({
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
                }
            });
        };

        subscribeToPurchaseOrder();
        return () => unsubscribe && unsubscribe();
    }, [id]);

    const handleEdit = () => {
        editPurchaseOrder(purchaseOrder);
        togglePurchaseOrderModal();
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteDoc(doc(db, 'purchaseOrders', id));
            message.success('Purchase order deleted successfully');
            refreshPurchaseOrders();
            history.push('/purchase-orders');
        } catch (error) {
            console.error('Error deleting purchase order:', error);
            message.error('Failed to delete purchase order');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            // Get the client's country from the purchase order or client data
            const clientCountry = purchaseOrder?.clientAddress?.country || 
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
                overflow: visible;
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
                    <h1 style="font-size: 32px; color: #004359; margin: 0; letter-spacing: 1px;">PURCHASE ORDER</h1>
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
            console.log('PDF Generation - Client TRN:', clientData?.trn || clientData?.trnNumber || purchaseOrder?.clientTRN);

            clientSection.innerHTML = `
                <div style="flex: 1;">
                    <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Bill To</div>
                    <div style="color: black; font-size: 16px;">
                        <strong>${purchaseOrder.clientName}</strong><br />
                        ${clientData?.address || purchaseOrder.clientAddress?.street || ''}
                        ${purchaseOrder.clientAddress?.city ? `, ${purchaseOrder.clientAddress.city}` : ''}
                        ${purchaseOrder.clientAddress?.postCode ? `, ${purchaseOrder.clientAddress.postCode}` : ''}
                        ${clientData?.country || purchaseOrder.clientAddress?.country ? `, ${clientData?.country || purchaseOrder.clientAddress?.country}` : ''}
                        ${clientData?.phone ? `<br />${clientData.phone}` : ''}
                        ${(clientCountry.toLowerCase().includes('emirates') || clientCountry.toLowerCase().includes('uae')) && (clientData?.trn || clientData?.trnNumber || purchaseOrder?.clientTRN) ? 
                            `<br /><span style="font-weight: 600;">TRN: ${clientData?.trn || clientData?.trnNumber || purchaseOrder?.clientTRN}</span>` : ''}
                    </div>
                </div>
                <div style="display: flex; gap: 40px;">
                    <div style="text-align: right;">
                        <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Purchase Order #</div>
                        <div style="color: black; font-size: 16px; margin-bottom: 15px;">${purchaseOrder.customId || id}</div>
                        <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Due Date</div>
                        <div style="color: black; font-size: 16px;">${formatDate(purchaseOrder.paymentDue)}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Created Date</div>
                        <div style="color: black; font-size: 16px; margin-bottom: 15px;">${formatDate(purchaseOrder.createdAt)}</div>
                        ${purchaseOrder.lpoNumber ? `
                            <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">LPO Number</div>
                            <div style="color: black; font-size: 16px;">${purchaseOrder.lpoNumber}</div>
                        ` : ''}
                    </div>
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
                page-break-inside: auto;
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
                    ${purchaseOrder.items.map(item => {
                        const itemVAT = item.vat || 0;
                        return `
                            <tr style="border-bottom: 1px solid #e0e0e0;">
                                <td style="padding: 15px; color: black; font-size: 16px;">
                                    ${item.name}
                                    ${item.description ? `<div style="font-size: 14px; color: #666;">${item.description}</div>` : ''}
                                </td>
                                <td style="padding: 15px; text-align: center; color: black; font-size: 16px;">${item.quantity || 0}</td>
                                <td style="padding: 15px; text-align: right; color: black; font-size: 16px;">${formatPrice(item.price || 0, purchaseOrder.currency)}</td>
                                ${clientHasVAT ? `<td style="padding: 15px; text-align: right; color: black; font-size: 16px;">${formatPrice(itemVAT, purchaseOrder.currency)}</td>` : ''}
                                <td style="padding: 15px; text-align: right; color: black; font-size: 16px;">${formatPrice(item.total || 0, purchaseOrder.currency)}</td>
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
                margin-bottom: 20px;
                page-break-inside: avoid;
            `;
            totalSection.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; opacity: 0.9;">
                        <span style="font-size: 14px;">Subtotal:</span>
                        <span style="font-size: 14px;">${formatPrice(purchaseOrder.subtotal || 0, purchaseOrder.currency)}</span>
                    </div>
                    ${clientHasVAT ? `
                        <div style="display: flex; justify-content: space-between; align-items: center; opacity: 0.9;">
                            <span style="font-size: 14px;">VAT (5%):</span>
                            <span style="font-size: 14px;">${formatPrice(purchaseOrder.totalVat || 0, purchaseOrder.currency)}</span>
                        </div>
                    ` : ''}
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                        <span style="font-size: 16px;">Total:</span>
                        <span style="font-size: 20px; font-weight: bold;">${formatPrice(purchaseOrder.total || 0, purchaseOrder.currency)}</span>
                    </div>
                </div>
            `;
            pdfContainer.appendChild(totalSection);

            // Add spacer for signature section
            const spacer = document.createElement('div');
            spacer.style.height = '50px';
            pdfContainer.appendChild(spacer);

            // Add signature section
            const signatureSection = document.createElement('div');
            signatureSection.style.cssText = `
                display: flex;
                justify-content: space-between;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            `;
            signatureSection.innerHTML = `
                <div style="text-align: center;">
                    <div style="margin-bottom: 10px; font-weight: bold;">Authorized Signature</div>
                    <div style="height: 50px; border-bottom: 1px solid #000;"></div>
                    <div style="margin-top: 5px;">Date: ${formatDate(new Date())}</div>
                </div>
            `;
            pdfContainer.appendChild(signatureSection);

            // Add footer
            const footer = document.createElement('div');
            footer.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
            `;
            footer.innerHTML = `
                <div>Thank you for your business!</div>
                <div style="margin-top: 5px;">This is a computer-generated document. No signature is required.</div>
            `;
            pdfContainer.appendChild(footer);

            // Convert to PDF
            const canvas = await html2canvas(pdfContainer, {
                scale: 2,
                useCORS: true,
                logging: false,
                allowTaint: true
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`Purchase-Order-${purchaseOrder.customId || id}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            message.error('Failed to generate PDF');
        }
    };

    const handleSendEmail = async () => {
        try {
            setIsSending(true);
            const emailTemplate = generateEmailTemplate(purchaseOrder, clientData);
            setEmailData({
                to: clientData?.email || purchaseOrder.clientEmail,
                subject: `Purchase Order ${purchaseOrder.customId || id}`,
                body: emailTemplate
            });
            setIsEmailModalOpen(true);
        } catch (error) {
            console.error('Error preparing email:', error);
            message.error('Failed to prepare email');
        } finally {
            setIsSending(false);
        }
    };

    if (purchaseOrderNotFound) {
        return <Redirect to="/purchase-orders" />;
    }

    return (
        <StyledPurchaseOrderView>
            <Container>
                <MotionLink
                    to="/purchase-orders"
                    variants={variant('link')}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    <Icon name="arrow-left" />
                    <Text>Go Back</Text>
                </MotionLink>

                <Controller
                    variants={variant('controller')}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <ButtonWrapper>
                        <Button onClick={handleDownloadPDF}>
                            <Icon name="download" size={16} />
                            Download PDF
                        </Button>
                        <Button onClick={handleSendEmail} disabled={isSending}>
                            <Icon name="mail" size={16} />
                            {isSending ? 'Sending...' : 'Send Email'}
                        </Button>
                        <Button onClick={handleEdit}>
                            <Icon name="edit" size={16} />
                            Edit
                        </Button>
                        <Button onClick={() => setShowDeleteModal(true)} danger>
                            <Icon name="trash" size={16} />
                            Delete
                        </Button>
                    </ButtonWrapper>
                </Controller>

                <InfoCard
                    variants={variant('info')}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <InfoHeader>
                        <InfoID>Purchase Order #{purchaseOrder?.customId || id}</InfoID>
                        <InfoDesc>{purchaseOrder?.description || 'No description provided'}</InfoDesc>
                    </InfoHeader>

                    <InfoGroup>
                        <InfoAddresses>
                            <AddressGroup>
                                <AddressTitle>Bill To</AddressTitle>
                                <AddressText>
                                    <strong>{purchaseOrder?.clientName}</strong><br />
                                    {clientData?.address || purchaseOrder?.clientAddress?.street || ''}
                                    {purchaseOrder?.clientAddress?.city ? `, ${purchaseOrder.clientAddress.city}` : ''}
                                    {purchaseOrder?.clientAddress?.postCode ? `, ${purchaseOrder.clientAddress.postCode}` : ''}
                                    {clientData?.country || purchaseOrder?.clientAddress?.country ? `, ${clientData?.country || purchaseOrder?.clientAddress?.country}` : ''}
                                    {clientData?.phone ? `<br />${clientData.phone}` : ''}
                                    {(clientData?.country?.toLowerCase().includes('emirates') || clientData?.country?.toLowerCase().includes('uae')) && (clientData?.trn || clientData?.trnNumber || purchaseOrder?.clientTRN) ? 
                                        `<br /><span style="font-weight: 600;">TRN: ${clientData?.trn || clientData?.trnNumber || purchaseOrder?.clientTRN}</span>` : ''}
                                </AddressText>
                            </AddressGroup>
                        </InfoAddresses>

                        <Details>
                            <MetaInfo>
                                <MetaItem>
                                    <span>Status</span>
                                    <StatusBadge>
                                        <Status status={purchaseOrder?.status} />
                                    </StatusBadge>
                                </MetaItem>
                                <MetaItem>
                                    <span>Created</span>
                                    <span>{formatDate(purchaseOrder?.createdAt)}</span>
                                </MetaItem>
                                <MetaItem>
                                    <span>Due Date</span>
                                    <span>{formatDate(purchaseOrder?.paymentDue)}</span>
                                </MetaItem>
                                {purchaseOrder?.lpoNumber && (
                                    <MetaItem>
                                        <span>LPO Number</span>
                                        <span>{purchaseOrder.lpoNumber}</span>
                                    </MetaItem>
                                )}
                            </MetaInfo>
                        </Details>
                    </InfoGroup>

                    <Items>
                        <ItemsHeader>
                            <HeaderCell>Item Name</HeaderCell>
                            <HeaderCell>QTY.</HeaderCell>
                            <HeaderCell>Price</HeaderCell>
                            {clientHasVAT && <HeaderCell>VAT (5%)</HeaderCell>}
                            <HeaderCell>Total</HeaderCell>
                        </ItemsHeader>

                        {purchaseOrder?.items?.map((item, index) => (
                            <Item key={index}>
                                <ItemName>
                                    {item.name}
                                    {item.description && <ItemDescription>{item.description}</ItemDescription>}
                                </ItemName>
                                <ItemQty>{item.quantity || 0}</ItemQty>
                                <ItemPrice>{formatPrice(item.price || 0, purchaseOrder.currency)}</ItemPrice>
                                {clientHasVAT && <ItemVat>{formatPrice(item.vat || 0, purchaseOrder.currency)}</ItemVat>}
                                <ItemTotal>{formatPrice(item.total || 0, purchaseOrder.currency)}</ItemTotal>
                            </Item>
                        ))}
                    </Items>

                    <Total>
                        <TotalText>Subtotal:</TotalText>
                        <TotalAmount>{formatPrice(purchaseOrder?.subtotal || 0, purchaseOrder?.currency)}</TotalAmount>
                    </Total>
                    {clientHasVAT && (
                        <Total>
                            <TotalText>VAT (5%):</TotalText>
                            <TotalAmount>{formatPrice(purchaseOrder?.totalVat || 0, purchaseOrder?.currency)}</TotalAmount>
                        </Total>
                    )}
                    <Total>
                        <TotalText>Total:</TotalText>
                        <TotalAmount>{formatPrice(purchaseOrder?.total || 0, purchaseOrder?.currency)}</TotalAmount>
                    </Total>

                    {purchaseOrder?.terms && (
                        <TermsSection>
                            <TermsTitle>Terms & Conditions</TermsTitle>
                            <TermsText>{purchaseOrder.terms}</TermsText>
                        </TermsSection>
                    )}
                </InfoCard>
            </Container>

            {showDeleteModal && (
                <ModalOverlay>
                    <ModalContent>
                        <ModalHeader>
                            <ModalIconWrapper>
                                <Icon name="trash" size={24} />
                            </ModalIconWrapper>
                            <ModalTitle>Delete Purchase Order</ModalTitle>
                        </ModalHeader>
                        <ModalText>
                            Are you sure you want to delete this purchase order? This action cannot be undone.
                        </ModalText>
                        <ModalActions>
                            <Button onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleDelete} danger loading={isDeleting}>
                                Delete
                            </Button>
                        </ModalActions>
                    </ModalContent>
                </ModalOverlay>
            )}

            {isEmailModalOpen && (
                <EmailPreviewModal
                    isOpen={isEmailModalOpen}
                    onClose={() => setIsEmailModalOpen(false)}
                    emailData={emailData}
                    documentType="purchase order"
                    documentId={purchaseOrder?.customId || id}
                />
            )}
        </StyledPurchaseOrderView>
    );
};

export default PurchaseOrderView; 