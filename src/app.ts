import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { authRouter } from './routes/auth.route';
import { postRouter } from './routes/post.route'
import { errorHandler } from './middlewares/error_handler.middleware';

import { connectRedis } from './config/redis'

dotenv.config({
    path: path.resolve(__dirname, '.env'),
});

const app = express();
const PORT = process.env.PORT || 3000;

// using an IIEE because of my typescript configuration
// i can't use await in a top level, without changing the module type in tsconfig.
(async () => {
    try {
        await connectRedis();
    } catch (err) {
        if (err instanceof Error) {
            console.error("Redis connection error", err.message)
        }
    }
})()

app.use(express.json());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
    })
);

// use routers
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter)


// error handler
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Blog API service started @${PORT}`)
})
