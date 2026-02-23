const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const productsFile = path.join(__dirname, '../src/data/products.js');
let productsContent = fs.readFileSync(productsFile, 'utf8');

// Extract all products using a simpler approach
// We'll read the products array by evaluating a modified version of the file
const scriptContent = productsContent.replace('export const products =', 'module.exports = { products:');
fs.writeFileSync(path.join(__dirname, 'temp_products.js'), scriptContent);

const { products } = require('./temp_products.js');
let updatedProductsContent = productsContent;
const imageDir = path.join(__dirname, '../public/images/products');

products.forEach(product => {
  product.colors.forEach(color => {
    color.images.forEach(imagePath => {
      // Remove leading slash if present
      const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
      const fullPath = path.join(__dirname, '..', 'public', cleanPath);
      
      if (fs.existsSync(fullPath)) {
        const ext = path.extname(fullPath);
        if (ext.toLowerCase() !== '.webp') {
          // Generate new filename based on product name
          const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          const randomString = Math.random().toString(36).substring(2, 8);
          const newFileName = `${slug}-${color.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${randomString}.webp`;
          const newFilePath = path.join(path.dirname(fullPath), newFileName);
          const newRelativePath = `/images/products/${newFileName}`;
          
          console.log(`Converting ${imagePath} to ${newRelativePath}...`);
          
          try {
            // Use cwebp if available from brew, or sips (mac default but doesn't do webp directly until recent macOS)
            // Or use sharp via node
            // Let's use a simple node script with sharp to do the conversion safely
            execSync(`npx -y sharp-cli@^2.1.0 -i "${fullPath}" -o "${newFilePath}" webp`);
            
            // Delete original
            fs.unlinkSync(fullPath);
            
            // Update products.js content
            updatedProductsContent = updatedProductsContent.replace(
              new RegExp(`['"]${imagePath}['"]`, 'g'), 
              `'${newRelativePath}'`
            );
            
            // Check for thumb files (-300x300.jpg, etc)
            const dir = path.dirname(fullPath);
            const base = path.basename(fullPath, ext);
            const files = fs.readdirSync(dir);
            files.forEach(file => {
              if (file.startsWith(base) && file !== path.basename(fullPath) && file.match(/-\d+x\d+\./)) {
                fs.unlinkSync(path.join(dir, file));
                console.log(`  Deleted thumbnail ${file}`);
              }
            });
          } catch (err) {
            console.error(`Failed to convert ${fullPath}: ${err.message}`);
          }
        }
      } else {
         console.warn(`File not found: ${fullPath}`);
      }
    });
  });
});

fs.writeFileSync(productsFile, updatedProductsContent);
fs.unlinkSync(path.join(__dirname, 'temp_products.js'));
console.log('Done!');
