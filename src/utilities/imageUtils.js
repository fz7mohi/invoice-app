import { getStorage, ref } from 'firebase/storage';

export const getBase64FromUrl = async (url) => {
    try {
        // Check if the URL is from Firebase Storage
        if (url.includes('firebasestorage.googleapis.com')) {
            const storage = getStorage();
            
            // Extract the path from the URL
            const pathMatch = url.match(/\/o\/(.+?)(?:\?|$)/);
            if (!pathMatch) {
                console.warn('Invalid Firebase Storage URL:', url);
                return null;
            }
            
            // Decode the path
            const decodedPath = decodeURIComponent(pathMatch[1]);
            
            try {
                // Call the Cloud Function
                const response = await fetch('https://us-central1-fordox-c2355.cloudfunctions.net/getImageBase64', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ imagePath: decodedPath }),
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                
                if (result.success) {
                    return result.data;
                } else {
                    console.warn('Error getting image from Cloud Function:', result.error);
                    return null;
                }
            } catch (storageError) {
                console.warn('Error accessing Firebase Storage:', storageError);
                return null;
            }
        } else {
            // For regular URLs, use the Image element approach
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    
                    try {
                        const dataURL = canvas.toDataURL('image/jpeg');
                        resolve(dataURL);
                    } catch (e) {
                        reject(new Error('Failed to convert image to base64'));
                    }
                };
                
                img.onerror = () => {
                    reject(new Error('Failed to load image'));
                };
                
                img.src = url;
            });
        }
    } catch (error) {
        console.error('Error converting image to base64:', error);
        return null;
    }
}; 