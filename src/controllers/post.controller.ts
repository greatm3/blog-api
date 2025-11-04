import { Request, Response, NextFunction } from 'express';

export async function showAllPosts(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.status(200).json({ test: 'working' });
}

export async function createPost(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.body || !req.body.title || !req.body.content) {
        return res
            .status(400)
            .json({ success: false, error: 'title and content are required' });
    }

    const { title, content, excerpt, status } = req.body;
    
    // if (!exc)
}

export async function updatePost(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.status(200).json({ test: 'working' });
}

export async function deletePost(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.status(200).json({ test: 'working' });
}
