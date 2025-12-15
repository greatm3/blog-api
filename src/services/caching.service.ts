import redisClient from '../config/redis'
import { Post } from '../types/post.type';

export default class CacheService {

    static async get(key: string): Promise<Post | null> {

        const data = await redisClient.get(key);

        return data ? JSON.parse(data) : null
    }

    static async set(key: string, value: string, ttl: number): Promise<string | null> {

        const response = await redisClient.set(key, value, {
            EX: ttl,
            // condition: 'NX'
        })

        return response;

    }

    static async del(key: string): Promise<number> {

        const response = await redisClient.del(key);

        return response;

    }

    static async delPattern(pattern: string): Promise<string[]> {
        const keys = await redisClient.keys(pattern);

        if (keys.length > 0) {
            await redisClient.del(keys)
        }

        return keys;
    }
}
