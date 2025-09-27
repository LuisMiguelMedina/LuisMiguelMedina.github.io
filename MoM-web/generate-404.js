const fs = require('fs');
const path = require('path');

// Leer el archivo index.html generado
const indexPath = path.join(__dirname, 'dist/MoM-web/browser/index.html');
const notFoundPath = path.join(__dirname, 'dist/MoM-web/browser/404.html');

// También crear en la raíz de dist/MoM-web para la configuración actual
const indexRootPath = path.join(__dirname, 'dist/MoM-web/index.html');
const notFoundRootPath = path.join(__dirname, 'dist/MoM-web/404.html');

if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Crear 404.html idéntico al index.html en browser/
  fs.writeFileSync(notFoundPath, indexContent);
  
  // También crear en la raíz si existe index.html allí
  if (fs.existsSync(indexRootPath)) {
    const indexRootContent = fs.readFileSync(indexRootPath, 'utf8');
    fs.writeFileSync(notFoundRootPath, indexRootContent);
  }
  
  console.log('✅ 404.html generated successfully');
} else if (fs.existsSync(indexRootPath)) {
  // Fallback: usar index.html de la raíz si no existe en browser/
  const indexContent = fs.readFileSync(indexRootPath, 'utf8');
  fs.writeFileSync(notFoundRootPath, indexContent);
  console.log('✅ 404.html generated successfully from root');
} else {
  console.error('❌ index.html not found in dist/MoM-web/ or dist/MoM-web/browser/');
  process.exit(1);
}
