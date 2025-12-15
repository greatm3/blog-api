import { createClient } from 'redis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.resolve(__dirname, '.env')
});

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Error:', err));

export async function connectRedis() {
    await redisClient.connect()
    console.log('Redis connected')
}

export default redisClient;
