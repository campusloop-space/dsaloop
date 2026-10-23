import { Auth, skipCSRFCheck } from "@auth/core";

export const authConfig = {
  basePath: "/api/auth",
  secret:
    process.env.AUTH_SECRET ||
    "2b3b27e73069fb419899e9513e9a9c8d537fa6b62f4167fe684d8bbc6044472b",
  trustHost: true,
  skipCSRFCheck,
  providers: [
    {
      id: "campusloop",
      name: "CampusLoop",
      type: "oidc",
      issuer: process.env.CAMPUSLOOP_ISSUER || "https://campusloop.space",
      clientId:
        process.env.CAMPUSLOOP_CLIENT_ID ||
        process.env.CLIENT_ID ||
        "cl_app_28oQTDf7rC7ocJbW",
      clientSecret:
        process.env.CAMPUSLOOP_CLIENT_SECRET ||
        process.env.CLIENT_SECRET ||
        "cl_secret_At2SAuM2tymdDtP0uPZ3x7zuhjtB-pCBLWS3468ATMU",
      authorization: {
        params: {
          scope: "openid profile email student college academic",
        },
      },
      checks: ["pkce", "state", "nonce"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || profile.preferred_username,
          email: profile.email,
          image: profile.picture,
          studentVerified: profile.student_verified === true,
          college:
            typeof profile.college === "object"
              ? profile.college?.name
              : profile.college,
        };
      },
    },
  ],
  callbacks: {
    jwt({ token, profile }) {
      if (profile) {
        token.studentVerified = profile.student_verified === true;
        token.college =
          typeof profile.college === "object"
            ? profile.college?.name
            : profile.college ?? null;
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          studentVerified: token.studentVerified,
          college: token.college,
        },
      };
    },
  },
};

/**
 * Handles incoming Auth.js requests (/api/auth/*)
 * Converts Node http.IncomingMessage and http.ServerResponse to Web Request / Response
 */
export async function handleAuthRequest(req, res) {
  const urlPath = req.url ? req.url.split("?")[0] : "/";

  // Provide convenience auto-redirect for GET /api/auth/signin/campusloop
  if (
    req.method === "GET" &&
    (urlPath === "/api/auth/signin/campusloop" ||
      urlPath === "/api/auth/signin/campusloop/")
  ) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Connecting to CampusLoop...</title>
  </head>
  <body style="font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#09090b;color:#fafafa;">
    <div style="text-align:center;">
      <p style="font-size:14px;color:#a1a1aa;">Redirecting to CampusLoop secure authentication...</p>
      <form id="f" method="POST" action="/api/auth/signin/campusloop">
        <noscript><button type="submit" style="padding:8px 16px;border-radius:9999px;background:#3b82f6;color:#fff;border:none;cursor:pointer;">Continue</button></noscript>
      </form>
      <script>document.getElementById("f").submit();</script>
    </div>
  </body>
</html>`);
    return;
  }

  // Construct Web Request
  const protocol =
    req.headers["x-forwarded-proto"] ||
    (req.socket?.encrypted ? "https" : "http");
  const host =
    req.headers["x-forwarded-host"] ||
    req.headers.host ||
    "dsaloop.campusloop.space";
  const fullUrl = `${protocol}://${host}${req.url}`;

  let body = undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    body = Buffer.concat(chunks);
  }

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) headers.append(key, v);
    } else {
      headers.set(key, value);
    }
  }

  try {
    const webReq = new Request(fullUrl, {
      method: req.method,
      headers,
      body,
    });

    const response = await Auth(webReq, authConfig);

    res.statusCode = response.status;

    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") return;
      res.setHeader(key, value);
    });

    const cookies = response.headers.getSetCookie?.() || [];
    if (cookies.length > 0) {
      res.setHeader("Set-Cookie", cookies);
    }

    const arrayBuffer = await response.arrayBuffer();
    res.end(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error("Auth request handling error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Internal Authentication Error",
        message: err instanceof Error ? err.message : String(err),
      })
    );
  }
}
