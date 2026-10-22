import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3002;
const OUT_DIR = path.join(__dirname, "out");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

function resolveFilePath(reqPath) {
  let decoded = decodeURIComponent(reqPath.split("?")[0]);
  if (decoded === "/") decoded = "/index.html";

  // Prevent directory traversal
  const safePath = path.normalize(decoded).replace(/^(\.\.[\/\\])+/, "");
  let fullPath = path.join(OUT_DIR, safePath);

  // 1. Direct file match
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    return fullPath;
  }

  // 2. Try with .html extension (e.g. /problems -> /problems.html)
  if (fs.existsSync(fullPath + ".html") && fs.statSync(fullPath + ".html").isFile()) {
    return fullPath + ".html";
  }

  // 3. Try directory/index.html
  const indexPath = path.join(fullPath, "index.html");
  if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
    return indexPath;
  }

  return null;
}

const server = http.createServer((req, res) => {
  // CORS & Security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.url === "/api/health" || req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "healthy", service: "dsaloop", timestamp: new Date().toISOString() }));
    return;
  }

  const resolved = resolveFilePath(req.url);

  if (!resolved) {
    const notFoundPath = path.join(OUT_DIR, "404.html");
    if (fs.existsSync(notFoundPath)) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      fs.createReadStream(notFoundPath).pipe(res);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
    }
    return;
  }

  const ext = path.extname(resolved).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  // Cache headers
  if (resolved.includes("/_next/static/")) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  } else if (ext === ".html") {
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  } else {
    res.setHeader("Cache-Control", "public, max-age=86400");
  }

  res.writeHead(200, { "Content-Type": contentType });
  fs.createReadStream(resolved).pipe(res);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 DSALoop Server listening at http://0.0.0.0:${PORT}`);
});
