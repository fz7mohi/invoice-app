/**
 * Format date to a readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
    if (!date) return '';
    
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    
    // If date is a string or timestamp, convert to Date object
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    return date.toLocaleDateString('en-US', options);
};

/**
 * Format price with currency symbol
 * @param {number} price - Price to format
 * @param {string} currency - Currency code (ISO 4217)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = 'USD') => {
    // Handle invalid or empty currency - ensure it's a valid 3-letter code
    if (!currency || typeof currency !== 'string' || currency.length !== 3) {
        currency = 'USD';
    }
    
    // Normalize currency to uppercase
    currency = currency.toUpperCase();
    
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price || 0);
    } catch (error) {
        // Fallback format if there's an error
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price || 0);
    }
};

/**
 * Format phone number with international format
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    
    // Remove all non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length === 10) {
        // US format: (XXX) XXX-XXXX
        return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
    } else if (cleaned.length > 10) {
        // International format with + prefix
        return `+${cleaned.substring(0, cleaned.length-10)} ${cleaned.substring(cleaned.length-10, cleaned.length-7)} ${cleaned.substring(cleaned.length-7, cleaned.length-4)} ${cleaned.substring(cleaned.length-4)}`;
    }
    
    // Return as is if it doesn't match expected formats
    return phoneNumber;
};

/**
 * Function to format receipt count message based on filter type and window width.
 * @param    {number} length    Number of receipts
 * @param    {string} type    String with filter type
 * @param    {number} windowWidth    Number with window width
 * @return   {string}    String with formatted message
 */
export const receiptsLengthMessage = (length, type, windowWidth) => {
    const receiptsText = windowWidth >= 768 ? 'receipts' : '';
    const filterText = type === 'all' ? 'total' : type;

    return `${length} ${receiptsText} ${filterText}`;
};

/**
 * Format currency with currency symbol
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (ISO 4217)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
    // Handle invalid or empty currency - ensure it's a valid 3-letter code
    if (!currency || typeof currency !== 'string' || currency.length !== 3) {
        currency = 'USD';
    }
    
    // Normalize currency to uppercase
    currency = currency.toUpperCase();
    
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0);
    } catch (error) {
        // Fallback format if there's an error
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0);
    }
};