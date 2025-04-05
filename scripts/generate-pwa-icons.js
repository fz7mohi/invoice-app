const fs = require('fs');
const path = require('path');

const pwaAssetsDir = path.join(__dirname, '../src/assets/pwa');
const publicDir = path.join(__dirname, '../public');
const publicAssetsDir = path.join(publicDir, 'assets/pwa');
const screenshotsDir = path.join(publicDir, 'screenshots');

// Ensure directories exist
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
}
if (!fs.existsSync(publicAssetsDir)) {
    fs.mkdirSync(path.join(publicDir, 'assets'), { recursive: true });
    fs.mkdirSync(publicAssetsDir);
}

// Copy PWA icons
async function copyPWAAssets() {
    try {
        // Copy all PWA icons
        const icons = ['icon-16.png', 'icon-24.png', 'logo192.png', 'logo512.png'];
        
        for (const icon of icons) {
            const sourcePath = path.join(pwaAssetsDir, icon);
            const destPath = path.join(publicAssetsDir, icon);
            
            if (fs.existsSync(sourcePath)) {
                fs.copyFileSync(sourcePath, destPath);
                console.log(`Copied ${icon} successfully!`);
            } else {
                console.warn(`Warning: ${icon} not found in source directory`);
            }
        }

        // Generate screenshots if they don't exist (keeping this part from the original script)
        if (!fs.existsSync(path.join(screenshotsDir, 'desktop.png'))) {
            console.log('Desktop screenshot not found. Please add a screenshot at screenshots/desktop.png (1920x1080)');
        }

        if (!fs.existsSync(path.join(screenshotsDir, 'mobile.png'))) {
            console.log('Mobile screenshot not found. Please add a screenshot at screenshots/mobile.png (750x1334)');
        }

        console.log('PWA assets copied successfully!');
    } catch (error) {
        console.error('Error copying PWA assets:', error);
        process.exit(1);
    }
}

copyPWAAssets(); 