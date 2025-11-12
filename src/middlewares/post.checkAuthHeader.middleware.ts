import { Request, Response, NextFunction } from 'express';

export function checkAuthHeader(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.headers['authorization']) {
        return res
            .status(404)
            .json({ success: false, error: 'Post not found' });
    }

    return next();
}
