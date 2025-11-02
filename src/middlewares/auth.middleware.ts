import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';

export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.headers['authorization']) {
        const response = {
            success: false,
            error: 'No authorization token provided',
        };

        return res.status(401).json(response);
    }

    const authToken = req.headers['authorization'].split(' ')[1];

    try {
        const payload = await verifyToken(authToken);
        req.user = payload;
        next();
    } catch (err) {
        if (err instanceof Error) {
            // return response based on ErrorName
            if (err.name === 'JsonWebTokenError') {
                const response = {
                    success: false,
                    error: 'Invalid token',
                };
                return res.status(401).json(response);
            } else if (err.name === 'TokenExpiredError') {
                const response = {
                    success: false,
                    error: 'Token expired',
                };
                return res.status(401).json(response);
            } else {
                return next(err);
            }
        }
    }
}
