import { Request, Response, NextFunction } from 'express';

export function checkAuthHeader(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.headers['authorization']) {
        const response = {
            success: false,
            error: 'Post not found',
        };

        return res.status(404).json(response);
    } else {
        return next();
    }
}
