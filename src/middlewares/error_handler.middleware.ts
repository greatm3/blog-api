import { Request, Response, NextFunction } from 'express';

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    if (message === 'Email already exists') {
        return res.status(409).json({
            success: false,
            error: 'User with this email already exists',
        });
    }

    console.error(err.stack);

    return res.status(status).json({
        success: false,
        error: message,
    });
}