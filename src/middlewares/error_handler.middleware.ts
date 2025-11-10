import { Request, Response, NextFunction } from 'express';

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    console.error(err.stack);

    switch (message) {
        case 'Email already exists':
            return res.status(409).json({
                success: false,
                error: 'User with this email already exists',
            });
        case 'slug exists':
            return res.status(409).json({
                success: false,
                error: 'post with slug already exists',
            });

        default:
            return res.status(status).json({
                success: false,
                error: message,
            });
    }
}
