/**
 * Calculates the payment due date based on the invoice date and payment terms
 * @param {string} date - The invoice date in ISO format
 * @param {string} paymentTerms - The payment terms (e.g., 'net30', 'net15', 'net7')
 * @returns {string} - The calculated payment due date in ISO format
 */
export const calculatePaymentDueDate = (date, paymentTerms) => {
    const invoiceDate = new Date(date);
    let daysToAdd = 0;

    switch (paymentTerms) {
        case 'net7':
            daysToAdd = 7;
            break;
        case 'net15':
            daysToAdd = 15;
            break;
        case 'net30':
            daysToAdd = 30;
            break;
        case 'net60':
            daysToAdd = 60;
            break;
        default:
            daysToAdd = 30; // Default to net30 if terms not specified
    }

    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + daysToAdd);
    
    return dueDate.toISOString();
}; 