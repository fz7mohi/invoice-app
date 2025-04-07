/**
 * Function that allows the user to enter only numbers and a single decimal point.
 * Handles locale-specific decimal separators and limits to 2 decimal places.
 * @param    {string}  value - string to convert
 * @return {string} String with a valid number.
 */
const allowOnlyNumbers = (value) => {
    // If empty or null, return empty string to allow clearing the field
    if (!value && value !== 0) return '';

    // Convert to string and handle locale-specific decimal separators
    const stringValue = value.toString();
    
    // Replace comma with period for decimal point
    const normalizedValue = stringValue.replace(/,/g, '.');
    
    // Check if the value is just a decimal point
    if (normalizedValue === '.') return '0.';
    
    // Check if the value ends with a decimal point
    if (normalizedValue.endsWith('.')) {
        // Remove any characters that aren't numbers or decimal point
        const cleaned = normalizedValue.replace(/[^\d.]/g, '');
        // Ensure there's only one decimal point
        const parts = cleaned.split('.');
        if (parts.length > 2) {
            return parts[0] + '.';
        }
        return cleaned;
    }
    
    // Remove any characters that aren't numbers or decimal point
    const cleaned = normalizedValue.replace(/[^\d.]/g, '');

    // Handle multiple decimal points - keep only the first one
    const parts = cleaned.split('.');
    if (parts.length > 2) {
        return parts[0] + '.' + parts.slice(1).join('');
    }

    // If it's not a valid number after cleaning, return empty string
    if (isNaN(Number(cleaned)) && cleaned !== '.') {
        return '';
    }

    // Limit to 2 decimal places if there's a decimal point
    if (parts.length === 2) {
        return parts[0] + '.' + parts[1].slice(0, 2);
    }

    return cleaned;
};

export default allowOnlyNumbers;
