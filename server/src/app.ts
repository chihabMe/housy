import env from "./core/env";
import { redis_client_connect } from "./core/redis_client";
import { createServer } from "./server";

const runServer = async () => {
  const app = await createServer();
  await redis_client_connect();
  app.listen(env.PORT, () => {
    console.log(`running the server on port ${env.PORT}`);
  });
};

if (require.main == module) runServer();
