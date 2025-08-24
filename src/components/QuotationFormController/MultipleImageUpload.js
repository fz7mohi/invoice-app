import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Icon from '../shared/Icon/Icon';
import { compressImage, validateImageFile, needsCompressionBySize } from '../../utilities/imageOptimizer';
import { generateScannerQRCode, generateTestQRCode } from '../../utilities/qrCodeGenerator';
import { storage } from '../../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Loading spinner animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

const ImageUploadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  background: #7C5DFA;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 120px;
  
  &:hover:not(:disabled) {
    background: #6B4CDB;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #B8B8B8;
    cursor: not-allowed;
    transform: none;
  }
`;

const ImageList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
`;

const ImageItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 2px dashed #E0E0E0;
  border-radius: 8px;
  background: #FAFAFA;
  min-width: 120px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #7C5DFA;
    background: #F8F7FF;
  }
`;

const ImagePreview = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #E0E0E0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const QRCodePreview = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #E0E0E0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageInfo = styled.div`
  text-align: center;
  font-size: 11px;
  color: #666;
  max-width: 100%;
  overflow: hidden;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #FF6B6B;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s ease;
  z-index: 10;
  
  &:hover {
    background: #FF5252;
    transform: scale(1.1);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #7C5DFA;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const ErrorMessage = styled.div`
  color: #FF6B6B;
  font-size: 11px;
  text-align: center;
  margin-top: 4px;
  padding: 4px 8px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 4px;
`;

const MultipleImageUpload = ({ 
    images = [], 
    onImagesChange, 
    itemName, 
    itemIndex,
    quotationId = 'temp',
    itemPrice,
    itemDescription,
    itemLeadTime,
    itemQuantity,
    itemTotal,
    currency = 'USD'
}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    // Initialize with existing images
    useEffect(() => {
        if (images && images.length > 0) {
            console.log(`Initialized with ${images.length} existing images for item: ${itemName}`);
            
            // Check if any images need migration from base64 to Firebase Storage
            const needsMigration = images.some(img => img.url && img.url.startsWith('data:image'));
            if (needsMigration) {
                console.log('Some images need migration from base64 to Firebase Storage');
                migrateBase64Images(images);
            }
        }
    }, [images, itemName]);

    // Function to migrate base64 images to Firebase Storage
    const migrateBase64Images = async (existingImages) => {
        try {
            const migratedImages = [];
            
            for (const image of existingImages) {
                if (image.url && image.url.startsWith('data:image')) {
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
                            itemName || `Item ${itemIndex + 1}`,
                            quotationId,
                            100
                        );
                    } catch (qrError) {
                        console.error('Error generating QR code for migrated image:', qrError);
                        try {
                            const fallbackText = `${itemName || `Item ${itemIndex + 1}`} - ${image.name}`;
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
                        migrated: true
                    };
                    
                    migratedImages.push(migratedImage);
                    console.log(`Migrated image: ${image.name}`);
                } else {
                    migratedImages.push(image);
                }
            }
            
            // Update the images with migrated versions
            if (migratedImages.some(img => img.migrated)) {
                onImagesChange(migratedImages);
                console.log('Images migrated successfully');
            }
            
        } catch (error) {
            console.error('Error migrating images:', error);
            setError('Error migrating existing images. Please try again.');
        }
    };

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        setIsProcessing(true);
        setError('');

        try {
            const newImages = [];
            
            for (const file of files) {
                // Validate each file
                const validation = validateImageFile(file, 5); // 5MB limit
                if (!validation.isValid) {
                    setError(`Invalid file: ${file.name} - ${validation.message}`);
                    continue;
                }

                let fileToUpload = file;
                
                // Compress image if it's too large
                if (needsCompressionBySize(file.size, 500)) {
                    console.log(`Compressing large image: ${file.name}`);
                    // Convert to base64 for compression
                    const base64Data = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (e) => resolve(e.target.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                    
                    const compressedBase64 = await compressImage(base64Data, 800, 800, 0.8);
                    
                    // Convert compressed base64 back to File object
                    const response = await fetch(compressedBase64);
                    fileToUpload = await response.blob();
                }
                
                // Upload file to Firebase Storage
                const storageRef = ref(storage, `quotations/${quotationId}/images/${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
                await uploadBytes(storageRef, fileToUpload);
                const downloadURL = await getDownloadURL(storageRef);
                
                // Generate QR code for the image
                let qrCodeUrl = '';
                try {
                    qrCodeUrl = await generateScannerQRCode(
                        downloadURL,
                        itemName || `Item ${itemIndex + 1}`,
                        quotationId,
                        100
                    );
                } catch (qrError) {
                    console.error('Error generating QR code:', qrError);
                    // Try fallback QR code
                    try {
                        const fallbackText = `${itemName || `Item ${itemIndex + 1}`} - ${file.name}`;
                        qrCodeUrl = await generateTestQRCode(fallbackText, 100);
                    } catch (fallbackError) {
                        console.error('Fallback QR generation also failed:', fallbackError);
                    }
                }
                
                // Create image object
                const imageObj = {
                    id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    name: file.name,
                    url: downloadURL,
                    qrCodeUrl: qrCodeUrl,
                    size: file.size,
                    type: file.type,
                    uploadedAt: new Date().toISOString()
                };
                
                newImages.push(imageObj);
                console.log(`Processed image: ${file.name}`);
            }
            
            // Update images
            const updatedImages = [...images, ...newImages];
            onImagesChange(updatedImages);
            
        } catch (error) {
            console.error('Error uploading images:', error);
            setError('Error uploading images. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const removeImage = (imageId) => {
        const updatedImages = images.filter(img => img.id !== imageId);
        onImagesChange(updatedImages);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            // Create a fake event object for handleImageUpload
            const fakeEvent = { target: { files } };
            handleImageUpload(fakeEvent);
        }
    };

    const openImageWindow = (image) => {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${image.name} - Item Image</title>
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            min-height: 100vh;
                            padding: 20px;
                            color: #333;
                        }
                        
                        .container {
                            max-width: 100%;
                            margin: 0 auto;
                            background: white;
                            border-radius: 20px;
                            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                            overflow: hidden;
                        }
                        
                        .header {
                            background: linear-gradient(135deg, #7C5DFA 0%, #6B4CDB 100%);
                            color: white;
                            padding: 25px 20px;
                            text-align: center;
                            position: relative;
                        }
                        
                        .header::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                            opacity: 0.3;
                        }
                        
                        .header h1 {
                            font-size: 1.5rem;
                            font-weight: 700;
                            margin-bottom: 8px;
                            position: relative;
                            z-index: 1;
                        }
                        
                        .header .subtitle {
                            font-size: 0.9rem;
                            opacity: 0.9;
                            position: relative;
                            z-index: 1;
                        }
                        
                        .content {
                            padding: 25px 20px;
                        }
                        
                        .image-section {
                            text-align: center;
                            margin-bottom: 25px;
                        }
                        
                        .image-container {
                            background: #f8f9fa;
                            border-radius: 15px;
                            padding: 20px;
                            margin-bottom: 20px;
                            border: 2px dashed #e9ecef;
                        }
                        
                        .image-display {
                            max-width: 100%;
                            height: auto;
                            border-radius: 12px;
                            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                            transition: transform 0.3s ease;
                        }
                        
                        .image-display:hover {
                            transform: scale(1.02);
                        }
                        
                        .item-info {
                            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                            border-radius: 15px;
                            padding: 25px;
                            margin-bottom: 25px;
                            border: 1px solid #e9ecef;
                        }
                        
                        .info-item {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 16px 20px;
                            background: white;
                            border-radius: 10px;
                            margin-bottom: 12px;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                            border-left: 4px solid #7C5DFA;
                        }
                        
                        .info-item:last-child {
                            margin-bottom: 0;
                        }
                        
                        .info-label {
                            font-size: 0.8rem;
                            color: #6c757d;
                            font-weight: 600;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        }
                        
                        .info-value {
                            font-size: 1rem;
                            font-weight: 600;
                            color: #2c3e50;
                            text-align: right;
                        }
                        
                        .price-info {
                            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                            color: white;
                            padding: 20px;
                            border-radius: 15px;
                            text-align: center;
                            margin-bottom: 25px;
                            box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
                        }
                        
                        .price-main {
                            font-size: 2.2rem;
                            font-weight: 800;
                            margin-bottom: 8px;
                        }
                        
                        .price-details {
                            font-size: 0.9rem;
                            opacity: 0.9;
                            line-height: 1.4;
                        }
                        
                        .metadata {
                            background: #e9ecef;
                            border-radius: 10px;
                            padding: 15px;
                            font-size: 0.8rem;
                            color: #6c757d;
                            text-align: center;
                        }
                        
                        .close-btn {
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            background: rgba(255,255,255,0.2);
                            border: none;
                            color: white;
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                            cursor: pointer;
                            font-size: 1.2rem;
                            backdrop-filter: blur(10px);
                            transition: all 0.3s ease;
                        }
                        
                        .close-btn:hover {
                            background: rgba(255,255,255,0.3);
                            transform: scale(1.1);
                        }
                        
                                                 @media (max-width: 768px) {
                             body {
                                 padding: 10px;
                             }
                             
                             .container {
                                 border-radius: 15px;
                             }
                             
                             .header {
                                 padding: 20px 15px;
                             }
                             
                             .header h1 {
                                 font-size: 1.3rem;
                             }
                             
                             .content {
                                 padding: 20px 15px;
                             }
                             
                             .info-item {
                                 padding: 14px 18px;
                             }
                             
                             .close-btn {
                                 top: 15px;
                                 right: 15px;
                                 width: 35px;
                                 height: 35px;
                             }
                         }
                         
                         @media (max-width: 480px) {
                             .header h1 {
                                 font-size: 1.1rem;
                             }
                             
                             .content {
                                 padding: 15px 10px;
                             }
                             
                             .image-container {
                                 padding: 15px;
                             }
                             
                             .item-info {
                                 padding: 20px;
                             }
                             

                         }
                    </style>
                </head>
                <body>
                    <button class="close-btn" onclick="window.close()">×</button>
                    <div class="container">
                        <div class="header">
                            <h1>${itemName || 'Unknown Item'}</h1>
                            <div class="subtitle">Item Details & Image</div>
                        </div>
                        
                        <div class="content">
                            <div class="image-section">
                                <div class="image-container">
                                    <img src="${image.url}" alt="${image.name}" class="image-display" />
                                </div>
                            </div>
                            
                                                         <div class="item-info">
                                 ${itemName ? `
                                 <div class="info-item">
                                     <div class="info-label">Item Name</div>
                                     <div class="info-value">${itemName}</div>
                                 </div>
                                 ` : ''}
                                 
                                 ${itemDescription ? `
                                 <div class="info-item">
                                     <div class="info-label">Description</div>
                                     <div class="info-value">${itemDescription}</div>
                                 </div>
                                 ` : ''}
                                 
                                 ${itemLeadTime ? `
                                 <div class="info-item">
                                     <div class="info-label">Lead Time</div>
                                     <div class="info-value">${itemLeadTime}</div>
                                 </div>
                                 ` : ''}
                                 
                                 ${itemPrice ? `
                                 <div class="info-item">
                                     <div class="info-label">Price</div>
                                     <div class="info-value">${itemPrice} ${currency}</div>
                                 </div>
                                 ` : ''}
                                 
                                 ${itemQuantity ? `
                                 <div class="info-item">
                                     <div class="info-label">Quantity</div>
                                     <div class="info-value">${itemQuantity}</div>
                                 </div>
                                 ` : ''}
                                 
                                 ${itemTotal ? `
                                 <div class="info-item">
                                     <div class="info-label">Total</div>
                                     <div class="info-value">${itemTotal} ${currency}</div>
                                 </div>
                                 ` : ''}
                             </div>
                            
                            <div class="metadata">
                                <strong>Image:</strong> ${image.name} | 
                                <strong>Quotation ID:</strong> ${quotationId} | 
                                <strong>Generated:</strong> ${new Date().toLocaleString()}
                            </div>
                        </div>
                    </div>
                    
                    <script>
                        // Add smooth animations
                        document.addEventListener('DOMContentLoaded', function() {
                            const container = document.querySelector('.container');
                            container.style.opacity = '0';
                            container.style.transform = 'translateY(20px)';
                            
                            setTimeout(() => {
                                container.style.transition = 'all 0.6s ease';
                                container.style.opacity = '1';
                                container.style.transform = 'translateY(0)';
                            }, 100);
                        });
                        
                        // Add keyboard support
                        document.addEventListener('keydown', function(e) {
                            if (e.key === 'Escape') {
                                window.close();
                            }
                        });
                    </script>
                </body>
                </html>
            `);
            newWindow.document.close();
        }
    };

    return (
        <ImageUploadContainer>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <ImageUploadButton
                    type="button"
                    onClick={() => document.getElementById(`file-input-${itemIndex}`).click()}
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <Icon name="image" size={14} />
                            Add Images
                        </>
                    )}
                </ImageUploadButton>
                
                <HiddenInput
                    id={`file-input-${itemIndex}`}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                />
            </div>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {images && images.length > 0 && (
                <ImageList>
                    {images.map((image, index) => (
                        <ImageItem key={image.id || index}>
                            <RemoveButton
                                onClick={() => removeImage(image.id)}
                                title="Remove image"
                            >
                                ×
                            </RemoveButton>
                            
                            {image.qrCodeUrl ? (
                                <QRCodePreview>
                                    <div style={{ position: 'relative' }}>
                                        <img 
                                            src={image.qrCodeUrl} 
                                            alt={`QR Code for ${image.name}`}
                                            title="Click to open image or scan QR code"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => openImageWindow(image)}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '2px',
                                            right: '2px',
                                            background: 'rgba(0,0,0,0.7)',
                                            color: 'white',
                                            fontSize: '8px',
                                            padding: '2px 4px',
                                            borderRadius: '3px',
                                            pointerEvents: 'none'
                                        }}>
                                            CLICK
                                        </div>
                                    </div>
                                </QRCodePreview>
                            ) : (
                                <ImagePreview>
                                    <div style={{ position: 'relative' }}>
                                        <img 
                                            src={image.url} 
                                            alt={image.name}
                                            title={`Click to open ${image.name}`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => openImageWindow(image)}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '2px',
                                            right: '2px',
                                            background: 'rgba(0,0,0,0.7)',
                                            color: 'white',
                                            fontSize: '8px',
                                            padding: '2px 4px',
                                            borderRadius: '3px',
                                            pointerEvents: 'none'
                                        }}>
                                            CLICK
                                        </div>
                                    </div>
                                </ImagePreview>
                            )}
                            
                            <ImageInfo>
                                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                                    {image.name.length > 15 ? `${image.name.substring(0, 15)}...` : image.name}
                                </div>
                                <div style={{ fontSize: '10px', color: '#999' }}>
                                    {Math.round(image.size / 1024)}KB
                                </div>
                            </ImageInfo>
                        </ImageItem>
                    ))}
                </ImageList>
            )}

            {/* Drag & Drop Zone */}
            <div
                style={{
                    border: '2px dashed #E0E0E0',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    color: '#666',
                    fontSize: '12px',
                    background: '#FAFAFA',
                    marginTop: '8px'
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <Icon name="image" size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <div>Drag & drop images here or click "Add Images" above</div>
                <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.7 }}>
                    Supports JPEG, PNG, WebP (max 5MB each)
                </div>
                <div style={{ fontSize: '10px', marginTop: '8px', opacity: 0.6, color: '#7C5DFA' }}>
                    💡 QR codes can be clicked to view images directly
                </div>
            </div>
        </ImageUploadContainer>
    );
};

export default MultipleImageUpload;
