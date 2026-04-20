import { app } from "./app/app";

Bun.serve({
  port: Bun.env["PORT"] as string,
  fetch: app.fetch,
});
