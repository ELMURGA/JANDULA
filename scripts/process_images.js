import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFile = path.resolve(__dirname, '../src/data/products.js');
const jandulaFotosDir = path.resolve(__dirname, '../jandula_fotos');
const outputDir = path.resolve(__dirname, '../public/images/products');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Read products from a temporary evaluation
const content = fs.readFileSync(productsFile, 'utf8');

// A safer way to extract the products array:
// We'll replace the export and evaluate it
const tempScriptContent = content.replace('export const products =', 'module.exports = { products:');
const tempFile = path.resolve(__dirname, 'temp_products.cjs');
fs.writeFileSync(tempFile, tempScriptContent);

const { products } = require('./temp_products.cjs');
fs.unlinkSync(tempFile);

let updatedContent = content;
const usedFiles = new Set();
let count = 0;

console.log(`Found ${products.length} products to map.`);

products.forEach(product => {
  if (product.image && typeof product.image === 'string') {
    // Extract filename from URL
    const urlParts = product.image.split('/');
    let urlFileName = urlParts[urlParts.length - 1]; // e.g., IMG_0947.jpg
    
    // Sometimes URLs have queries
    urlFileName = urlFileName.split('?')[0];
    
    // Look for this file in jandula_fotos/
    const sourceFilePath = path.join(jandulaFotosDir, decodeURIComponent(urlFileName));
    let fileToProcess = null;
    
    if (fs.existsSync(sourceFilePath)) {
       fileToProcess = sourceFilePath;
    } else {
       // Try without -scaled
       const noScaled = urlFileName.replace('-scaled', '');
       const noScaledPath = path.join(jandulaFotosDir, decodeURIComponent(noScaled));
       if (fs.existsSync(noScaledPath)) {
         fileToProcess = noScaledPath;
       } else {
         // Try case-insensitive search
         try {
           const files = fs.readdirSync(jandulaFotosDir);
           const match = files.find(f => f.toLowerCase() === decodeURIComponent(urlFileName).toLowerCase() || 
                                         f.toLowerCase() === decodeURIComponent(urlFileName).replace('-scaled', '').toLowerCase());
           if (match) {
             fileToProcess = path.join(jandulaFotosDir, match);
           }
         } catch(e) { /* ignore */ }
       }
    }
    
    if (fileToProcess) {
      // We found the image! Let's slugify name for the new file
      const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const typeSlug = product.subcategory ? product.subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'producto';
      
      const newFileName = `${typeSlug}-${slug}-${product.id}.webp`;
      const newFilePath = path.join(outputDir, newFileName);
      const newRelativePath = `/images/products/${newFileName}`;
      
      console.log(`Converting ${path.basename(fileToProcess)} -> ${newFileName}`);
      
      try {
        // Convert to WebP using sips (macOS native)
        try {
           execSync(`sips -s format webp "${fileToProcess}" --out "${newFilePath}"`, { stdio: 'ignore' });
        } catch (e) {
           console.log("sips failed, trying sharp-cli");
           execSync(`npx -y sharp-cli@^2.1.0 -i "${fileToProcess}" -o "${newFilePath}" webp`);
        }
        
        // Success! Track original so we can delete it
        usedFiles.add(fileToProcess);
        count++;
        
        // Update products.js content
        updatedContent = updatedContent.replace(
           new RegExp(`['"\`]${product.image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`]`, 'g'),
           `"${newRelativePath}"`
        );
      } catch (err) {
        console.error(`Failed to convert ${fileToProcess}: ${err.message}`);
      }
    } else {
      console.warn(`Could not find image locally for: ${product.image}`);
    }
  }
});

// Update products.js
fs.writeFileSync(productsFile, updatedContent);
console.log(`Updated products.js with ${count} new local WebP paths!`);

// Delete the original images from jandula_fotos/
console.log(`Deleting ${usedFiles.size} original images that were converted...`);
for (const file of usedFiles) {
  try {
    fs.unlinkSync(file);
  } catch (err) {
    console.error(`Could not delete ${file}:`, err.message);
  }
}

// "borra las iamgenes que no vamos a usar una vez transformada" 
// Means deleting all remaining images in jandula_fotos
try {
  const allFiles = fs.readdirSync(jandulaFotosDir);
  let deletedUnused = 0;
  for (const file of allFiles) {
     const ext = path.extname(file).toLowerCase();
     if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
        const fullPath = path.join(jandulaFotosDir, file);
        if (!usedFiles.has(fullPath) && fs.existsSync(fullPath)) {
           fs.unlinkSync(fullPath);
           deletedUnused++;
        }
     }
  }
  console.log(`Deleted ${deletedUnused} unused images from jandula_fotos.`);
  
  // optionally remove directory if empty
  const remaining = fs.readdirSync(jandulaFotosDir);
  if (remaining.length === 0) {
     fs.rmdirSync(jandulaFotosDir);
     console.log('Removed empty jandula_fotos directory.');
  }
} catch(e) {}

console.log('All done!');
