const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');
const cors = require('cors')({ origin: true });

admin.initializeApp();
const storage = new Storage();

exports.getImageBase64 = functions.https.onRequest(async (req, res) => {
    // Enable CORS
    return cors(req, res, async () => {
        try {
            // Handle preflight requests
            if (req.method === 'OPTIONS') {
                res.status(204).send('');
                return;
            }

            const { imagePath } = req.body;
            
            if (!imagePath) {
                throw new Error('Image path is required');
            }

            // Get the bucket
            const bucket = storage.bucket('fordox-c2355.firebasestorage.app');
            
            // Get the file
            const file = bucket.file(imagePath);
            
            // Check if file exists
            const [exists] = await file.exists();
            if (!exists) {
                throw new Error('File does not exist');
            }
            
            // Get the file as a buffer
            const [buffer] = await file.download();
            
            // Convert buffer to base64
            const base64String = buffer.toString('base64');
            
            // Return the data URL
            res.status(200).json({
                success: true,
                data: `data:image/jpeg;base64,${base64String}`
            });
        } catch (error) {
            console.error('Error in getImageBase64:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });
}); 