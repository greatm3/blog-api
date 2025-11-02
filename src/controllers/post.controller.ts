import { Request, Response, NextFunction } from 'express';

export async function showAllPosts(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.status(200).json({ test: 'working' });
}
