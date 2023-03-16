import env from "./core/env";
import { redis_client_connect } from "./core/redis_client";
import { createServer } from "./utils/server";

const runServer = async () => {
  const app = createServer();
  await redis_client_connect();
  app.listen(env.PORT, () => {
    console.log(`running the server on port ${env.PORT}`);
  });
  return app;
};
// if (require.main == module) runServer();
export default runServer();
