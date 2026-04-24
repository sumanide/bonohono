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
// describe("Job Endpoints", () => {
//   let authCookie: string;
//
//   beforeAll(async () => {
//     const uniqueEmail = `jobtest_${Date.now()}@example.com`;
//     await request("/auth", {
//       method: "POST",
//       body: {
//         email: uniqueEmail,
//         password: "password123",
//         first_name: "Job",
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
//   test("POST /jobs - Create Job Success", async () => {
//     const res = await request("/jobs", {
//       method: "POST",
//       cookies: authCookie,
//       body: {
//         poster_id: "1",
//         title: "Software Engineer",
//         budget: 5000,
//         description: "Build amazing software",
//         category_id: "1",
//         status: "OPEN",
//         deadline: new Date().toISOString(),
//         location: "Jakarta",
//         work_type: "REMOTE",
//         commitment: "FULL_TIME",
//       },
//     });
//
//     expect(res.status).toBe(201);
//     expect(res.data.status_code).toBe(201);
//     expect(res.data.data).toMatchObject({
//       title: "Software Engineer",
//       status: "OPEN",
//     });
//   });
//
//   test("POST /jobs - Error (missing required fields)", async () => {
//     const res = await request("/jobs", {
//       method: "POST",
//       cookies: authCookie,
//       body: {
//         title: "Incomplete Job",
//       },
//     });
//
//     expect(res.status).toBe(400);
//   });
//
//   test("POST /jobs - Error (not authenticated)", async () => {
//     const res = await request("/jobs", {
//       method: "POST",
//       body: {
//         poster_id: "1",
//         title: "Unauthorized Job",
//         budget: 1000,
//       },
//     });
//
//     expect(res.status).toBe(401);
//   });
//
//   test("GET /jobs - Get All Jobs Success", async () => {
//     const res = await request("/jobs", {
//       method: "GET",
//       cookies: authCookie,
//     });
//
//     expect(res.status).toBe(200);
//     expect(res.data.status_code).toBe(200);
//     expect(Array.isArray(res.data.data)).toBe(true);
//   });
//
//   test("GET /jobs - Error (not authenticated)", async () => {
//     const res = await request("/jobs", {
//       method: "GET",
//     });
//
//     expect(res.status).toBe(401);
//   });
//
//   test("GET /jobs/categories/:category_id - Get Jobs by Category Success", async () => {
//     const res = await request("/jobs/categories/1", {
//       method: "GET",
//       cookies: authCookie,
//     });
//
//     expect(res.status).toBe(200);
//     expect(res.data.status_code).toBe(200);
//     expect(Array.isArray(res.data.data)).toBe(true);
//   });
//
//   test("GET /jobs/:id - Get Job by ID Success", async () => {
//     const res = await request("/jobs/1", {
//       method: "GET",
//       cookies: authCookie,
//     });
//
//     expect(res.status).toBe(200);
//     expect(res.data.status_code).toBe(200);
//     expect(res.data.data).toBeDefined();
//   });
//
//   test("GET /jobs/:id - Error (job not found)", async () => {
//     const res = await request("/jobs/999999999", {
//       method: "GET",
//       cookies: authCookie,
//     });
//
//     expect(res.status).toBe(500);
//   });
// });
