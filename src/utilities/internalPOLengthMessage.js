/**
 * Formats the message displaying the number of internal POs based on filter type and window width
 * @param {number|Array} length - The number of internal POs or array of internal POs
 * @param {string} filterType - The current filter type ('all', 'draft', 'in_review', 'finalized')
 * @param {number} windowWidth - The current window width
 * @returns {string} - The formatted message
 */
export default function internalPOLengthMessage(length, filterType, windowWidth) {
    const isMobile = windowWidth < 768;
    const filterText = filterType === 'all' ? '' : ` ${filterType}`;
    
    if (length === 0) {
        return `No${filterText} internal POs`;
    }
    
    if (length === 1) {
        return isMobile ? '1 internal PO' : `There is 1${filterText} internal PO`;
    }
    
    return isMobile 
        ? `${length} internal POs` 
        : `There are ${length}${filterText} internal POs`;
} 