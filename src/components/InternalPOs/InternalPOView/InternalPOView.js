import React, { useState, useEffect } from 'react';
import { useParams, useHistory, Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, getDoc, updateDoc, collection, getDocs, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useGlobalContext } from '../../App/context';
import { formatDate, formatPrice, calculateVAT, generateCustomId } from '../../../utilities/helpers';
import Modal from '../../Modal/Modal';
import Icon from '../../shared/Icon/Icon';
import { useTheme } from 'styled-components';
import EmailPreviewModal from '../../shared/EmailPreviewModal/EmailPreviewModal';
import Button from '../../shared/Button/Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Container,
    StyledInternalPOView,
    Controller,
    Text,
    StatusContainer,
    StatusBadge,
    StatusDot,
    ActionButtons,
    InfoCard,
    InfoHeader,
    InfoGroup,
    InfoID,
    InfoDesc,
    InfoAddresses,
    AddressGroup,
    AddressTitle,
    AddressText,
    Details,
    ItemsSection,
    SupplierSection,
    SupplierGrid,
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
    SupplierHeader,
    SupplierTitle,
    SupplierItem,
    SupplierName,
    SupplierDetails,
    SupplierRow,
    SupplierLabel,
    SupplierValue,
    SupplierTotal,
    Total,
    TotalText,
    TotalAmount,
    MetaInfo,
    MetaItem,
    ButtonWrapper,
    PaymentDetailsSection,
    PaymentDetailsHeader,
    PaymentDetailsTitle,
    PaymentDetailsGrid,
    PaymentDetailItem,
    PaymentDetailLabel,
    PaymentDetailValue,
    CreateReceiptButton,
    ReceiptTimeline,
    ReceiptTimelineTitle,
    ReceiptItem,
    ReceiptInfo,
    ReceiptNumber,
    ReceiptDetails,
    ReceiptAmount,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalIconWrapper,
    ModalTitle,
    ModalText,
    FormGroup,
    FormLabel,
    FormInput,
    FormTextArea,
    ModalActions,
    PaymentModalContent,
    PaymentForm,
    FormRow,
    PaymentFormLabel,
    Link,
    BankDetailsSection,
    BankDetailsTitle,
    BankDetailsGrid,
    BankDetailItem,
    BankDetailLabel,
    BankDetailValue,
    HeaderSection,
    HeaderTitle,
    DownloadButton,
    InfoSectionsGrid,
    TermsSection,
    TermsHeader,
    TermsTitle,
    TermsActions,
    SupplierEditModal,
    SupplierEditForm,
    SupplierFormSection,
    SupplierFormTitle,
    SupplierFormRow,
    SupplierFormLabel,
    SupplierFormInput,
    SupplierFormActions,
    CostBreakdown,
    CostItem,
    CostLabel,
    CostValue,
    FormSection,
    ButtonGroup,
    ImageUploadContainer,
    ImagePreview,
    RemoveImageButton,
    ImageUploadPlaceholder,
    ImageUploadHint
} from './InternalPOViewStyles';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase/firebase';

const defaultTermsAndConditions = `1. Payment is due within 30 days
2. Please include invoice number on payment
3. Bank transfer is preferred method of payment`;

