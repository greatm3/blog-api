import { createClient } from "redis";
import dotenv from "dotenv";
import path from "path";

const MAX_RETRIES = 5; // the maximum number of times the redis client would try to reconnect if server is unavailable.

dotenv.config({
    path: path.resolve(__dirname, ".env"),
});

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
    socket: {
        reconnectStrategy: (retries) => {
            if (retries >= MAX_RETRIES) {
                console.error(
                    `Max retries (${MAX_RETRIES}) reached. Stop connection attempts.`
                );
                return new Error("Max retries reached");
            }

            return 5000; // retry every 1 second.
        },
    },
});

redisClient.on("error", (err) => console.log("Redis Error:", err));

export async function connectRedis() {
    await redisClient.connect();
    console.log("Redis connected");
}

export default redisClient;
