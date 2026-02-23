const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const productsFile = path.join(__dirname, '../src/data/products.js');
let productsContent = fs.readFileSync(productsFile, 'utf8');

const { products } = require('./temp_products.cjs');
let updatedProductsContent = productsContent;
const imageDir = path.join(__dirname, '../public/images/products');

let count = 0;

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
          const randomString = Math.random().toString(36).substring(2, 6);
          const newFileName = `${slug}-${color.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${randomString}.webp`;
          const newFilePath = path.join(path.dirname(fullPath), newFileName);
          const newRelativePath = `/images/products/${newFileName}`;
          
          console.log(`Converting ${imagePath} to ${newRelativePath}...`);
          
          try {
            // Use sips for macos native webp conversion if supported, or fall back to sharp
            try {
               execSync(`sips -s format webp "${fullPath}" --out "${newFilePath}"`, { stdio: 'ignore' });
            } catch (e) {
               console.log("sips failed or didn't support webp, trying sharp-cli");
               execSync(`npx -y sharp-cli@^2.1.0 -i "${fullPath}" -o "${newFilePath}" webp`);
            }
            
            // Delete original
            fs.unlinkSync(fullPath);
            count++;
            
            // Update products.js content
            // Need to carefully escape the search path
            const searchPath = imagePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const re = new RegExp(`['"\`]${searchPath}['"\`]`, 'g');
            updatedProductsContent = updatedProductsContent.replace(re, `"${newRelativePath}"`);
            
            // Check for thumb files (-300x300.jpg, etc)
            const dir = path.dirname(fullPath);
            const base = path.basename(fullPath, ext);
            const files = fs.readdirSync(dir);
            files.forEach(file => {
              if (file.startsWith(base) && file !== path.basename(fullPath) && file.match(/-\d+x\d+\./)) {
                fs.unlinkSync(path.join(dir, file));
                console.log(`  Deleted thumbnail ${file}`);
              } else if (file.startsWith(base) && file !== path.basename(fullPath)) {
                // Delete other related files like .webp versions that might have been created previously
                if (file.endsWith('.webp') && file !== newFileName) {
                    fs.unlinkSync(path.join(dir, file));
                    console.log(`  Deleted associated child file ${file}`);
                }
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
console.log(`Done converting ${count} images!`);
