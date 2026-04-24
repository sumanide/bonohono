import { describe, test, expect, beforeAll } from "bun:test";
const BASE_URL = "http://localhost:9999/api";

async function request(
  path: string,
  options: {
    method?: string;
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
    cookies?: string;
  } = {},
): Promise<{ status: number; data: any; cookies?: string[] }> {
  const { method = "GET", body, headers = {}, cookies } = options;

  const cookieHeader = cookies ? { Cookie: cookies } : {};

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...cookieHeader,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const setCookies = response.headers.getSetCookie?.() || [];
  const data = await response.json();

  return {
    status: response.status,
    data,
    cookies: setCookies,
  };
}

function extractCookies(cookies: string[]): string {
  return cookies
    .map((c) => c.split(";").at(0))
    .filter(Boolean)
    .join("; ");
}

// describe("User Endpoints", () => {
//   let authCookie: string;
//
//   beforeAll(async () => {
//     const uniqueEmail = `usertest_${Date.now()}@example.com`;
//     await request("/auth", {
//       method: "POST",
//       body: {
//         email: uniqueEmail,
//         password: "password123",
//         first_name: "User",
//         last_name: "Test",
//       },
//     });
//
//     const loginRes = await request("/auth/login", {
//       method: "POST",
//       body: {
//         email: uniqueEmail,
//         password: "password123",
//       },
//     });
//
//     authCookie = extractCookies(loginRes.cookies || []);
//   });
//
//   test("GET /users - Success (authenticated)", async () => {
//     const res = await request("/users", {
//       method: "GET",
//       cookies: authCookie,
//     });
//
//     expect(res.status).toBe(200);
//     expect(res.data.status_code).toBe(200);
//     expect(Array.isArray(res.data.data)).toBe(true);
//   });
//
//   test("GET /users - Error (not authenticated)", async () => {
//     const res = await request("/users", {
//       method: "GET",
//     });
//
//     expect(res.status).toBe(401);
//   });
//
//   test("GET /users/:id - Success", async () => {
//     const res = await request("/users/1", {
//       method: "GET",
//       cookies: authCookie,
//     });
//
//     expect(res.status).toBe(200);
//     expect(res.data.status_code).toBe(200);
//     expect(res.data.data).toBeDefined();
//   });
//
//   test("GET /users/:id - Error (user not found)", async () => {
//     const res = await request("/users/999999999", {
//       method: "GET",
//       cookies: authCookie,
//     });
//
//     expect(res.status).toBe(500);
//   });
// });
//
//
