import { app } from "./app/app";

Bun.serve({
  port: process.env.PORT,
  fetch: app.fetch,
});
