import { Request, Response, NextFunction } from 'express';

export function checkAuthHeader(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.headers['authorization']) {
        return next('route')
    }

    return next();
}
