import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { doc, getDoc } from 'firebase/firestore';
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

        if (!itemName || !quotationId) {
            setError('Missing required parameters. Please scan the QR code again.');
            setLoading(false);
            return;
        }

        // Decode the URL parameters
        const decodedItemName = decodeURIComponent(itemName);
        const decodedQuotationId = decodeURIComponent(quotationId);

        // If we have a reference (base64 image), we need to fetch the image data
        if (imageRef) {
            fetchImageFromReference(imageRef, decodedItemName, decodedQuotationId);
        } else if (imageUrl) {
            // Direct image URL (regular images)
            const decodedImageUrl = decodeURIComponent(imageUrl);
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
            
            // Fetch the quotation data from Firestore
            const quotationDoc = await getDoc(doc(db, 'quotations', quotationId));
            
            if (!quotationDoc.exists()) {
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
