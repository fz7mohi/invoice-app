/**
 * Function that allows the user to enter only numbers and a single decimal point.
 * @param    {string}  value - string to convert
 * @return {string} String with a valid number.
 */
const allowOnlyNumbers = (value) => {
    // If empty, return 0
    if (!value) return '0';

    // Remove any characters that aren't numbers or decimal point
    const cleaned = value.replace(/[^\d.]/g, '');

    // Handle multiple decimal points - keep only the first one
    const parts = cleaned.split('.');
    if (parts.length > 2) {
        return parts[0] + '.' + parts.slice(1).join('');
    }

    // If it's not a valid number after cleaning, return 0
    if (isNaN(Number(cleaned))) {
        return '0';
    }

    return cleaned;
};

export default allowOnlyNumbers;
