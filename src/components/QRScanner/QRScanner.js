import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const ScannerContainer = styled.div`
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const ContentCard = styled.div`
    background: white;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    width: 100%;
    text-align: center;
`;

const Header = styled.h1`
    color: #333;
    margin-bottom: 30px;
    font-size: 2.5rem;
    font-weight: 700;
`;

const ItemInfo = styled.div`
    background: #f8f9fa;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 30px;
    border-left: 4px solid #667eea;
`;

const ItemName = styled.h2`
    color: #333;
    margin: 0 0 10px 0;
    font-size: 1.5rem;
    font-weight: 600;
`;

const QuotationId = styled.p`
    color: #666;
    margin: 0;
    font-size: 1rem;
    font-family: 'Courier New', monospace;
`;

const ImageContainer = styled.div`
    margin: 30px 0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
`;

const ItemImage = styled.img`
    width: 100%;
    max-width: 500px;
    height: auto;
    display: block;
`;

const Message = styled.div`
    color: #666;
    font-size: 1.1rem;
    line-height: 1.6;
    margin-top: 20px;
`;

const ErrorMessage = styled.div`
    color: #dc3545;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
`;

const LoadingSpinner = styled.div`
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 20px auto;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

const QRScanner = () => {
    const location = useLocation();
    const [itemData, setItemData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const imageUrl = searchParams.get('image'); // Direct image URL
        const imageRef = searchParams.get('ref'); // Simple reference for base64 images
        const itemName = searchParams.get('item');
        const quotationId = searchParams.get('quotation') || searchParams.get('q');

        console.log('QR Scanner - URL Parameters:', {
            imageUrl,
            imageRef,
            itemName,
            quotationId,
            fullUrl: location.search
        });

        if (!itemName || !quotationId) {
            setError('Missing required parameters. Please scan the QR code again.');
            setLoading(false);
            return;
        }

        // Decode the URL parameters
        const decodedItemName = decodeURIComponent(itemName);
        const decodedQuotationId = decodeURIComponent(quotationId);

        // Validate the quotation ID format
        console.log('Quotation ID validation:', {
            original: quotationId,
            decoded: decodedQuotationId,
            length: decodedQuotationId.length,
            isValid: decodedQuotationId.length > 0 && decodedQuotationId.length < 100
        });

        if (decodedQuotationId.length === 0 || decodedQuotationId.length > 100) {
            setError('Invalid quotation ID format. Please scan the QR code again.');
            setLoading(false);
            return;
        }

        console.log('QR Scanner - Decoded Parameters:', {
            decodedItemName,
            decodedQuotationId
        });

        // If we have a reference (base64 image), we need to fetch the image data
        if (imageRef) {
            console.log('QR Scanner - Using reference approach with:', { imageRef, decodedItemName, decodedQuotationId });
            fetchImageFromReference(imageRef, decodedItemName, decodedQuotationId);
        } else if (imageUrl) {
            // Direct image URL (regular images)
            const decodedImageUrl = decodeURIComponent(imageUrl);
            console.log('QR Scanner - Using direct image URL approach');
            setItemData({
                imageUrl: decodedImageUrl,
                name: decodedItemName,
                quotationId: decodedQuotationId
            });
            setLoading(false);
        } else {
            setError('Missing image data. Please scan the QR code again.');
            setLoading(false);
        }
    }, [location]);

    const fetchImageFromReference = async (imageRef, itemName, quotationId) => {
        try {
            setLoading(true);
            
            console.log('Fetching image data for:', { imageRef, itemName, quotationId });
            console.log('Firebase query details:', { collection: 'quotations', documentId: quotationId });
            console.log('Firebase db object:', db);
            
            // Test Firebase connection first
            try {
                console.log('Testing Firebase connection...');
                const testCollection = collection(db, 'quotations');
                console.log('Test collection reference created:', testCollection);
            } catch (firebaseError) {
                console.error('Firebase connection test failed:', firebaseError);
                setError('Firebase connection failed. Please check your internet connection and try again.');
                setLoading(false);
                return;
            }
            
            // Fetch the quotation data from Firestore
            const quotationDoc = await getDoc(doc(db, 'quotations', quotationId));
            
            console.log('Firebase query result:', {
                exists: quotationDoc.exists(),
                id: quotationDoc.id,
                hasData: !!quotationDoc.data()
            });
            
            if (!quotationDoc.exists()) {
                console.error('Quotation document not found in Firebase');
                
                // Try to find the quotation by customId if the direct ID doesn't work
                console.log('Trying to find quotation by customId...');
                try {
                    const quotationsRef = collection(db, 'quotations');
                    const q = query(quotationsRef, where('customId', '==', quotationId));
                    const querySnapshot = await getDocs(q);
                    
                    if (!querySnapshot.empty) {
                        console.log('Found quotation by customId:', querySnapshot.docs[0].id);
                        const foundQuotation = querySnapshot.docs[0];
                        const quotationData = foundQuotation.data();
                        
                        // Continue with the found quotation
                        console.log('Quotation data loaded by customId:', quotationData);
                        
                        // Find the item with the matching reference
                        const item = quotationData.items?.find(item => {
                            if (item.images && item.images.length > 0) {
                                return item.images.some(image => {
                                    const itemRef = generateSimpleReference(item.name, foundQuotation.id);
                                    return itemRef === imageRef;
                                });
                            } else if (item.imageUrl) {
                                const itemRef = generateSimpleReference(item.name, foundQuotation.id);
                                return itemRef === imageRef;
                            }
                            return false;
                        });
                        
                        if (item) {
                            console.log('Found item by customId lookup:', item);
                            
                            // Get the image URL from the item
                            let imageUrl = null;
                            if (item.images && item.images.length > 0) {
                                imageUrl = item.images[0].url || item.images[0].imageUrl;
                                console.log('Using image from images array (customId lookup):', item.images[0]);
                            } else if (item.imageUrl) {
                                imageUrl = item.imageUrl;
                                console.log('Using single imageUrl (customId lookup):', item.imageUrl);
                            }

                            if (imageUrl) {
                                setItemData({
                                    imageUrl: imageUrl,
                                    name: item.name || itemName,
                                    quotationId: foundQuotation.id
                                });
                                setLoading(false);
                                return;
                            }
                        }
                    }
                } catch (customIdError) {
                    console.error('CustomId lookup failed:', customIdError);
                }
                
                setError('Quotation not found. It may have been deleted or moved.');
                setLoading(false);
                return;
            }

            const quotationData = quotationDoc.data();
            console.log('Quotation data loaded:', quotationData);
            
            // Find the item with the matching reference
            // Look for items with images (either base64 or Firebase Storage URLs)
            const item = quotationData.items?.find(item => {
                if (item.images && item.images.length > 0) {
                    // Check if any image in the item matches the reference
                    return item.images.some(image => {
                        const itemRef = generateSimpleReference(item.name, quotationId);
                        return itemRef === imageRef;
                    });
                } else if (item.imageUrl) {
                    // Check the single imageUrl
                    const itemRef = generateSimpleReference(item.name, quotationId);
                    return itemRef === imageRef;
                }
                return false;
            });
            
            console.log('Found item:', item);

            if (!item) {
                setError('Item not found. It may have been removed from the quotation.');
                setLoading(false);
                return;
            }

            // Get the image URL from the item
            let imageUrl = null;
            if (item.images && item.images.length > 0) {
                // Use the first image from the images array
                imageUrl = item.images[0].url || item.images[0].imageUrl;
                console.log('Using image from images array:', item.images[0]);
            } else if (item.imageUrl) {
                // Use the single imageUrl
                imageUrl = item.imageUrl;
                console.log('Using single imageUrl:', item.imageUrl);
            }

            console.log('Final imageUrl:', imageUrl);

            if (!imageUrl) {
                setError('Image not found. It may have been removed from the quotation.');
                setLoading(false);
                return;
            }

            setItemData({
                imageUrl: imageUrl,
                name: item.name || itemName,
                quotationId: quotationId
            });
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching image data:', error);
            setError('Failed to load image data. Please try again later.');
            setLoading(false);
        }
    };

    // Generate the same simple reference that was used in the QR code
    const generateSimpleReference = (itemName, quotationId) => {
        return `${itemName.replace(/[^a-zA-Z0-9]/g, '')}_${quotationId}`;
    };

    if (loading) {
        return (
            <ScannerContainer>
                <ContentCard>
                    <LoadingSpinner />
                    <Message>Loading item details...</Message>
                </ContentCard>
            </ScannerContainer>
        );
    }

    if (error) {
        return (
            <ScannerContainer>
                <ContentCard>
                    <Header>QR Scanner</Header>
                    <ErrorMessage>
                        <strong>Error:</strong> {error}
                    </ErrorMessage>
                    <Message>
                        Please ensure you're scanning a valid QR code from a quotation.
                    </Message>
                </ContentCard>
            </ScannerContainer>
        );
    }

    return (
        <ScannerContainer>
            <ContentCard>
                <Header>Item Details</Header>
                
                <ItemInfo>
                    <ItemName>{itemData.name}</ItemName>
                    <QuotationId>Quotation ID: {itemData.quotationId}</QuotationId>
                </ItemInfo>

                <ImageContainer>
                                    <ItemImage 
                    src={itemData.imageUrl} 
                    alt={itemData.name}
                    onError={(e) => {
                        console.error('Image load error:', e);
                        setError('Failed to load image. The image may have been removed or is no longer available. Please check the image URL or regenerate the quotation.');
                    }}
                />
                </ImageContainer>

                <Message>
                    This is the product image from your quotation. 
                    You can save this image or share it with your team for reference.
                </Message>
            </ContentCard>
        </ScannerContainer>
    );
};

export default QRScanner;
