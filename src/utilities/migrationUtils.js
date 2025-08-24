/**
 * Migration utilities for updating existing quotations with QR codes
 * This helps populate QR codes for items that were created before QR code storage was implemented
 */

import { generateScannerQRCode, generateTextQRCode } from './qrCodeGenerator';
import { compressImage, needsCompression } from './imageOptimizer';

/**
 * Migrate existing quotation items to include QR codes
 * @param {Array} items - Array of quotation items
 * @param {string} quotationId - The quotation ID
 * @returns {Promise<Array>} - Updated items with QR codes
 */
export const migrateQuotationItems = async (items, quotationId) => {
    if (!items || !Array.isArray(items)) return items;
    
    const migratedItems = [];
    
    for (const item of items) {
        const migratedItem = { ...item };
        
        // Add qrCodeUrl field if it doesn't exist
        if (!migratedItem.qrCodeUrl) {
            migratedItem.qrCodeUrl = '';
        }
        
        // Generate QR code for items with images but no QR codes
        if (item.imageUrl && !item.qrCodeUrl) {
            try {
                console.log(`Migrating item: ${item.name}`);
                
                // Optimize image if needed
                let optimizedImage = item.imageUrl;
                if (needsCompression(item.imageUrl, 500)) {
                    console.log(`Compressing image for item: ${item.name}`);
                    optimizedImage = await compressImage(item.imageUrl, 800, 800, 0.8);
                }
                
                // Generate QR code
                const qrCode = await generateScannerQRCode(
                    optimizedImage,
                    item.name,
                    quotationId,
                    100
                );
                
                migratedItem.qrCodeUrl = qrCode;
                migratedItem.imageUrl = optimizedImage; // Use optimized image
                
                console.log(`Successfully migrated item: ${item.name}`);
                
            } catch (error) {
                console.error(`Error migrating item ${item.name}:`, error);
                
                // Try fallback QR code
                try {
                    const fallbackText = `${item.name} - ${quotationId}`;
                    const fallbackQR = await generateTextQRCode(fallbackText, 100);
                    migratedItem.qrCodeUrl = fallbackQR;
                    console.log(`Fallback QR generated for item: ${item.name}`);
                } catch (fallbackError) {
                    console.error(`Fallback QR generation failed for item ${item.name}:`, fallbackError);
                    migratedItem.qrCodeUrl = '';
                }
            }
        }
        
        migratedItems.push(migratedItem);
    }
    
    return migratedItems;
};

/**
 * Check if a quotation needs migration
 * @param {Object} quotation - The quotation object
 * @returns {boolean} - True if migration is needed
 */
export const needsMigration = (quotation) => {
    if (!quotation?.items || !Array.isArray(quotation.items)) return false;
    
    return quotation.items.some(item => 
        item.imageUrl && !item.qrCodeUrl
    );
};

/**
 * Get migration statistics for a quotation
 * @param {Object} quotation - The quotation object
 * @returns {Object} - Migration statistics
 */
export const getMigrationStats = (quotation) => {
    if (!quotation?.items || !Array.isArray(quotation.items)) {
        return { total: 0, needsMigration: 0, migrated: 0 };
    }
    
    const total = quotation.items.length;
    const needsMigration = quotation.items.filter(item => 
        item.imageUrl && !item.qrCodeUrl
    ).length;
    const migrated = quotation.items.filter(item => 
        item.qrCodeUrl
    ).length;
    
    return { total, needsMigration, migrated };
};

/**
 * Batch migrate multiple quotations
 * @param {Array} quotations - Array of quotations
 * @returns {Promise<Array>} - Updated quotations with migrated items
 */
export const batchMigrateQuotations = async (quotations) => {
    if (!quotations || !Array.isArray(quotations)) return quotations;
    
    const migratedQuotations = [];
    
    for (const quotation of quotations) {
        if (needsMigration(quotation)) {
            console.log(`Migrating quotation: ${quotation.customId || quotation.id}`);
            
            const migratedItems = await migrateQuotationItems(quotation.items, quotation.id);
            const migratedQuotation = {
                ...quotation,
                items: migratedItems
            };
            
            migratedQuotations.push(migratedQuotation);
            console.log(`Successfully migrated quotation: ${quotation.customId || quotation.id}`);
        } else {
            migratedQuotations.push(quotation);
        }
    }
    
    return migratedQuotations;
};
