import { generateScannerQRCode, generateTestQRCode } from './qrCodeGenerator';
import { compressImage, needsCompression } from './imageOptimizer';
import { storage } from '../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Migrate quotation items from base64 images to Firebase Storage URLs
 * This prevents Firestore document size limit issues
 */
export const migrateQuotationItems = async (items, quotationId) => {
    if (!items || items.length === 0) return items;
    
    const migratedItems = [];
    
    for (const item of items) {
        if (item.images && item.images.length > 0) {
            const migratedImages = [];
            
            for (const image of item.images) {
                if (image.url && image.url.startsWith('data:image')) {
                    try {
                        // Convert base64 to blob
                        const response = await fetch(image.url);
                        const blob = await response.blob();
                        
                        // Upload to Firebase Storage
                        const storageRef = ref(storage, `quotations/${quotationId}/migrated/${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
                        await uploadBytes(storageRef, blob);
                        const downloadURL = await getDownloadURL(storageRef);
                        
                        // Generate new QR code
                        let qrCodeUrl = '';
                        try {
                            qrCodeUrl = await generateScannerQRCode(
                                downloadURL,
                                item.name || 'Unknown Item',
                                quotationId,
                                100
                            );
                        } catch (qrError) {
                            console.error('Error generating QR code for migrated image:', qrError);
                            try {
                                const fallbackText = `${item.name || 'Unknown Item'} - ${image.name}`;
                                qrCodeUrl = await generateTestQRCode(fallbackText, 100);
                            } catch (fallbackError) {
                                console.error('Fallback QR generation also failed:', fallbackError);
                            }
                        }
                        
                        // Create migrated image object
                        const migratedImage = {
                            ...image,
                            url: downloadURL,
                            qrCodeUrl: qrCodeUrl,
                            migrated: true,
                            originalBase64: image.url // Keep reference to original for rollback if needed
                        };
                        
                        migratedImages.push(migratedImage);
                        console.log(`Migrated image: ${image.name} for item: ${item.name}`);
                        
                    } catch (error) {
                        console.error(`Error migrating image ${image.name}:`, error);
                        // Keep original image if migration fails
                        migratedImages.push(image);
                    }
                } else {
                    migratedImages.push(image);
                }
            }
            
            // Update item with migrated images
            const migratedItem = {
                ...item,
                images: migratedImages,
                imageUrl: migratedImages.length > 0 ? migratedImages[0].url : '',
                qrCodeUrl: migratedImages.length > 0 ? migratedImages[0].qrCodeUrl : ''
            };
            
            migratedItems.push(migratedItem);
        } else {
            migratedItems.push(item);
        }
    }
    
    return migratedItems;
};

/**
 * Check if a quotation needs migration
 */
export const needsMigration = (quotation) => {
    if (!quotation || !quotation.items) return false;
    
    return quotation.items.some(item => 
        item.images && item.images.some(img => 
            img.url && img.url.startsWith('data:image')
        )
    );
};

/**
 * Get migration statistics for a quotation
 */
export const getMigrationStats = (quotation) => {
    if (!quotation || !quotation.items) return { total: 0, migrated: 0, needsMigration: 0 };
    
    let total = 0;
    let migrated = 0;
    let needsMigration = 0;
    
    quotation.items.forEach(item => {
        if (item.images) {
            item.images.forEach(img => {
                total++;
                if (img.migrated) {
                    migrated++;
                } else if (img.url && img.url.startsWith('data:image')) {
                    needsMigration++;
                }
            });
        }
    });
    
    return { total, migrated, needsMigration };
};

/**
 * Batch migrate multiple quotations
 */
export const batchMigrateQuotations = async (quotations) => {
    const results = [];
    
    for (const quotation of quotations) {
        if (needsMigration(quotation)) {
            try {
                const migratedItems = await migrateQuotationItems(quotation.items, quotation.id);
                results.push({
                    id: quotation.id,
                    success: true,
                    migratedItems,
                    originalSize: JSON.stringify(quotation).length,
                    newSize: JSON.stringify({ ...quotation, items: migratedItems }).length
                });
            } catch (error) {
                results.push({
                    id: quotation.id,
                    success: false,
                    error: error.message
                });
            }
        } else {
            results.push({
                id: quotation.id,
                success: true,
                migratedItems: quotation.items,
                skipped: true
            });
        }
    }
    
    return results;
};
