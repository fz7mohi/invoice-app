import { useState } from 'react';
import { getCompanyProfile } from '../services/companyService';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { generateEmailTemplate } from '../services/emailService';
import { format } from 'date-fns';
import { message } from 'antd';

/** @typedef {Object} Invoice
 * @property {string} id
 * @property {string} customId
 * @property {string} clientName
 * @property {string} clientEmail
 * @property {Object} [clientAddress]
 * @property {string} [clientAddress.country]
 * @property {number} total
 * @property {string} currency
 * @property {Date} paymentDue
 * @property {string} status
 * @property {Array<any>} items
 * @property {string} [termsAndConditions]
 */

/** @typedef {Object} ClientData
 * @property {string} [country]
 */

function InvoiceView() {
    const [invoice, setInvoice] = useState(null);
    const [clientData, setClientData] = useState(null);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [emailData, setEmailData] = useState(null);
    const [pdfData, setPdfData] = useState(null);
    
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

    return (
        // ... rest of the component JSX ...
        null
    );
}

export default InvoiceView; 