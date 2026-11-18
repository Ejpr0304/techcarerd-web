const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Read products.ts to parse initialProducts
const content = fs.readFileSync(path.join(process.cwd(), 'src', 'services', 'products.ts'), 'utf-8');
const startIdx = content.indexOf('export const initialProducts: Product[] = [');
const endIdx = content.indexOf('];\n\n// Helper', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const slice = content.substring(startIdx + 'export const initialProducts: Product[] = '.length, endIdx + 1);
  // Evaluate the JS array safely
  const products = eval(slice);
  
  fs.writeFileSync(path.join(dataDir, 'inventory.json'), JSON.stringify(products, null, 2), 'utf-8');
  console.log(`Successfully generated data/inventory.json with ${products.length} products!`);
} else {
  console.error('Could not locate initialProducts bounds in products.ts');
}
