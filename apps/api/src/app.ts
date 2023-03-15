import env from "./core/env";
import { redis_client_connect } from "./core/redis_client";
import { createServer } from "./utils/server";

const runServer = async () => {
  try {
    const app = createServer();
    await redis_client_connect();
    app.listen(env.PORT, () => {
      console.log(`running the server on port ${env.PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
if (require.main == module) runServer();
