const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');
const notFoundPath = path.join(distPath, '404.html');
const noJekyllPath = path.join(distPath, '.nojekyll');

if (!fs.existsSync(indexPath)) {
  console.error('❌ index.html not found in dist/');
  process.exit(1);
}

const indexContent = fs.readFileSync(indexPath, 'utf8');
fs.writeFileSync(notFoundPath, indexContent);
fs.writeFileSync(noJekyllPath, '');

console.log('✅ 404.html and .nojekyll generated successfully');
