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

// describe("Saved Job Endpoints", () => {
//   let authCookie: string;
//
//   beforeAll(async () => {
//     const uniqueEmail = `savedjob_${Date.now()}@example.com`;
//     await request("/auth", {
//       method: "POST",
//       body: {
//         email: uniqueEmail,
//         password: "password123",
//         first_name: "SavedJob",
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
//   test("POST /saved-jobs - Save Job Success", async () => {
//     const res = await request("/saved-jobs", {
//       method: "POST",
//       cookies: authCookie,
//       body: { job_id: "1" },
//     });
//
//     expect(res.status).toBe(201);
//     expect(res.data.status_code).toBe(201);
//   });
//
//   test("POST /saved-jobs - Error (job not found)", async () => {
//     const res = await request("/saved-jobs", {
//       method: "POST",
//       cookies: authCookie,
//       body: { job_id: "999999999" },
//     });
//
//     expect(res.status).toBe(500);
//   });
//
//   test("GET /saved-jobs - Get Saved Jobs Success", async () => {
//     const res = await request("/saved-jobs", {
//       method: "GET",
//       cookies: authCookie,
//       body: { user_id: 1 },
//     });
//
//     expect(res.status).toBe(201);
//     expect(res.data.status_code).toBe(201);
//   });
// });
