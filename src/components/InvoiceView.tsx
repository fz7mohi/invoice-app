import { useState } from 'react';
import { getCompanyProfile } from '../services/companyService';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { generateEmailTemplate } from '../services/emailService';
import { format } from 'date-fns';
import { message, Button } from 'antd';
import SplitInvoiceModal from './InvoiceView/SplitInvoiceModal';
import { doc, updateDoc, addDoc, collection, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/firebase';

interface ClientAddress {
    country?: string;
}

interface ClientData {
    country?: string;
}

interface Invoice {
    id: string;
    customId: string;
    clientName: string;
    clientEmail: string;
    clientAddress?: ClientAddress;
    total: number;
    currency: string;
    paymentDue: Date;
    status: string;
    items: any[];
    termsAndConditions?: string;
    // Split invoice fields
    isSplit?: boolean;
    splitType?: 'MASTER' | 'ADVANCE' | 'FINAL';
    masterInvoiceId?: string;
    advanceAmount?: number;
    remainingAmount?: number;
    relatedInvoiceId?: string;
}

interface EmailData {
    to: string;
    subject: string;
    content: string;
}

interface PdfData {
    content: string;
    name: string;
}

function InvoiceView() {
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [clientData, setClientData] = useState<ClientData | null>(null);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [emailData, setEmailData] = useState<EmailData | null>(null);
    const [pdfData, setPdfData] = useState<PdfData | null>(null);
    const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
    
    // ... rest of the component code ...

    const handleSendEmail = async () => {
        if (!invoice) return;
        
        try {
            // Get the client's country from the invoice or client data
            const clientCountry = invoice?.clientAddress?.country || 
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
                    <h1 style="font-size: 32px; color: #004359; margin: 0; letter-spacing: 1px;">INVOICE</h1>
                </div>
                <div style="height: 2px; background-color: #004359; margin: 10px 0;"></div>
            `;

            // Temporarily add to document to render
            pdfContainer.style.position = 'absolute';
            pdfContainer.style.left = '-9999px';
            document.body.appendChild(pdfContainer);

            // Create PDF with A3 size
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a3',
                compress: true
            });

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

            // Add the image to fit A3 page
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, 297, 420);

            // Convert to base64
            const pdfBase64 = pdf.output('datauristring').split(',')[1];

            // Generate email content
            const emailContent = generateEmailTemplate({
                clientName: invoice.clientName,
                documentType: 'Invoice',
                documentId: invoice.customId,
                amount: invoice.total,
                currency: invoice.currency,
                dueDate: invoice.paymentDue ? format(new Date(invoice.paymentDue), 'dd/MM/yyyy') : 'N/A'
            });

            // Set email data and open modal
            setEmailData({
                to: invoice.clientEmail,
                subject: `Invoice ${invoice.customId} from ${companyProfile.name}`,
                content: emailContent
            });
            setPdfData({
                content: pdfBase64,
                name: `Invoice_${invoice.customId}.pdf`
            });
            setIsEmailModalOpen(true);
        } catch (error) {
            console.error('Error preparing email:', error);
            message.error('Failed to prepare email. Please try again.');
        }
    };

    const handleSplitInvoice = async (splitType: 'amount' | 'percentage', value: number) => {
        if (!invoice) return;

        try {
            const advanceAmount = splitType === 'percentage' 
                ? (invoice.total * value) / 100 
                : value;
            
            const remainingAmount = invoice.total - advanceAmount;

            // Create advance invoice
            const advanceInvoice: Invoice = {
                ...invoice,
                id: `${invoice.id}-A`,
                customId: `${invoice.customId}-A`,
                splitType: 'ADVANCE',
                masterInvoiceId: invoice.id,
                advanceAmount,
                remainingAmount,
                status: 'pending'
            };

            // Create final invoice
            const finalInvoice: Invoice = {
                ...invoice,
                id: `${invoice.id}-F`,
                customId: `${invoice.customId}-F`,
                splitType: 'FINAL',
                masterInvoiceId: invoice.id,
                advanceAmount,
                remainingAmount,
                status: 'pending'
            };

            // Update master invoice
            const updatedMasterInvoice: Invoice = {
                ...invoice,
                splitType: 'MASTER',
                status: 'void',
                relatedInvoiceId: `${invoice.id}-A`
            };

            // Save all invoices to Firestore
            const batch = writeBatch(db);

            // Update master invoice
            const masterInvoiceRef = doc(db, 'invoices', invoice.id);
            batch.update(masterInvoiceRef, {
                splitType: 'MASTER',
                status: 'void',
                relatedInvoiceId: `${invoice.id}-A`
            });

            // Add advance invoice
            const advanceInvoiceRef = doc(collection(db, 'invoices'));
            batch.set(advanceInvoiceRef, {
                ...advanceInvoice,
                id: advanceInvoiceRef.id
            });

            // Add final invoice
            const finalInvoiceRef = doc(collection(db, 'invoices'));
            batch.set(finalInvoiceRef, {
                ...finalInvoice,
                id: finalInvoiceRef.id
            });

            // Commit the batch
            await batch.commit();

            message.success('Invoice split successfully');
            setIsSplitModalOpen(false);
        } catch (error) {
            console.error('Error splitting invoice:', error);
            message.error('Failed to split invoice');
        }
    };

    return (
        <div>
            {/* ... existing JSX ... */}
            
            {invoice && !invoice.isSplit && (
                <Button 
                    type="primary"
                    onClick={() => setIsSplitModalOpen(true)}
                    style={{ marginRight: '10px' }}
                >
                    Split Invoice
                </Button>
            )}
            
            <SplitInvoiceModal
                isOpen={isSplitModalOpen}
                onClose={() => setIsSplitModalOpen(false)}
                onSplit={handleSplitInvoice}
                totalAmount={invoice?.total || 0}
            />
        </div>
    );
}

export default InvoiceView; 