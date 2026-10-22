import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  handleRunCode,
  handleSubmitCode,
  handleGetLanguages,
} from "./src/server/code-handlers.mjs";

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

function parseJsonBody(req, maxSize = 131072) {
  return new Promise((resolve, reject) => {
    let body = "";
    let size = 0;

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxSize) {
        reject(new Error("Request body payload exceeded maximum size limit"));
        req.destroy();
        return;
      }
      body += chunk;
    });

    req.on("end", () => {
      try {
        const json = body ? JSON.parse(body) : {};
        resolve(json);
      } catch (err) {
        reject(new Error("Malformed JSON in request body"));
      }
    });

    req.on("error", (err) => reject(err));
  });
}

const server = http.createServer(async (req, res) => {
  // CORS & Security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight OPTIONS
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlPath = req.url ? req.url.split("?")[0] : "/";
  const clientIp =
    (req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.socket.remoteAddress ||
      "127.0.0.1"
    ).trim();

  // API Route: Health
  if (urlPath === "/api/health" || urlPath === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "healthy",
        service: "dsaloop",
        timestamp: new Date().toISOString(),
      })
    );
    return;
  }

  // API Route: GET /api/code/languages
  if (urlPath === "/api/code/languages" && req.method === "GET") {
    try {
      const response = await handleGetLanguages();
      res.writeHead(response.status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response.body));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to retrieve languages" }));
    }
    return;
  }

  // API Route: POST /api/code/run
  if (urlPath === "/api/code/run" && req.method === "POST") {
    try {
      const body = await parseJsonBody(req);
      const response = await handleRunCode(body, clientIp);
      res.writeHead(response.status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response.body));
    } catch (err) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err instanceof Error ? err.message : "Bad Request" }));
    }
    return;
  }

  // API Route: POST /api/code/submit
  if (urlPath === "/api/code/submit" && req.method === "POST") {
    try {
      const body = await parseJsonBody(req);
      const response = await handleSubmitCode(body, clientIp);
      res.writeHead(response.status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response.body));
    } catch (err) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err instanceof Error ? err.message : "Bad Request" }));
    }
    return;
  }

  // Static File Serving
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
  console.log(`📡 Code Execution Endpoints enabled:`);
  console.log(`   - POST /api/code/run`);
  console.log(`   - POST /api/code/submit`);
  console.log(`   - GET  /api/code/languages`);
});
