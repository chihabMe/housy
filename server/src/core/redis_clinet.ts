import { createClient } from "redis";
import env from "./env";
const redis_client = createClient({
  url: env.getRedisURL(),
});
// redis_client.on("connect", () => {
//   console.log(`redis is connectted  `);
// });
export const redis_client_connect = async () => {
  try {
    await redis_client.connect();
    console.log("redis is connected");
  } catch (err) {
    console.log("unable to connect with redis");
    throw err;
  }
};
export default redis_client;
