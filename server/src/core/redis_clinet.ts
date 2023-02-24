import redis from "redis";
import env from "./env";
const redis_client = () => {
  const client = redis.createClient({
    url: env.getRedisURL(),
  });
  client.on("connect", () => {
    console.log(`redis is connect on`);
  });
  client.connect();
};
export default redis_client;
