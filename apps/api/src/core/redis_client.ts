import { createClient } from "redis";
import env from "./env";
const redis_client = createClient({
  url: env.getRedisURL(),
});

redis_client.on("error", (err) => {
  console.error(err);
  throw err;
});
export const redis_client_connect = async () => {
  console.log(env.getRedisURL());
  try {
    console.log();
    await redis_client.connect();
    console.log("redis is connected");
  } catch (err) {
    console.error(err);
    console.log("unable to connect with redis");
  }
};
export default redis_client;