const InternalPOView = () => {
    const { id } = useParams();
    const history = useHistory();
    const theme = useTheme();
    const { colors, windowWidth, showNotification } = useGlobalContext();
    const [internalPO, setInternalPO] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showVoidModal, setShowVoidModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [receipts, setReceipts] = useState([]);
    const [companyProfile, setCompanyProfile] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [newTerms, setNewTerms] = useState('');
    const [quotationData, setQuotationData] = useState(null);
    const [isFetchingQuotation, setIsFetchingQuotation] = useState(false);
    const [isEditingTerms, setIsEditingTerms] = useState(false);
    const [editedTerms, setEditedTerms] = useState('');
    const [isEditingDueDate, setIsEditingDueDate] = useState(false);
    const [editedDueDate, setEditedDueDate] = useState('');
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [emailData, setEmailData] = useState(null);
    const [pdfData, setPdfData] = useState(null);
    const [voidReason, setVoidReason] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDirectlyFetching, setIsDirectlyFetching] = useState(false);
    const [clientData, setClientData] = useState(null);
    const [clientHasVAT, setClientHasVAT] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [supplierFormData, setSupplierFormData] = useState({
        supplierName: '',
        orderQuantity: '',
        unitCost: '',
        printingCost: '',
        shippingCost: '',
        image: null
    });
    const isDesktop = windowWidth >= 768;
    const [showShippingModal, setShowShippingModal] = useState(false);
    const [additionalShippingCost, setAdditionalShippingCost] = useState('');
    const [showPrintingModal, setShowPrintingModal] = useState(false);
    const [additionalPrintingCost, setAdditionalPrintingCost] = useState('');
    const [showDeliveryDateModal, setShowDeliveryDateModal] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchClientData = async (clientId, fallbackName) => {
        if (!clientId) return;

        try {
            const clientDoc = await getDoc(doc(db, 'clients', clientId));
            if (clientDoc.exists()) {
                const data = clientDoc.data();
                setClientData(data);
                const isUAE = data.country?.toLowerCase().includes('emirates') || 
                             data.country?.toLowerCase().includes('uae');
                setClientHasVAT(isUAE || data.hasVAT || false);
                return;
            }

            // If no direct match, try searching by name
            const clientsRef = collection(db, 'clients');
            const q = query(clientsRef, where('name', '>=', fallbackName), where('name', '<=', fallbackName + '\uf8ff'));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const data = querySnapshot.docs[0].data();
                setClientData(data);
                const isUAE = data.country?.toLowerCase().includes('emirates') || 
                             data.country?.toLowerCase().includes('uae');
                setClientHasVAT(isUAE || data.hasVAT || false);
            }
        } catch (err) {
            console.error('Error fetching client data:', err);
        }
    };

    useEffect(() => {
        const fetchInternalPOData = async () => {
            try {
                setLoading(true);
                setError(null);
                const internalPODoc = await getDoc(doc(db, 'internalPOs', id));
                
                if (!internalPODoc.exists()) {
                    setError('Internal PO not found');
                    setLoading(false);
                    return;
                }

                const data = internalPODoc.data();
                setInternalPO({
                    id: internalPODoc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate(),
                    paymentDue: data.paymentDue?.toDate()
                });

                // Fetch invoice data if available
                if (data.invoiceId) {
                    const invoiceDoc = await getDoc(doc(db, 'invoices', data.invoiceId));
                    if (invoiceDoc.exists()) {
                        const invoiceData = invoiceDoc.data();
                        setInvoiceData({
                            ...invoiceData,
                            id: invoiceDoc.id,
                            createdAt: invoiceData.createdAt?.toDate(),
                            paymentDue: invoiceData.paymentDue?.toDate()
                        });
                    }
                }

                // Fetch client data if available
                if (data.clientId) {
                    await fetchClientData(data.clientId, data.clientName);
                }

                // Fetch related receipts
                const receiptsQuery = query(
                    collection(db, 'receipts'),
                    where('internalPOId', '==', id)
                );
                const receiptsSnapshot = await getDocs(receiptsQuery);
                const receiptsData = receiptsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setReceipts(receiptsData);

                // Fetch company profile
                const companyProfileDoc = await getDoc(doc(db, 'companyProfile', 'default'));
                if (companyProfileDoc.exists()) {
                    setCompanyProfile(companyProfileDoc.data());
                }

                // Fix net profit calculation immediately after loading data
                await fixNetProfitCalculation(data);

            } catch (err) {
                console.error('Error fetching internal PO:', err);
                setError('Failed to load internal PO');
            } finally {
                setLoading(false);
            }
        };

        fetchInternalPOData();
    }, [id]);

    const fixNetProfitCalculation = async (data) => {
        try {
            // Calculate net total cost
            const netTotalCost = data.items?.reduce((sum, item) => {
                const orderQty = item.orderQuantity || item.quantity || 0;
                const unitCost = item.unitCost || item.price || 0;
                const printingCost = item.printingCost || 0;
                const shippingCost = item.shippingCost || 0;
                return sum + (orderQty * (unitCost + printingCost + shippingCost));
            }, 0) + (data.additionalShippingCost || 0) + (data.additionalPrintingCost || 0);

            // Calculate grand total
            const subtotal = data.items?.reduce((sum, item) => {
                return sum + (item.price * item.quantity);
            }, 0) || 0;

            const vatAmount = clientHasVAT ? subtotal * 0.05 : 0;
            const grandTotal = subtotal + vatAmount;

            // Calculate correct net profit
            const correctNetProfit = Number((grandTotal - netTotalCost).toFixed(2));

            // Update database if net profit is different
            if (data.netProfit !== correctNetProfit) {
                console.log('Fixing net profit from', data.netProfit, 'to', correctNetProfit);
                await updateDoc(doc(db, 'internalPOs', id), {
                    netProfit: correctNetProfit,
                    updatedAt: new Date()
                });

                // Update local state
                setInternalPO(prev => ({
                    ...prev,
                    netProfit: correctNetProfit,
                    updatedAt: new Date()
                }));

                toast.success('Net profit calculation has been fixed');
            }
        } catch (err) {
            console.error('Error fixing net profit:', err);
            toast.error('Failed to fix net profit calculation');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, 'internalPOs', id));
            showNotification('Internal PO deleted successfully', 'success');
            history.push('/internal-pos');
        } catch (err) {
            console.error('Error deleting internal PO:', err);
            showNotification('Failed to delete internal PO', 'error');
        }
    };

    const handleVoid = async () => {
        try {
            await updateDoc(doc(db, 'internalPOs', id), {
                status: 'void',
                voidedAt: new Date().toISOString()
            });
            setInternalPO(prev => ({
                ...prev,
                status: 'void',
                voidedAt: new Date().toISOString()
            }));
            showNotification('Internal PO voided successfully', 'success');
            setShowVoidModal(false);
        } catch (err) {
            console.error('Error voiding internal PO:', err);
            showNotification('Failed to void internal PO', 'error');
        }
    };

    const handlePaymentUpdate = async (amount) => {
        try {
            const newAmount = parseFloat(amount);
            const currentPaid = internalPO.paid || 0;
            const totalPaid = currentPaid + newAmount;
            const status = totalPaid >= internalPO.total ? 'paid' : 'partially_paid';
            const netProfit = calculateNetProfit();

            await updateDoc(doc(db, 'internalPOs', id), {
                paid: totalPaid,
                status,
                netProfit,
                updatedAt: new Date()
            });

            setInternalPO(prev => ({
                ...prev,
                paid: totalPaid,
                status,
                netProfit,
                updatedAt: new Date()
            }));
            setShowPaymentModal(false);
            setPaymentAmount('');
        } catch (err) {
            console.error('Error updating payment:', err);
            showNotification('Failed to update payment', 'error');
        }
    };

    const handleEditTerms = async (terms) => {
        try {
            const netProfit = calculateNetProfit();
            await updateDoc(doc(db, 'internalPOs', id), {
                terms,
                netProfit,
                updatedAt: new Date()
            });
            setInternalPO(prev => ({ 
                ...prev, 
                terms,
                netProfit,
                updatedAt: new Date()
            }));
            setShowEditModal(false);
            setNewTerms('');
        } catch (err) {
            console.error('Error updating terms:', err);
            showNotification('Failed to update terms', 'error');
        }
    };

    const handleCreateReceipt = async () => {
        try {
            const receiptData = {
                internalPOId: id,
                amount: internalPO.total - (internalPO.paid || 0),
                date: new Date(),
                status: 'pending'
            };

            await addDoc(collection(db, 'receipts'), receiptData);
            history.push(`/receipts/new?internalPOId=${id}`);
        } catch (err) {
            console.error('Error creating receipt:', err);
            showNotification('Failed to create receipt', 'error');
        }
    };

    const fetchQuotationData = async (quotationId) => {
        if (!quotationId) return;
        
        setIsFetchingQuotation(true);
        try {
            const quotationDoc = await getDoc(doc(db, 'quotations', quotationId));
            if (quotationDoc.exists()) {
                setQuotationData({
                    ...quotationDoc.data(),
                    id: quotationDoc.id
                });
            }
        } catch (err) {
            console.error('Error fetching quotation:', err);
        } finally {
            setIsFetchingQuotation(false);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            // Implementation for PDF generation and download
            // This would be similar to InvoiceView's implementation
        } catch (err) {
            console.error('Error generating PDF:', err);
        }
    };

    const handleSendEmail = async () => {
        try {
            // Generate PDF data
            const pdfContent = await generatePDF();
            setPdfData({
                content: pdfContent,
                name: `internal_po_${internalPO.customId}.pdf`
            });

            // Prepare email data
            setEmailData({
                to: internalPO.clientEmail,
                subject: `Internal PO #${internalPO.customId}`,
                body: `Dear ${internalPO.clientName},\n\nPlease find attached the Internal PO #${internalPO.customId}.`
            });

            setIsEmailModalOpen(true);
        } catch (err) {
            console.error('Error preparing email:', err);
        }
    };

    const handleEmailSent = async () => {
        try {
            // Update internal PO status or add email log
            await updateDoc(doc(db, 'internalPOs', id), {
                lastEmailSent: new Date()
            });
            setIsEmailModalOpen(false);
        } catch (err) {
            console.error('Error updating email status:', err);
        }
    };

    const renderBankDetails = () => {
        if (!companyProfile?.bankDetails) return null;

        return (
            <BankDetailsSection>
                <BankDetailsTitle>Bank Details</BankDetailsTitle>
                <BankDetailsGrid>
                    <BankDetailItem>
                        <BankDetailLabel>Bank Name</BankDetailLabel>
                        <BankDetailValue>{companyProfile.bankDetails.bankName}</BankDetailValue>
                    </BankDetailItem>
                    <BankDetailItem>
                        <BankDetailLabel>Account Name</BankDetailLabel>
                        <BankDetailValue>{companyProfile.bankDetails.accountName}</BankDetailValue>
                    </BankDetailItem>
                    <BankDetailItem>
                        <BankDetailLabel>Account Number</BankDetailLabel>
                        <BankDetailValue>{companyProfile.bankDetails.accountNumber}</BankDetailValue>
                    </BankDetailItem>
                    <BankDetailItem>
                        <BankDetailLabel>Sort Code</BankDetailLabel>
                        <BankDetailValue>{companyProfile.bankDetails.sortCode}</BankDetailValue>
                    </BankDetailItem>
                </BankDetailsGrid>
            </BankDetailsSection>
        );
    };

    const variant = (key) => {
        const variants = {
            link: {
                hidden: { x: -20, opacity: 0 },
                visible: { x: 0, opacity: 1 },
                exit: { x: -20, opacity: 0 }
            },
            controller: {
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 },
                exit: { y: 20, opacity: 0 }
            }
        };

        return variants[key];
    };

    const calculateTotals = () => {
        if (!internalPO?.items) {
            return {
                subtotal: 0,
                vatAmount: 0,
                grandTotal: 0
            };
        }

        const subtotal = internalPO.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // Only apply VAT if client's country is United Arab Emirates
        const isUAE = clientData?.country?.toLowerCase().includes('emirates') || 
                     clientData?.country?.toLowerCase().includes('uae');
        const vatAmount = isUAE ? subtotal * 0.05 : 0; // 5% VAT only for UAE
        const grandTotal = subtotal + vatAmount;

        return {
            subtotal,
            vatAmount,
            grandTotal
        };
    };

    const calculateNetProfit = () => {
        if (!internalPO?.items) return 0;

        // Calculate total cost (including all costs)
        const netTotalCost = internalPO.items.reduce((sum, item) => {
            const orderQty = item.orderQuantity || item.quantity || 0;
            const unitCost = item.unitCost || item.price || 0;
            const printingCost = item.printingCost || 0;
            const shippingCost = item.shippingCost || 0;
            return sum + (orderQty * (unitCost + printingCost + shippingCost));
        }, 0) + (internalPO.additionalShippingCost || 0) + (internalPO.additionalPrintingCost || 0);

        // Get subtotal and VAT from calculateTotals
        const { subtotal, vatAmount } = calculateTotals();
        const grandTotal = subtotal + (vatAmount || 0);

        // Calculate net profit
        return Number((grandTotal - netTotalCost).toFixed(2));
    };

    const updateNetProfit = async () => {
        try {
            const netProfit = calculateNetProfit();
            console.log('Updating net profit to:', netProfit); // Debug log

            // First update local state to ensure UI reflects changes immediately
            setInternalPO(prev => ({
                ...prev,
                netProfit,
                updatedAt: new Date()
            }));

            // Then update the database
            await updateDoc(doc(db, 'internalPOs', id), {
                netProfit,
                updatedAt: new Date()
            });

            toast.success('Net profit updated successfully');
        } catch (err) {
            console.error('Error updating net profit:', err);
            toast.error('Failed to update net profit');
        }
    };

    const handleShippingCostSubmit = async (e) => {
        e.preventDefault();
        try {
            const additionalShippingCostValue = parseFloat(additionalShippingCost) || 0;
            
            // First update shipping cost
            await updateDoc(doc(db, 'internalPOs', id), {
                additionalShippingCost: additionalShippingCostValue,
                updatedAt: new Date()
            });

            setInternalPO(prev => ({
                ...prev,
                additionalShippingCost: additionalShippingCostValue,
                updatedAt: new Date()
            }));

            // Then update net profit
            await updateNetProfit();
            
            setShowShippingModal(false);
            setAdditionalShippingCost('');
            toast.success('Additional shipping cost updated successfully');
        } catch (err) {
            console.error('Error updating shipping cost:', err);
            toast.error('Failed to update shipping cost');
        }
    };

    const handleSupplierClick = (item) => {
        setEditingSupplier({
            ...item,
            id: item.id || item.name // Use name as fallback ID if id doesn't exist
        });
        setSupplierFormData({
            supplierName: item.supplierName || '',
            orderQuantity: item.orderQuantity || item.quantity || '',
            unitCost: item.unitCost || item.price || '',
            printingCost: item.printingCost || '',
            shippingCost: item.shippingCost || '',
            image: null, // Always set to null initially
            imageUrl: item.imageUrl || null,
            shouldRemoveImage: false
        });
    };

    const handleSupplierFormChange = (e) => {
        const { name, value } = e.target;
        setSupplierFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateSupplierTotal = () => {
        const orderQty = parseFloat(supplierFormData.orderQuantity) || 0;
        const unitCost = parseFloat(supplierFormData.unitCost) || 0;
        const printingCostPerUnit = parseFloat(supplierFormData.printingCost) || 0;
        const shippingCostPerUnit = parseFloat(supplierFormData.shippingCost) || 0;
        
        const subtotal = orderQty * unitCost;
        const totalPrintingCost = orderQty * printingCostPerUnit;
        const totalShippingCost = orderQty * shippingCostPerUnit;
        const total = subtotal + totalPrintingCost + totalShippingCost;
        
        return {
            subtotal,
            totalPrintingCost,
            totalShippingCost,
            total
        };
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('Image size should be less than 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }
            setSupplierFormData(prev => ({
                ...prev,
                image: file
            }));
        }
    };

    const handleImageDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }
            setSupplierFormData(prev => ({
                ...prev,
                image: file
            }));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleSupplierFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!editingSupplier) return;
            setIsSubmitting(true);

            let imageUrl = null;
            if (supplierFormData.image) {
                // Upload new image to storage and get URL
                const timestamp = Date.now();
                const fileName = `${editingSupplier.name.replace(/\s+/g, '_')}_${timestamp}`;
                const storageRef = ref(storage, `supplier-images/${fileName}`);
                await uploadBytes(storageRef, supplierFormData.image);
                imageUrl = await getDownloadURL(storageRef);
            } else if (supplierFormData.shouldRemoveImage) {
                // If image should be removed, set imageUrl to null
                imageUrl = null;
            } else {
                // Keep existing imageUrl if no changes
                imageUrl = editingSupplier.imageUrl;
            }

            const updatedItems = internalPO.items.map(item => {
                if ((item.id === editingSupplier.id) || 
                    (!item.id && item.name === editingSupplier.name)) {
                    const { subtotal, totalPrintingCost, totalShippingCost, total } = calculateSupplierTotal();
                    return {
                        ...item,
                        supplierName: supplierFormData.supplierName,
                        orderQuantity: parseFloat(supplierFormData.orderQuantity),
                        unitCost: parseFloat(supplierFormData.unitCost),
                        printingCost: parseFloat(supplierFormData.printingCost) || 0,
                        shippingCost: parseFloat(supplierFormData.shippingCost) || 0,
                        imageUrl: imageUrl,
                        subtotal,
                        totalPrintingCost,
                        totalShippingCost,
                        total,
                        updatedAt: new Date()
                    };
                }
                return item;
            });

            await updateDoc(doc(db, 'internalPOs', id), {
                items: updatedItems,
                updatedAt: new Date()
            });

            setInternalPO(prev => ({
                ...prev,
                items: updatedItems,
                updatedAt: new Date()
            }));

            await updateNetProfit();
            setEditingSupplier(null);
            setSupplierFormData({
                supplierName: '',
                orderQuantity: '',
                unitCost: '',
                printingCost: '',
                shippingCost: '',
                image: null,
                imageUrl: null,
                shouldRemoveImage: false
            });
            toast.success('Supplier details updated successfully');
        } catch (err) {
            console.error('Error updating supplier details:', err);
            toast.error('Failed to update supplier details');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePrintingCostSubmit = async (e) => {
        e.preventDefault();
        try {
            const additionalPrintingCostValue = parseFloat(additionalPrintingCost) || 0;
            
            await updateDoc(doc(db, 'internalPOs', id), {
                additionalPrintingCost: additionalPrintingCostValue,
                updatedAt: new Date()
            });

            setInternalPO(prev => ({
                ...prev,
                additionalPrintingCost: additionalPrintingCostValue,
                updatedAt: new Date()
            }));

            await updateNetProfit();
            setShowPrintingModal(false);
            setAdditionalPrintingCost('');
            toast.success('Additional printing cost updated successfully');
        } catch (err) {
            console.error('Error updating printing cost:', err);
            toast.error('Failed to update printing cost');
        }
    };

    const handleDeliveryDateSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, 'internalPOs', id), {
                deliveryDate: deliveryDate
            });

            setInternalPO(prev => ({
                ...prev,
                deliveryDate: deliveryDate
            }));

            setShowDeliveryDateModal(false);
            setDeliveryDate('');
            toast.success('Delivery date updated successfully');
        } catch (err) {
            console.error('Error updating delivery date:', err);
            toast.error('Failed to update delivery date');
        }
    };

    // Show loading state
    if (loading || !internalPO) {
        return (
            <StyledInternalPOView>
                <ToastContainer position="top-right" autoClose={3000} />
                <Container>
                    <Link
                        to="/internal-pos"
                        variants={variant('link')}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{ marginBottom: '28px' }}
                    >
                        <Icon name="arrow-left" size={10} color={theme?.colors?.primary || '#000'} />
                        Go back
                    </Link>
                    
                    <Controller
                        variants={variant('controller')}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Text>Loading internal PO...</Text>
                            <div style={{ marginLeft: 16, width: 16, height: 16 }} className="loading-spinner"></div>
                        </div>
                    </Controller>
                </Container>
            </StyledInternalPOView>
        );
    }

    const { subtotal, vatAmount, grandTotal } = calculateTotals();

    return (
        <StyledInternalPOView>
            <ToastContainer position="top-right" autoClose={3000} />
            <Container>
                <Link
                    to="/internal-pos"
                    variants={variant('link')}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <Icon name="arrow-left" size={16} color="inherit" />
                    Go back
                </Link>

                <HeaderSection>
                    <HeaderTitle>Internal PO</HeaderTitle>
                </HeaderSection>

                <Controller
                    variants={variant('controller')}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <StatusBadge status={internalPO.status}>
                            <span>
                                {internalPO.status === 'paid' ? 'Paid' : 
                                 internalPO.status === 'pending' ? 'Pending' : 
                                 internalPO.status === 'partially_paid' ? 'Partially Paid' : 
                                 internalPO.status === 'void' ? 'Void' : 'Draft'}
                            </span>
                        </StatusBadge>
                        <DownloadButton onClick={handleDownloadPDF}>
                            <Icon name="download" size={13} />
                            Share
                        </DownloadButton>
                    </div>

                    <ButtonWrapper>
                        {internalPO.status !== 'void' && (
                            <>
                                <Button onClick={() => setShowEditModal(true)} $secondary>
                                    <Icon name="edit" size={13} />
                                    Edit
                                </Button>
                                <Button onClick={() => setShowDeleteModal(true)} $danger>
                                    <Icon name="delete" size={13} />
                                    Delete
                                </Button>
                                <Button onClick={() => setShowVoidModal(true)} $warning>
                                    <Icon name="void" size={13} />
                                    Void
                                </Button>
                                {internalPO.status !== 'paid' && (
                                    <Button onClick={() => setShowPaymentModal(true)} $primary>
                                        <Icon name="payment" size={13} />
                                        Mark as Paid
                                    </Button>
                                )}
                            </>
                        )}
                    </ButtonWrapper>
                </Controller>

                <InfoCard>
                    <InfoHeader>
                        <InfoGroup>
                            <InfoID>
                                <span>Internal PO #</span>{internalPO.customId}
                            </InfoID>
                            <InfoDesc>{internalPO.description}</InfoDesc>
                            <MetaInfo>
                                <MetaItem>
                                    <Icon name="calendar" size={13} />
                                    Created: {formatDate(internalPO.createdAt)}
                                </MetaItem>
                                <MetaItem>
                                    <Icon name="calendar" size={13} />
                                    Due: {formatDate(internalPO.paymentDue)}
                                </MetaItem>
                            </MetaInfo>
                        </InfoGroup>
                    </InfoHeader>

                    <InfoAddresses>
                        <AddressGroup align="left">
                            <AddressTitle>Bill To</AddressTitle>
                            <AddressText>
                                <strong>{clientData?.name || internalPO.clientName}</strong><br />
                                {clientData?.address}<br />
                                {clientData?.country}<br />
                                {clientData?.phone}<br />
                                {clientHasVAT && clientData?.trnNumber && (
                                    <span style={{ fontWeight: '600' }}>
                                        TRN: {clientData.trnNumber}
                                    </span>
                                )}
                            </AddressText>
                        </AddressGroup>
                    </InfoAddresses>

                    <PaymentDetailsSection>
                        <PaymentDetailsHeader>
                            <PaymentDetailsTitle>Cost Analysis</PaymentDetailsTitle>
                        </PaymentDetailsHeader>

                        <PaymentDetailsGrid>
                            <PaymentDetailItem>
                                <PaymentDetailLabel>
                                    <Icon name="cube" size={16} style={{ marginRight: '8px' }} />
                                    Total Items
                                </PaymentDetailLabel>
                                <PaymentDetailValue>
                                    {internalPO.items?.reduce((sum, item) => sum + (item.orderQuantity || item.quantity || 0), 0)}
                                </PaymentDetailValue>
                            </PaymentDetailItem>
                            <PaymentDetailItem>
                                <PaymentDetailLabel>
                                    <Icon name="money-bill" size={16} style={{ marginRight: '8px' }} />
                                    Total Cost
                                </PaymentDetailLabel>
                                <PaymentDetailValue>
                                    {formatPrice(
                                        internalPO.items?.reduce((sum, item) => {
                                            const orderQty = item.orderQuantity || item.quantity || 0;
                                            const unitCost = item.unitCost || item.price || 0;
                                            return sum + (orderQty * unitCost);
                                        }, 0),
                                        internalPO.currency
                                    )}
                                </PaymentDetailValue>
                            </PaymentDetailItem>
                            <PaymentDetailItem>
                                <PaymentDetailLabel>
                                    <Icon name="print" size={16} style={{ marginRight: '8px' }} />
                                    Printing Cost
                                </PaymentDetailLabel>
                                <PaymentDetailValue>
                                    {formatPrice(
                                        internalPO.items?.reduce((sum, item) => {
                                            const orderQty = item.orderQuantity || item.quantity || 0;
                                            const printingCost = item.printingCost || 0;
                                            return sum + (orderQty * printingCost);
                                        }, 0),
                                        internalPO.currency
                                    )}
                                </PaymentDetailValue>
                            </PaymentDetailItem>
                            <PaymentDetailItem onClick={() => setShowShippingModal(true)} style={{ cursor: 'pointer' }}>
                                <PaymentDetailLabel>
                                    <Icon name="shipping" size={16} style={{ marginRight: '8px' }} />
                                    Additional Shipping Cost
                                </PaymentDetailLabel>
                                <PaymentDetailValue>
                                    {formatPrice(internalPO.additionalShippingCost || 0, internalPO.currency)}
                                </PaymentDetailValue>
                            </PaymentDetailItem>
                            <PaymentDetailItem>
                                <PaymentDetailLabel>
                                    <Icon name="truck-fast" size={16} style={{ marginRight: '8px' }} />
                                    Shipping Cost
                                </PaymentDetailLabel>
                                <PaymentDetailValue>
                                    {formatPrice(
                                        internalPO.items?.reduce((sum, item) => {
                                            const orderQty = item.orderQuantity || item.quantity || 0;
                                            const shippingCost = item.shippingCost || 0;
                                            return sum + (orderQty * shippingCost);
                                        }, 0),
                                        internalPO.currency
                                    )}
                                </PaymentDetailValue>
                            </PaymentDetailItem>
                            <PaymentDetailItem onClick={() => setShowPrintingModal(true)} style={{ cursor: 'pointer' }}>
                                <PaymentDetailLabel>
                                    <Icon name="print" size={16} style={{ marginRight: '8px' }} />
                                    Additional Printing Cost
                                </PaymentDetailLabel>
                                <PaymentDetailValue>
                                    {formatPrice(internalPO.additionalPrintingCost || 0, internalPO.currency)}
                                </PaymentDetailValue>
                            </PaymentDetailItem>
                            <PaymentDetailItem onClick={() => setShowDeliveryDateModal(true)} style={{ cursor: 'pointer' }}>
                                <PaymentDetailLabel>
                                    <Icon name="calendar" size={16} style={{ marginRight: '8px' }} />
                                    Date of Delivery
                                </PaymentDetailLabel>
                                <PaymentDetailValue>
                                    {internalPO.deliveryDate ? formatDate(internalPO.deliveryDate) : 'Not set'}
                                </PaymentDetailValue>
                            </PaymentDetailItem>
                            <PaymentDetailItem>
                                <PaymentDetailLabel>
                                    <Icon name="calculator" size={16} style={{ marginRight: '8px' }} />
                                    Net Total (Cost)
                                </PaymentDetailLabel>
                                <PaymentDetailValue>
                                    {formatPrice(
                                        // Total cost of items
                                        internalPO.items?.reduce((sum, item) => {
                                            const orderQty = item.orderQuantity || item.quantity || 0;
                                            const unitCost = item.unitCost || item.price || 0;
                                            return sum + (orderQty * unitCost);
                                        }, 0) +
                                        // Total printing cost (per item + additional)
                                        internalPO.items?.reduce((sum, item) => {
                                            const orderQty = item.orderQuantity || item.quantity || 0;
                                            const printingCost = item.printingCost || 0;
                                            return sum + (orderQty * printingCost);
                                        }, 0) + (internalPO.additionalPrintingCost || 0) +
                                        // Total shipping cost (per item + additional)
                                        internalPO.items?.reduce((sum, item) => {
                                            const orderQty = item.orderQuantity || item.quantity || 0;
                                            const shippingCost = item.shippingCost || 0;
                                            return sum + (orderQty * shippingCost);
                                        }, 0) + (internalPO.additionalShippingCost || 0),
                                        internalPO.currency
                                    )}
                                </PaymentDetailValue>
                            </PaymentDetailItem>
                            <PaymentDetailItem>
                                <PaymentDetailLabel>
                                    <Icon name="chart-line" size={16} style={{ marginRight: '8px' }} />
                                    Net Profit
                                </PaymentDetailLabel>
                                <PaymentDetailValue>
                                    {formatPrice(
                                        grandTotal - (
                                            // Total cost of items
                                            internalPO.items?.reduce((sum, item) => {
                                                const orderQty = item.orderQuantity || item.quantity || 0;
                                                const unitCost = item.unitCost || item.price || 0;
                                                return sum + (orderQty * unitCost);
                                            }, 0) +
                                            // Total printing cost (per item + additional)
                                            internalPO.items?.reduce((sum, item) => {
                                                const orderQty = item.orderQuantity || item.quantity || 0;
                                                const printingCost = item.printingCost || 0;
                                                return sum + (orderQty * printingCost);
                                            }, 0) + (internalPO.additionalPrintingCost || 0) +
                                            // Total shipping cost (per item + additional)
                                            internalPO.items?.reduce((sum, item) => {
                                                const orderQty = item.orderQuantity || item.quantity || 0;
                                                const shippingCost = item.shippingCost || 0;
                                                return sum + (orderQty * shippingCost);
                                            }, 0) + (internalPO.additionalShippingCost || 0)
                                        ),
                                        internalPO.currency
                                    )}
                                </PaymentDetailValue>
                            </PaymentDetailItem>
                        </PaymentDetailsGrid>
                    </PaymentDetailsSection>

                    <Details className="Details">
                        <SupplierSection>
                            <SupplierHeader>
                                <Icon name="supplier" size={16} color={theme?.colors?.primary} />
                                <SupplierTitle>Supplier Details</SupplierTitle>
                            </SupplierHeader>
                            
                            <SupplierGrid>
                                {internalPO.items?.map((item, index) => {
                                    const orderQty = item.orderQuantity || item.quantity || 0;
                                    const unitCost = item.unitCost || item.price || 0;
                                    const printingCost = item.printingCost || 0;
                                    const shippingCost = item.shippingCost || 0;
                                    const subtotal = orderQty * unitCost;
                                    const totalPrintingCost = orderQty * printingCost;
                                    const totalShippingCost = orderQty * shippingCost;
                                    const total = subtotal + totalPrintingCost + totalShippingCost;
                                    
                                    return (
                                        <SupplierItem 
                                            key={index}
                                            onClick={() => handleSupplierClick(item)}
                                        >
                                            <SupplierName>
                                                <Icon name="supplier" size={14} className="supplier-icon" />
                                                {item.supplierName || 'Not assigned'}
                                            </SupplierName>
                                            <SupplierDetails>
                                                <SupplierRow>
                                                    <SupplierLabel>Item:</SupplierLabel>
                                                    <SupplierValue>{item.name}</SupplierValue>
                                                </SupplierRow>
                                                <SupplierRow>
                                                    <SupplierLabel>Order Quantity:</SupplierLabel>
                                                    <SupplierValue>{orderQty}</SupplierValue>
                                                </SupplierRow>
                                                <SupplierRow>
                                                    <SupplierLabel>Unit Cost:</SupplierLabel>
                                                    <SupplierValue>{formatPrice(unitCost, internalPO.currency)}</SupplierValue>
                                                </SupplierRow>
                                                <CostBreakdown>
                                                    <CostItem>
                                                        <CostLabel>
                                                            <Icon name="print" size={12} />
                                                            Printing Cost (Per Unit)
                                                        </CostLabel>
                                                        <CostValue>{formatPrice(printingCost, internalPO.currency)}</CostValue>
                                                    </CostItem>
                                                    <CostItem>
                                                        <CostLabel>
                                                            <Icon name="shipping" size={12} />
                                                            Shipping Cost (Per Unit)
                                                        </CostLabel>
                                                        <CostValue>{formatPrice(shippingCost, internalPO.currency)}</CostValue>
                                                    </CostItem>
                                                    <CostItem>
                                                        <CostLabel>
                                                            <Icon name="total" size={12} />
                                                            Total
                                                        </CostLabel>
                                                        <CostValue>{formatPrice(total, internalPO.currency)}</CostValue>
                                                    </CostItem>
                                                </CostBreakdown>
                                            </SupplierDetails>
                                        </SupplierItem>
                                    );
                                })}
                            </SupplierGrid>
                        </SupplierSection>

                        <ItemsSection>
                            <ItemsHeader className="ItemsHeader" showVat={clientHasVAT}>
                                <HeaderCell>Item Name</HeaderCell>
                                <HeaderCell>QTY.</HeaderCell>
                                <HeaderCell>Price</HeaderCell>
                                {clientHasVAT && <HeaderCell>VAT (5%)</HeaderCell>}
                                <HeaderCell>Total</HeaderCell>
                            </ItemsHeader>
                            
                            <Items>
                                {internalPO.items?.map((item, index) => {
                                    const itemVAT = clientHasVAT ? (item.price * item.quantity * 0.05) : 0;
                                    const orderQty = item.orderQuantity || item.quantity || 0;
                                    const unitCost = item.unitCost || item.price || 0;
                                    const subtotal = orderQty * unitCost;
                                    const total = subtotal + (clientHasVAT ? itemVAT : 0);
                                    
                                    // Get the corresponding invoice item description
                                    const invoiceItem = invoiceData?.items?.find(invItem => invItem.name === item.name);
                                    return (
                                        <Item key={index} showVat={clientHasVAT}>
                                            <div className="item-details">
                                                <ItemName>{item.name}</ItemName>
                                                {(item.description || invoiceItem?.description) && (
                                                    <ItemDescription>
                                                        {item.description || invoiceItem?.description}
                                                    </ItemDescription>
                                                )}
                                                <div className="item-mobile-details">
                                                    <span>
                                                        {orderQty} × {formatPrice(unitCost, internalPO.currency)}
                                                        {clientHasVAT && ` (+${formatPrice(itemVAT, internalPO.currency)} VAT)`}
                                                    </span>
                                                </div>
                                            </div>
                                            <ItemQty>{orderQty}</ItemQty>
                                            <ItemPrice>{formatPrice(unitCost, internalPO.currency)}</ItemPrice>
                                            {clientHasVAT && (
                                                <ItemVat>
                                                    {formatPrice(itemVAT, internalPO.currency)}
                                                </ItemVat>
                                            )}
                                            <ItemTotal>
                                                {formatPrice(total, internalPO.currency)}
                                            </ItemTotal>
                                        </Item>
                                    );
                                })}
                            </Items>

                            <Total>
                                <div>
                                    <TotalText>Subtotal</TotalText>
                                    <TotalAmount>{formatPrice(subtotal, internalPO.currency)}</TotalAmount>
                                </div>
                                {clientHasVAT && (
                                    <div>
                                        <TotalText>VAT (5%)</TotalText>
                                        <TotalAmount>{formatPrice(vatAmount, internalPO.currency)}</TotalAmount>
                                    </div>
                                )}
                                <div className="grand-total">
                                    <TotalText>Total</TotalText>
                                    <TotalAmount>{formatPrice(grandTotal, internalPO.currency)}</TotalAmount>
                                </div>
                            </Total>
                        </ItemsSection>
                    </Details>

                    <InfoSectionsGrid>
                        <TermsSection>
                            <TermsHeader>
                                <TermsTitle>Notes</TermsTitle>
                                {!isEditingTerms ? (
                                    <Button
                                        onClick={() => {
                                            setEditedTerms(internalPO.termsAndConditions || defaultTermsAndConditions);
                                            setIsEditingTerms(true);
                                        }}
                                        $secondary
                                        style={{ padding: '6px 12px', fontSize: '13px' }}
                                    >
                                        <Icon name="edit" size={13} />
                                        Edit
                                    </Button>
                                ) : (
                                    <TermsActions>
                                        <Button
                                            onClick={() => setIsEditingTerms(false)}
                                            $secondary
                                            style={{ padding: '6px 12px', fontSize: '13px' }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleEditTerms}
                                            $primary
                                            style={{ padding: '6px 12px', fontSize: '13px' }}
                                        >
                                            Save
                                        </Button>
                                    </TermsActions>
                                )}
                            </TermsHeader>
                            {!isEditingTerms ? (
                                <div style={{ whiteSpace: 'pre-line' }}>
                                    {internalPO.termsAndConditions || defaultTermsAndConditions}
                                </div>
                            ) : (
                                <FormTextArea
                                    value={editedTerms}
                                    onChange={(e) => setEditedTerms(e.target.value)}
                                    rows={5}
                                />
                            )}
                        </TermsSection>

                        {renderBankDetails()}
                    </InfoSectionsGrid>
                </InfoCard>
            </Container>

            {/* Modals */}
            {showDeleteModal && (
                <Modal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    title="Delete Internal PO"
                    message="Are you sure you want to delete this internal PO? This action cannot be undone."
                    primaryAction={{
                        label: 'Delete',
                        onClick: handleDelete,
                        variant: 'danger'
                    }}
                    secondaryAction={{
                        label: 'Cancel',
                        onClick: () => setShowDeleteModal(false)
                    }}
                />
            )}

            {showVoidModal && (
                <Modal
                    isOpen={showVoidModal}
                    onClose={() => setShowVoidModal(false)}
                    title="Void Internal PO"
                    message="Are you sure you want to void this internal PO? This action cannot be undone."
                    primaryAction={{
                        label: 'Void',
                        onClick: handleVoid,
                        variant: 'warning'
                    }}
                    secondaryAction={{
                        label: 'Cancel',
                        onClick: () => setShowVoidModal(false)
                    }}
                />
            )}

            {showPaymentModal && (
                <Modal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    title="Add Payment"
                    content={
                        <PaymentForm onSubmit={(e) => {
                            e.preventDefault();
                            handlePaymentUpdate(paymentAmount);
                        }}>
                            <FormRow>
                                <PaymentFormLabel>Payment Amount</PaymentFormLabel>
                                <FormInput
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    required
                                />
                            </FormRow>
                        </PaymentForm>
                    }
                    primaryAction={{
                        label: 'Add Payment',
                        onClick: () => handlePaymentUpdate(paymentAmount),
                        variant: 'primary'
                    }}
                    secondaryAction={{
                        label: 'Cancel',
                        onClick: () => setShowPaymentModal(false)
                    }}
                />
            )}

            {isEmailModalOpen && emailData && pdfData && (
                <EmailPreviewModal
                    isOpen={isEmailModalOpen}
                    onClose={() => setIsEmailModalOpen(false)}
                    onSend={handleEmailSent}
                    emailData={emailData}
                    documentType="internal_po"
                    documentId={internalPO.id}
                    clientName={internalPO.clientName}
                    clientEmail={internalPO.clientEmail}
                    amount={internalPO.total}
                    currency={internalPO.currency}
                    dueDate={internalPO.dueDate}
                    pdfBase64={pdfData.content}
                    pdfName={pdfData.name}
                />
            )}

            {/* Supplier Edit Modal */}
            {editingSupplier && (
                <ModalOverlay>
                    <SupplierEditModal>
                        <ModalHeader>
                            <ModalIconWrapper>
                                <Icon name="supplier" size={20} />
                            </ModalIconWrapper>
                            <ModalTitle>Edit Supplier Details - {editingSupplier.name}</ModalTitle>
                        </ModalHeader>
                        
                        <SupplierEditForm onSubmit={handleSupplierFormSubmit}>
                            <SupplierFormSection>
                                <SupplierFormTitle>Basic Information</SupplierFormTitle>
                                <SupplierFormRow>
                                    <SupplierFormLabel>Supplier Name</SupplierFormLabel>
                                    <SupplierFormInput
                                        type="text"
                                        name="supplierName"
                                        value={supplierFormData.supplierName}
                                        onChange={handleSupplierFormChange}
                                        placeholder="Enter supplier name"
                                        required
                                    />
                                </SupplierFormRow>
                                <SupplierFormRow>
                                    <SupplierFormLabel>Order Quantity</SupplierFormLabel>
                                    <SupplierFormInput
                                        type="number"
                                        name="orderQuantity"
                                        value={supplierFormData.orderQuantity}
                                        onChange={handleSupplierFormChange}
                                        min="0"
                                        step="1"
                                        required
                                    />
                                </SupplierFormRow>
                                <SupplierFormRow>
                                    <SupplierFormLabel>Unit Cost</SupplierFormLabel>
                                    <SupplierFormInput
                                        type="number"
                                        name="unitCost"
                                        value={supplierFormData.unitCost}
                                        onChange={handleSupplierFormChange}
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </SupplierFormRow>
                                <SupplierFormRow>
                                    <SupplierFormLabel>Product Image</SupplierFormLabel>
                                    <ImageUploadContainer
                                        onDrop={handleImageDrop}
                                        onDragOver={handleDragOver}
                                        hasImage={!!supplierFormData.image || !!supplierFormData.imageUrl}
                                        onClick={() => {
                                            if (!supplierFormData.image && !supplierFormData.imageUrl) {
                                                document.getElementById('image-upload').click();
                                            }
                                        }}
                                    >
                                        {supplierFormData.image || supplierFormData.imageUrl ? (
                                            <ImagePreview>
                                                <img 
                                                    src={supplierFormData.image ? URL.createObjectURL(supplierFormData.image) : supplierFormData.imageUrl} 
                                                    alt="Product preview" 
                                                />
                                                <RemoveImageButton 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        if (supplierFormData.image) {
                                                            URL.revokeObjectURL(supplierFormData.image);
                                                        }
                                                        setSupplierFormData(prev => ({ 
                                                            ...prev, 
                                                            image: null,
                                                            imageUrl: null,
                                                            shouldRemoveImage: true
                                                        }));
                                                    }}
                                                >
                                                    <Icon name="close" size={16} color="#fff" />
                                                </RemoveImageButton>
                                            </ImagePreview>
                                        ) : (
                                            <ImageUploadPlaceholder>
                                                <Icon name="image" size={32} color={theme?.colors?.primary || '#000'} />
                                                <span>Drag & drop an image here</span>
                                                <span style={{ fontSize: '12px', color: theme?.colors?.textSecondary || '#666' }}>
                                                    or click to browse
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    style={{ display: 'none' }}
                                                    id="image-upload"
                                                />
                                            </ImageUploadPlaceholder>
                                        )}
                                    </ImageUploadContainer>
                                    <ImageUploadHint>
                                        Supported formats: JPG, PNG, GIF (Max 5MB)
                                    </ImageUploadHint>
                                </SupplierFormRow>
                            </SupplierFormSection>

                            <SupplierFormSection>
                                <SupplierFormTitle>Additional Costs (Per Unit)</SupplierFormTitle>
                                <SupplierFormRow>
                                    <SupplierFormLabel>Printing Cost (Per Unit)</SupplierFormLabel>
                                    <SupplierFormInput
                                        type="number"
                                        name="printingCost"
                                        value={supplierFormData.printingCost}
                                        onChange={handleSupplierFormChange}
                                        min="0"
                                        step="0.01"
                                    />
                                </SupplierFormRow>
                                <SupplierFormRow>
                                    <SupplierFormLabel>Shipping Cost (Per Unit)</SupplierFormLabel>
                                    <SupplierFormInput
                                        type="number"
                                        name="shippingCost"
                                        value={supplierFormData.shippingCost}
                                        onChange={handleSupplierFormChange}
                                        min="0"
                                        step="0.01"
                                    />
                                </SupplierFormRow>
                            </SupplierFormSection>

                            <CostBreakdown>
                                <CostItem>
                                    <CostLabel>Subtotal</CostLabel>
                                    <CostValue>{formatPrice(calculateSupplierTotal().subtotal, internalPO.currency)}</CostValue>
                                </CostItem>
                                <CostItem>
                                    <CostLabel>Total Printing Cost</CostLabel>
                                    <CostValue>{formatPrice(calculateSupplierTotal().totalPrintingCost, internalPO.currency)}</CostValue>
                                </CostItem>
                                <CostItem>
                                    <CostLabel>Total Shipping Cost</CostLabel>
                                    <CostValue>{formatPrice(calculateSupplierTotal().totalShippingCost, internalPO.currency)}</CostValue>
                                </CostItem>
                                <CostItem>
                                    <CostLabel>Total</CostLabel>
                                    <CostValue>{formatPrice(calculateSupplierTotal().total, internalPO.currency)}</CostValue>
                                </CostItem>
                            </CostBreakdown>

                            <SupplierFormActions>
                                <Button
                                    type="button"
                                    onClick={() => setEditingSupplier(null)}
                                    $secondary
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    $primary
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div style={{ marginRight: '8px', width: '16px', height: '16px' }} className="loading-spinner"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                            </SupplierFormActions>
                        </SupplierEditForm>
                    </SupplierEditModal>
                </ModalOverlay>
            )}

            {showShippingModal && (
                <ModalOverlay>
                    <SupplierEditModal>
                        <ModalHeader>
                            <ModalIconWrapper>
                                <Icon name="shipping" size={20} />
                            </ModalIconWrapper>
                            <ModalTitle>Add Additional Shipping Cost</ModalTitle>
                        </ModalHeader>
                        
                        <SupplierEditForm onSubmit={handleShippingCostSubmit}>
                            <SupplierFormSection>
                                <SupplierFormTitle>Additional Shipping Cost</SupplierFormTitle>
                                <SupplierFormRow>
                                    <SupplierFormLabel>Additional Shipping Cost</SupplierFormLabel>
                                    <SupplierFormInput
                                        type="number"
                                        name="shippingCost"
                                        value={additionalShippingCost}
                                        onChange={(e) => setAdditionalShippingCost(e.target.value)}
                                        placeholder="Enter additional shipping cost"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </SupplierFormRow>
                            </SupplierFormSection>

                            <CostBreakdown>
                                <CostItem>
                                    <CostLabel>Additional Shipping Cost</CostLabel>
                                    <CostValue>
                                        {formatPrice(parseFloat(additionalShippingCost) || 0, internalPO.currency)}
                                    </CostValue>
                                </CostItem>
                            </CostBreakdown>

                            <SupplierFormActions>
                                <Button
                                    type="button"
                                    onClick={() => setShowShippingModal(false)}
                                    $secondary
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" $primary>
                                    Save Changes
                                </Button>
                            </SupplierFormActions>
                        </SupplierEditForm>
                    </SupplierEditModal>
                </ModalOverlay>
            )}

            {showPrintingModal && (
                <ModalOverlay>
                    <SupplierEditModal>
                        <ModalHeader>
                            <ModalIconWrapper>
                                <Icon name="print" size={20} />
                            </ModalIconWrapper>
                            <ModalTitle>Add Additional Printing Cost</ModalTitle>
                        </ModalHeader>
                        
                        <SupplierEditForm onSubmit={handlePrintingCostSubmit}>
                            <SupplierFormSection>
                                <SupplierFormTitle>Additional Printing Cost</SupplierFormTitle>
                                <SupplierFormRow>
                                    <SupplierFormLabel>Additional Printing Cost</SupplierFormLabel>
                                    <SupplierFormInput
                                        type="number"
                                        name="printingCost"
                                        value={additionalPrintingCost}
                                        onChange={(e) => setAdditionalPrintingCost(e.target.value)}
                                        placeholder="Enter additional printing cost"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </SupplierFormRow>
                            </SupplierFormSection>

                            <CostBreakdown>
                                <CostItem>
                                    <CostLabel>Additional Printing Cost</CostLabel>
                                    <CostValue>
                                        {formatPrice(parseFloat(additionalPrintingCost) || 0, internalPO.currency)}
                                    </CostValue>
                                </CostItem>
                            </CostBreakdown>

                            <SupplierFormActions>
                                <Button
                                    type="button"
                                    onClick={() => setShowPrintingModal(false)}
                                    $secondary
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" $primary>
                                    Save Changes
                                </Button>
                            </SupplierFormActions>
                        </SupplierEditForm>
                    </SupplierEditModal>
                </ModalOverlay>
            )}

            {showDeliveryDateModal && (
                <ModalOverlay>
                    <SupplierEditModal>
                        <ModalHeader>
                            <ModalIconWrapper>
                                <Icon name="calendar" size={20} />
                            </ModalIconWrapper>
                            <ModalTitle>Set Delivery Date</ModalTitle>
                        </ModalHeader>
                        
                        <SupplierEditForm onSubmit={handleDeliveryDateSubmit}>
                            <SupplierFormSection>
                                <SupplierFormTitle>Delivery Date</SupplierFormTitle>
                                <SupplierFormRow>
                                    <SupplierFormLabel>Date</SupplierFormLabel>
                                    <SupplierFormInput
                                        type="date"
                                        name="deliveryDate"
                                        value={deliveryDate}
                                        onChange={(e) => setDeliveryDate(e.target.value)}
                                        required
                                    />
                                </SupplierFormRow>
                            </SupplierFormSection>

                            <SupplierFormActions>
                                <Button
                                    type="button"
                                    onClick={() => setShowDeliveryDateModal(false)}
                                    $secondary
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" $primary>
                                    Save Changes
                                </Button>
                            </SupplierFormActions>
                        </SupplierEditForm>
                    </SupplierEditModal>
                </ModalOverlay>
            )}
        </StyledInternalPOView>
    );
};

export default InternalPOView; 