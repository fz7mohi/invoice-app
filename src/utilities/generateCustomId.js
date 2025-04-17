/**
 * Generates a custom ID for documents based on type and current date
 * @param {string} type - The type of document (e.g., 'INV', 'QT', 'PO')
 * @returns {string} - The generated custom ID
 */
export const generateCustomId = (type) => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    
    // Generate a random 4-digit number
    const random = Math.floor(1000 + Math.random() * 9000);
    
    return `${type}-${year}${month}${day}-${random}`;
}; 