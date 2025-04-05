const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceIcon = path.join(__dirname, '../src/assets/images/favicon.png');
const publicDir = path.join(__dirname, '../public');
const screenshotsDir = path.join(publicDir, 'screenshots');

// Background color for icons (#090c1c)
const backgroundColor = { r: 9, g: 12, b: 28, alpha: 1 };

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
        // Function to create icon with background
        const createIconWithBackground = async (size, outputPath, format = 'png') => {
            // Create background
            const background = sharp({
                create: {
                    width: size,
                    height: size,
                    channels: 4,
                    background: backgroundColor
                }
            });

            // Resize source icon
            const icon = sharp(sourceIcon)
                .resize(size, size);

            // Composite icon on background
            const composite = await background
                .composite([{ input: await icon.toBuffer(), blend: 'over' }]);

            // Save with appropriate format
            if (format === 'ico') {
                // For ICO format, save as PNG first
                const tempPath = outputPath.replace('.ico', '_temp.png');
                await composite.png().toFile(tempPath);
                // Note: You'll need to use a separate tool to convert PNG to ICO
                // For now, we'll just keep the PNG version
                fs.renameSync(tempPath, outputPath.replace('.ico', '.png'));
            } else {
                await composite.toFile(outputPath);
            }
        };

        // Generate favicon (32x32)
        await createIconWithBackground(32, path.join(publicDir, 'favicon.png'));

        // Generate icon-16.png
        await createIconWithBackground(16, path.join(publicDir, 'icon-16.png'));

        // Generate icon-24.png
        await createIconWithBackground(24, path.join(publicDir, 'icon-24.png'));

        // Generate icon-64.png
        await createIconWithBackground(64, path.join(publicDir, 'icon-64.png'));

        // Generate logo192.png
        await createIconWithBackground(192, path.join(publicDir, 'logo192.png'));

        // Generate logo512.png
        await createIconWithBackground(512, path.join(publicDir, 'logo512.png'));

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