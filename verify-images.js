const fs = require('fs');
const path = require('path');

// Check if the dist/images directory exists
const distImagesDir = path.join(__dirname, 'dist', 'images');
if (!fs.existsSync(distImagesDir)) {
  console.error('Error: dist/images directory does not exist!');
  console.log('Please run the build command first: npm run build');
  process.exit(1);
}

// Check if the required images exist
const requiredImages = [
  'invoice-logo.png',
  'white-logo.png',
  'black-logo.png'
];

let missingImages = [];
for (const image of requiredImages) {
  const imagePath = path.join(distImagesDir, image);
  if (!fs.existsSync(imagePath)) {
    missingImages.push(image);
  }
}

if (missingImages.length > 0) {
  console.error('Error: The following images are missing from dist/images:');
  missingImages.forEach(image => console.error(`- ${image}`));
  console.log('Please make sure these images exist in src/assets/images/');
  process.exit(1);
}

console.log('All required images are present in dist/images/');
console.log('Image paths in your code should be:');
console.log('- For PDFs: ${window.location.origin}/images/invoice-logo.png');
console.log('- For emails: ${window.location.origin}/images/white-logo.png'); 