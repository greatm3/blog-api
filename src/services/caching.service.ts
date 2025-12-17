import redisClient from '../config/redis'
import { Post } from '../types/post.type';

export default class CacheService {

    static async get(key: string): Promise<Post | null | undefined> {

        try {

            const data = await redisClient.get(key);
            return data ? JSON.parse(data) : null

        } catch (err) {
            if (err instanceof Error) {
                console.error("[Cache Error - get]:", err.message);
            }
        }
    }

    static async set(key: string, value: string, ttl?: number): Promise<string | null | undefined> {

        try {

            const response = await redisClient.set(key, value)

            if (typeof ttl == "number") {
                await redisClient.setEx(key, ttl, value)
            }

            return response;

        } catch (err) {
            if (err instanceof Error) {
                console.log("[Cache Error - set]:", err.message);
            }
        }

    }

    static async del(key: string): Promise<number | undefined> {

        try {
            const response = await redisClient.del(key);

            return response;

        } catch (err) {
            if (err instanceof Error) {
                console.error("[Cache Error - del]:", err.message)
            }
        }


    }

    static async delPattern(pattern: string): Promise<string[] | undefined> {

        try {
            const keys = await redisClient.keys(pattern);

            if (keys.length > 0) {
                await redisClient.del(keys)
            }

            return keys;

        } catch (err) {
            if (err instanceof Error) {
                console.error("[Cache Error - delPattern]:", err.message)
            }
        }
    }

    // return true | false if the key exists in cache
    static async isSet(key: string): Promise<boolean | undefined> {

        try {
            return await redisClient.exists(key) ? true : false;
        } catch (err) {
            if (err instanceof Error) {
                console.error("[Cache Error - isSet]:", err.message)
            }
        }
    }

    static async incrementValue(key: string): Promise<boolean | undefined> {

        try {
            return await redisClient.incr(key) ? true : false;
        } catch (err) {
            if (err instanceof Error) {
                console.error("[Cache Error - incrementValue]:", err.message)
            }
        }
    }
}
