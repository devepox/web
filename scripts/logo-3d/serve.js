/*
 * serve.js: a tiny static file server over the repo root, so the render harness (scripts/logo-3d/glass.html) can load
 * the site's scene module and three.js as ES modules (browsers refuse module imports from file:// pages).
 * Used by loop.js; also runnable on its own: node scripts/logo-3d/serve.js [port] → http://localhost:<port>/scripts/logo-3d/glass.html
 */
const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.js': 'text/javascript', '.mjs': 'text/javascript', '.ts': 'text/plain', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png' };

function serve(port = 0) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const file = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
      if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(port, '127.0.0.1', () => resolve({ server, url: `http://127.0.0.1:${server.address().port}` }));
  });
}

module.exports = { serve };
if (require.main === module) serve(+(process.argv[2] || 8123)).then(({ url }) => console.log(`${url}/scripts/logo-3d/glass.html`));
