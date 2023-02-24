import { createClient } from "redis";
import env from "./env";
const redis_client = createClient({
  url: env.getRedisURL(),
});
redis_client.on("connect", () => {
  console.log(`redis is connect  `);
});
export const redis_client_connect = async () => {
  console.log(env.getRedisURL());
  try {
    await redis_client.connect();
  } catch (err) {
    console.error(err);
    console.log("unable to connect with redis");
  }
};
export default redis_client;
