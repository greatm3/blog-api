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
                const response = {
                    success: true,
                    data: {
                        post: {
                            id: post.id,
                            title: post.title,
                            slug: post.slug,
                            content: post.content,
                            excerpt: post.excerpt,
                            status: post.status,
                            view_count: post.view_count,
                            author: {
                                id: post.author_id,
                                email: post.author_email,
                            },
                            created_at: post.created_at,
                            updated_at: post.updated_at,
                        },
                    },
                };
                return res.status(200).json(response);
            }

            const response = {
                success: false,
                error: 'you do not own this resource',
            };

            return res.status(403).json(response);
        }
        return res.send('dfsdsfsdfsdf');
    }
}
