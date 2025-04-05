const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceIcon = path.join(__dirname, '../src/assets/images/favicon.png');
const publicDir = path.join(__dirname, '../public');
const screenshotsDir = path.join(publicDir, 'screenshots');

// Ensure directories exist
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
}

// Generate different sizes of icons
async function generateIcons() {
    try {
        // Generate favicon.ico (32x32)
        await sharp(sourceIcon)
            .resize(32, 32)
            .toFile(path.join(publicDir, 'favicon.ico'));

        // Generate icon-16.png
        await sharp(sourceIcon)
            .resize(16, 16)
            .toFile(path.join(publicDir, 'icon-16.png'));

        // Generate icon-24.png
        await sharp(sourceIcon)
            .resize(24, 24)
            .toFile(path.join(publicDir, 'icon-24.png'));

        // Generate icon-64.png
        await sharp(sourceIcon)
            .resize(64, 64)
            .toFile(path.join(publicDir, 'icon-64.png'));

        // Generate logo192.png
        await sharp(sourceIcon)
            .resize(192, 192)
            .toFile(path.join(publicDir, 'logo192.png'));

        // Generate logo512.png
        await sharp(sourceIcon)
            .resize(512, 512)
            .toFile(path.join(publicDir, 'logo512.png'));

        // Generate screenshots if they don't exist
        if (!fs.existsSync(path.join(screenshotsDir, 'desktop.png'))) {
            // Create a placeholder desktop screenshot
            await sharp({
                create: {
                    width: 1920,
                    height: 1080,
                    channels: 4,
                    background: { r: 255, g: 255, b: 255, alpha: 1 }
                }
            })
            .png()
            .toFile(path.join(screenshotsDir, 'desktop.png'));
        }

        if (!fs.existsSync(path.join(screenshotsDir, 'mobile.png'))) {
            // Create a placeholder mobile screenshot
            await sharp({
                create: {
                    width: 750,
                    height: 1334,
                    channels: 4,
                    background: { r: 255, g: 255, b: 255, alpha: 1 }
                }
            })
            .png()
            .toFile(path.join(screenshotsDir, 'mobile.png'));
        }

        console.log('PWA icons and screenshots generated successfully!');
    } catch (error) {
        console.error('Error generating PWA assets:', error);
    }
}

generateIcons(); 