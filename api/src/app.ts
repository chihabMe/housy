import next from "next";
import env from "./core/env";
import { redis_client_connect } from "./core/redis_client";
import { createServer } from "./server";

const runServer = async () => {
  const nextApp = next({ dev: !env.isProduction() });
  const handler = nextApp.getRequestHandler();
  nextApp
    .prepare()
    .then(async () => {
      const app = createServer();
      app.get("*", (req, res) => handler(req, res));
      app.get("/api/v1/hello", (req, res) => res.json("hello world"));
      await redis_client_connect();
      app.listen(env.PORT, () => {
        console.log(`running the server on port ${env.PORT}`);
        // });
      });
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};
if (require.main == module) runServer();
