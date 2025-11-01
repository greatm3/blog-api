import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export async function generateToken(
    payload: string | object | Buffer<ArrayBufferLike>
) {
    try {
        if (process.env.JWT_SIGN_KEY) {
            const token = jwt.sign(payload, process.env.JWT_SIGN_KEY, {
                expiresIn: '24h',
            });
            return token;
        }
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.stack);
            throw err;
        }
    }
}

export async function verifyToken(token: string) {
    try {
        if (process.env.JWT_SIGN_KEY) {
            const decodedValue = jwt.verify(token, process.env.JWT_SIGN_KEY);
            return decodedValue;
        }
    } catch (err) {
        if (err instanceof Error) {
            if (
                err.name === 'JsonWebTokenError' ||
                err.name === 'TokenExpiredError'
            ) {
                throw err;
            } else {
                console.error(err.stack);
                throw err;
            }
        }
    }
}