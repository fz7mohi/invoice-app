import QRCode from 'qrcode';

/**
 * Utility functions for generating QR codes for quotation items
 * Uses the qrcode library for proper, scannable QR code generation
 * Creates simple, reliable QR codes that can be easily scanned
 */

/**
 * Generate a scannable QR code for an item image
 * Creates a simple, reliable QR code with minimal data
 * @param {string} imageUrl - The base64 image data or URL
 * @param {string} itemName - The name of the item
 * @param {string} quotationId - The quotation ID
 * @param {number} size - The size of the QR code (default: 100)
 * @returns {Promise<string>} - Promise that resolves to data URL for the QR code
 */
export const generateItemQRCode = async (imageUrl, itemName, quotationId, size = 100) => {
    try {
        // Create a simple data object that will be encoded in the QR code
        const qrData = {
            type: 'quotation_item_image',
            quotationId: quotationId,
            itemName: itemName,
            timestamp: new Date().toISOString()
        };

        // Convert to JSON string
        const qrDataString = JSON.stringify(qrData);

        // Generate QR code using the qrcode library
        const qrCodeDataUrl = await QRCode.toDataURL(qrDataString, {
            width: size,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            errorCorrectionLevel: 'L' // Low error correction for better scanning
        });

        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating QR code:', error);
        // Return a fallback QR code
        return generateFallbackQRCode(size);
    }
};

/**
 * Generate a QR code for a URL (simplified version for direct URL encoding)
 * @param {string} url - The URL to encode
 * @param {number} size - The size of the QR code (default: 100)
 * @returns {Promise<string>} - Promise that resolves to data URL for the QR code
 */
export const generateURLQRCode = async (url, size = 100) => {
    try {
        // Generate QR code directly from URL
        const qrCodeDataUrl = await QRCode.toDataURL(url, {
            width: size,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            errorCorrectionLevel: 'M' // Medium error correction for URLs
        });

        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating URL QR code:', error);
        return generateFallbackQRCode(size);
    }
};

/**
 * Generate a simple test QR code to verify functionality
 * @param {string} text - Simple text to encode
 * @param {number} size - Size of the QR code
 * @returns {Promise<string>} - Data URL for the test QR code
 */
export const generateTestQRCode = async (text = 'Test QR Code', size = 100) => {
    try {
        console.log('Generating test QR code with text:', text);
        
        const qrCodeDataUrl = await QRCode.toDataURL(text, {
            width: size,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            errorCorrectionLevel: 'L'
        });
        
        console.log('Test QR code generated successfully');
        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating test QR code:', error);
        return generateFallbackQRCode(size);
    }
};

/**
 * Generate a QR code for the scanner URL (recommended approach)
 * Creates a simple, reliable QR code that can be easily scanned
 * @param {string} imageUrl - The image URL or data
 * @param {string} itemName - The item name
 * @param {string} quotationId - The quotation ID
 * @param {number} size - The size of the QR code
 * @returns {Promise<string>} - Promise that resolves to data URL for the QR code
 */
export const generateScannerQRCode = async (imageUrl, itemName, quotationId, size = 100) => {
    try {
        console.log('Generating scanner QR code for:', { itemName, quotationId, size });
        
        // Create a simple scanner URL with minimal data
        const scannerURL = createSimpleScannerURL(imageUrl, itemName, quotationId);
        console.log('Scanner URL created:', scannerURL);
        
        // Generate QR code from the simple URL
        const qrCodeDataUrl = await QRCode.toDataURL(scannerURL, {
            width: size,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            errorCorrectionLevel: 'L' // Low error correction for better scanning
        });
        
        console.log('Scanner QR code generated successfully');
        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating scanner QR code:', error);
        // Try to generate a fallback with just the basic info
        try {
            const fallbackText = `${itemName} - ${quotationId}`;
            console.log('Trying fallback QR code with text:', fallbackText);
            return await generateTextQRCode(fallbackText, size);
        } catch (fallbackError) {
            console.error('Fallback QR generation also failed:', fallbackError);
            return generateFallbackQRCode(size);
        }
    }
};

/**
 * Create a simple scanner URL that's easy to scan
 * @param {string} imageUrl - The image URL or data
 * @param {string} itemName - The item name
 * @param {string} quotationId - The quotation ID
 * @returns {string} - Simple URL for the QR scanner page
 */
export const createSimpleScannerURL = (imageUrl, itemName, quotationId) => {
    // Determine the base URL based on environment
    // IMPORTANT: This fix ensures NEW QR codes use production URLs
    // EXISTING QR codes with localhost URLs will need to be regenerated
    let baseUrl;
    if (typeof window !== 'undefined') {
        // Check if we're in development or production
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // Development environment - use production URL for QR codes
            // This ensures QR codes generated in dev work in production
            baseUrl = 'https://fordox.netlify.app';
        } else {
            // Production environment - use current origin
            baseUrl = window.location.origin;
        }
    } else {
        // Server-side or unknown environment - default to production
        baseUrl = 'https://fordox.netlify.app';
    }
    
    // Always use simple reference approach for better reliability
    // This avoids issues with long URLs and image access problems
    const simpleRef = `${itemName.replace(/[^a-zA-Z0-9]/g, '')}_${quotationId}`;
    const encodedItemName = encodeURIComponent(itemName.substring(0, 30)); // Limit length
    const encodedQuotationId = encodeURIComponent(quotationId);
    
    return `${baseUrl}/qr-scanner?ref=${simpleRef}&item=${encodedItemName}&q=${encodedQuotationId}`;
};

/**
 * Create a QR code scanner page URL (legacy method - kept for compatibility)
 * @param {string} imageUrl - The image URL to display
 * @param {string} itemName - The item name
 * @param {string} quotationId - The quotation ID
 * @returns {string} - URL for the QR scanner page
 */
export const createQRScannerURL = (imageUrl, itemName, quotationId) => {
    return createSimpleScannerURL(imageUrl, itemName, quotationId);
};

/**
 * Generate a simple text-based QR code for basic data
 * @param {string} text - The text to encode
 * @param {number} size - The size of the QR code
 * @returns {Promise<string>} - Promise that resolves to data URL for the QR code
 */
export const generateTextQRCode = async (text, size = 100) => {
    try {
        // Check if text is too long for QR code
        if (text.length > 500) {
            // Truncate very long text
            text = text.substring(0, 500) + '...';
        }

        const qrCodeDataUrl = await QRCode.toDataURL(text, {
            width: size,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            errorCorrectionLevel: 'L' // Low error correction for text
        });

        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating text QR code:', error);
        return generateFallbackQRCode(size);
    }
};

/**
 * Generate a fallback QR code when the main generation fails
 * @param {number} size - The size of the QR code
 * @returns {string} - Data URL for a fallback QR code
 */
const generateFallbackQRCode = (size = 100) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;

    // Fill white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // Draw black border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, size - 2, size - 2);

    // Add error text
    ctx.fillStyle = '#FF0000';
    ctx.font = `${Math.max(8, size / 12)}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('QR ERROR', size / 2, size / 2);

    return canvas.toDataURL();
};
