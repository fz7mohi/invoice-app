/**
 * Image optimization utilities for reducing file sizes before database storage
 * Helps prevent Firestore document size limits and improves performance
 */

/**
 * Compress and resize an image to reduce file size
 * @param {string} base64Data - The original base64 image data
 * @param {number} maxWidth - Maximum width in pixels (default: 800)
 * @param {number} maxHeight - Maximum height in pixels (default: 800)
 * @param {number} quality - JPEG quality 0-1 (default: 0.8)
 * @returns {Promise<string>} - Compressed base64 data URL
 */
export const compressImage = (base64Data, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Calculate new dimensions maintaining aspect ratio
                    let { width, height } = img;
                    
                    if (width > maxWidth || height > maxHeight) {
                        const ratio = Math.min(maxWidth / width, maxHeight / height);
                        width = Math.round(width * ratio);
                        height = Math.round(height * ratio);
                    }
                    
                    // Set canvas dimensions
                    canvas.width = width;
                    canvas.height = height;
                    
                    // Draw and compress image
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Convert to compressed JPEG
                    const compressedData = canvas.toDataURL('image/jpeg', quality);
                    
                    // Calculate size reduction
                    const originalSize = Math.round(base64Data.length * 0.75); // Approximate base64 to bytes
                    const compressedSize = Math.round(compressedData.length * 0.75);
                    const reduction = Math.round(((originalSize - compressedSize) / originalSize) * 100);
                    
                    console.log(`Image compressed: ${originalSize}KB → ${compressedSize}KB (${reduction}% reduction)`);
                    
                    resolve(compressedData);
                } catch (error) {
                    console.error('Error compressing image:', error);
                    // Return original if compression fails
                    resolve(base64Data);
                }
            };
            
            img.onerror = () => {
                console.error('Error loading image for compression');
                resolve(base64Data); // Return original if loading fails
            };
            
            img.src = base64Data;
        } catch (error) {
            console.error('Error in compressImage:', error);
            resolve(base64Data); // Return original if any error occurs
        }
    });
};

/**
 * Check if an image needs compression based on size
 * @param {string} base64Data - The base64 image data
 * @param {number} maxSizeKB - Maximum size in KB (default: 500KB)
 * @returns {boolean} - True if compression is needed
 */
export const needsCompression = (base64Data, maxSizeKB = 500) => {
    const sizeInKB = Math.round(base64Data.length * 0.75 / 1024);
    return sizeInKB > maxSizeKB;
};

/**
 * Check if a file needs compression based on file size
 * @param {number} fileSizeBytes - The file size in bytes
 * @param {number} maxSizeKB - Maximum size in KB (default: 500KB)
 * @returns {boolean} - True if compression is needed
 */
export const needsCompressionBySize = (fileSizeBytes, maxSizeKB = 500) => {
    const sizeInKB = Math.round(fileSizeBytes / 1024);
    return sizeInKB > maxSizeKB;
};

/**
 * Get image dimensions from base64 data
 * @param {string} base64Data - The base64 image data
 * @returns {Promise<{width: number, height: number}>} - Image dimensions
 */
export const getImageDimensions = (base64Data) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
        };
        img.onerror = reject;
        img.src = base64Data;
    });
};

/**
 * Validate image file before processing
 * @param {File} file - The file to validate
 * @param {number} maxSizeMB - Maximum file size in MB (default: 5MB)
 * @returns {object} - Validation result with isValid and message
 */
export const validateImageFile = (file, maxSizeMB = 5) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            message: 'Only JPEG, PNG, and WebP images are allowed'
        };
    }
    
    if (file.size > maxSizeBytes) {
        return {
            isValid: false,
            message: `Image size must be less than ${maxSizeMB}MB`
        };
    }
    
    return { isValid: true, message: 'Image is valid' };
};

/**
 * Create a thumbnail version of an image for preview
 * @param {string} base64Data - The base64 image data
 * @param {number} size - Thumbnail size in pixels (default: 150)
 * @returns {Promise<string>} - Thumbnail base64 data URL
 */
export const createThumbnail = (base64Data, size = 150) => {
    return new Promise((resolve, reject) => {
        try {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = size;
                canvas.height = size;
                
                // Calculate thumbnail dimensions maintaining aspect ratio
                const ratio = Math.min(size / img.width, size / img.height);
                const thumbWidth = Math.round(img.width * ratio);
                const thumbHeight = Math.round(img.height * ratio);
                
                // Center the thumbnail
                const x = (size - thumbWidth) / 2;
                const y = (size - thumbHeight) / 2;
                
                ctx.drawImage(img, x, y, thumbWidth, thumbHeight);
                const thumbnailData = canvas.toDataURL('image/jpeg', 0.9);
                
                resolve(thumbnailData);
            };
            
            img.onerror = reject;
            img.src = base64Data;
        } catch (error) {
            reject(error);
        }
    });
};
