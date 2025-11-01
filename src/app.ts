import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { authRouter } from './routes/auth.route';
import { errorHandler } from './middlewares/error_handler.middleware';

dotenv.config({
    path: path.resolve(__dirname, '.env'),
});

const app = express();
const PORT = process.env.PORT || 3000


app.use(express.json());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
    })
);

// use routers
app.use('/api/auth', authRouter);


// error handler
app.use(errorHandler)



app.listen(PORT, () => {
    console.log(`Blog API service started @${PORT}`)
})