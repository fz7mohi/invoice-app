const fs = require('fs');
const path = require('path');

// Ensure directories exist
const publicDir = path.join(__dirname, '../public');
const publicAssetsDir = path.join(publicDir, 'assets');
const publicScreenshotsDir = path.join(publicDir, 'screenshots');

// Create directories if they don't exist
[publicDir, publicAssetsDir, publicScreenshotsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Define source and destination paths
const srcPwaDir = path.join(__dirname, '../src/assets/pwa');

// Copy PWA icons
const iconFiles = ['icon-16.png', 'icon-24.png', 'logo192.png', 'logo512.png'];
iconFiles.forEach(file => {
  const srcPath = path.join(srcPwaDir, file);
  const destPath = path.join(publicDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
  }
});

// Copy screenshots
const screenshots = [
  { src: 'desktop.png', dest: 'desktop.png' },
  { src: 'mobile.png', dest: 'mobile.png' }
];

screenshots.forEach(({ src, dest }) => {
  const srcPath = path.join(srcPwaDir, src);
  const destPath = path.join(publicScreenshotsDir, dest);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
  }
}); 