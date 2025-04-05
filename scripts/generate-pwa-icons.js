const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceIcon = path.join(__dirname, '../src/assets/images/favicon.png');
const publicDir = path.join(__dirname, '../public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

// Generate different sizes of icons
async function generateIcons() {
    try {
        // Generate favicon.ico
        await sharp(sourceIcon)
            .resize(32, 32)
            .toFile(path.join(publicDir, 'favicon.ico'));

        // Generate logo192.png
        await sharp(sourceIcon)
            .resize(192, 192)
            .toFile(path.join(publicDir, 'logo192.png'));

        // Generate logo512.png
        await sharp(sourceIcon)
            .resize(512, 512)
            .toFile(path.join(publicDir, 'logo512.png'));

        console.log('PWA icons generated successfully!');
    } catch (error) {
        console.error('Error generating PWA icons:', error);
    }
}

generateIcons(); 