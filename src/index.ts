import { Hono } from "hono";
import figlet from "figlet";
import { userController, authController } from "./app/app.ts";
import { prettyJSON } from "hono/pretty-json";

const app = new Hono();
app.use(prettyJSON());
const body = figlet.textSync("saken");

app.route("/api", userController);
app.route("/api", authController);

console.log(`${body}`);
for (let i = 0; i < app.routes.length; i++) {
  console.log(`Routes: ${JSON.stringify(app.routes[i])}`);
}

export default {
  port: 9999,
  fetch: app.fetch,
};
