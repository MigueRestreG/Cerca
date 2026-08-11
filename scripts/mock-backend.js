const http = require("http");

const port = 3333;
const users = [];

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Idempotency-Key",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  });
  res.end(body);
}

function sendEmpty(res, statusCode) {
  res.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Idempotency-Key",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  });
  res.end();
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function getBearerToken(req) {
  const authorization = req.headers.authorization || "";
  return authorization.startsWith("Bearer ") ? authorization.slice(7) : null;
}

function findUserByEmail(email) {
  return users.find((user) => user.email === email);
}

function createActor(user) {
  return {
    id: user.id,
    capacities: user.capacities || ["customer"],
    platformRole: "user",
  };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "OPTIONS") {
    sendEmpty(res, 204);
    return;
  }

  if (url.pathname === "/v1/health") {
    sendJson(res, 200, { ok: true, service: "cerca-mock-backend" });
    return;
  }

  if (url.pathname === "/v1/auth/sign-in") {
    if (req.method !== "POST") {
      sendJson(res, 405, {
        code: "METHOD_NOT_ALLOWED",
        detail: "Method not allowed",
      });
      return;
    }

    try {
      const body = await parseBody(req);
      const user = findUserByEmail(body.email);
      if (!user || user.password !== body.password) {
        sendJson(res, 401, {
          code: "INVALID_CREDENTIALS",
          detail: "Invalid email or password",
        });
        return;
      }

      const actor = createActor(user);
      sendJson(res, 200, {
        actor,
        accessToken: `mock-access-${user.id}`,
        refreshToken: `mock-refresh-${user.id}`,
      });
    } catch (error) {
      sendJson(res, 400, {
        code: "INVALID_BODY",
        detail: "Invalid JSON payload",
      });
    }
    return;
  }

  if (url.pathname === "/v1/auth/sign-up") {
    if (req.method !== "POST") {
      sendJson(res, 405, {
        code: "METHOD_NOT_ALLOWED",
        detail: "Method not allowed",
      });
      return;
    }

    try {
      const body = await parseBody(req);
      const email = body.email?.trim();
      const password = body.password;
      const displayName = body.displayName?.trim();

      if (!email || !password || !displayName) {
        sendJson(res, 400, {
          code: "INVALID_INPUT",
          detail: "Missing required fields",
        });
        return;
      }

      if (findUserByEmail(email)) {
        sendJson(res, 409, {
          code: "EMAIL_IN_USE",
          detail: "Email already registered",
        });
        return;
      }

      const user = {
        id: `user-${users.length + 1}`,
        email,
        password,
        displayName,
        capacities: body.capacities || ["customer"],
      };
      users.push(user);

      const actor = createActor(user);
      sendJson(res, 200, {
        actor,
        accessToken: `mock-access-${user.id}`,
        refreshToken: `mock-refresh-${user.id}`,
      });
    } catch (error) {
      sendJson(res, 400, {
        code: "INVALID_BODY",
        detail: "Invalid JSON payload",
      });
    }
    return;
  }

  if (url.pathname === "/v1/auth/sign-out") {
    if (req.method !== "POST") {
      sendJson(res, 405, {
        code: "METHOD_NOT_ALLOWED",
        detail: "Method not allowed",
      });
      return;
    }
    sendEmpty(res, 204);
    return;
  }

  if (url.pathname === "/v1/me") {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { code: "UNAUTHORIZED", detail: "Missing token" });
      return;
    }

    const match = users.find((user) => `mock-access-${user.id}` === token);
    if (!match) {
      sendJson(res, 401, { code: "UNAUTHORIZED", detail: "Invalid token" });
      return;
    }

    sendJson(res, 200, createActor(match));
    return;
  }

  if (url.pathname === "/v1/categories") {
    sendJson(res, 200, [
      { id: "cat-1", slug: "home", name: "Home" },
      { id: "cat-2", slug: "services", name: "Services" },
    ]);
    return;
  }

  if (url.pathname === "/v1/listings") {
    sendJson(res, 200, { items: [], nextCursor: null });
    return;
  }

  if (url.pathname === "/v1/bookings") {
    sendJson(res, 200, { items: [], nextCursor: null });
    return;
  }

  sendJson(res, 404, { code: "NOT_FOUND", detail: "Route not found" });
});

server.listen(port, () => {
  console.log(`Mock backend listening on http://localhost:${port}`);
});
