import { NextFunction, Request, Response } from 'express';
import { PostService } from '../services/post.service';

export async function isResourceOwner(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const post = await new PostService().getPostBySlug(req.params.slug);

    if (post) {
        if (req.user && typeof req.user === 'object') {
            if (req.user.id === post.author_id) {
                return next();
            }

            const response = {
                success: false,
                error: 'you do not own this resource',
            };

            return res.status(403).json(response);
        }
    }
}
