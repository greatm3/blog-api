import { Request, Response, NextFunction } from 'express';
import { generateExcerpt } from '../utils/excerpt.util';
import { generateSlug } from '../utils/slug.util';
import { validatePostsRequest } from '../utils/validation.util';
import { PostService } from '../services/post.service';
import appPool from '../db'; 

const postService = new PostService(appPool);

export async function showAllPosts(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.status(200).json({ test: 'working' });
}

export async function getPost(req: Request, res: Response, next: NextFunction) {
    if (req.params.slug) {
        const post = await postService.getPostBySlug(req.params.slug);

        if (post) {
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
            if (post.status === 'published') {
                await postService.updatePost(req.params.slug, {
                    view_count: post.view_count + 1,
                });

                return res.status(200).json(response);
            } else {
                return res.send('sddjfsdvnjks')
            }
        }

        return res
            .status(404)
            .json({ success: false, error: 'Post not found' });
    }
    return res.send('sddjfsdvnjks')
}

export async function createPost(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.body || !req.body.title || !req.body.content || !req.body.status) {
        return res.status(400).json({
            success: false,
            error: 'title, content and status are required',
        });
    }

    const { title, content, status } = req.body;

    const excerpt = generateExcerpt(content);
    const slug = generateSlug(title);

    if (excerpt && slug) {
        const validationResult = validatePostsRequest(
            title,
            content,
            excerpt,
            status,
            slug
        );

        if (!validationResult.success) {
            const response = {
                success: false,
                error: JSON.parse(validationResult.error.message)[0].message, // use the custom message i set in the validation utiility function
            };

            return res.status(422).json(response);
        }

        if (!req.user || typeof req.user !== 'object') {
            next(new Error('Cannot find user')); // i will find a way to send a better response, with proper fields.
        } else {
            const newPost = await postService.createPost(
                req.user.id,
                title,
                slug,
                content,
                excerpt,
                status
            );

            if (newPost) {
                const response = {
                    success: true,
                    message: 'Post created successfully',
                    data: {
                        post: {
                            id: newPost.id,
                            title: newPost.title,
                            slug: newPost.slug,
                            content: newPost.content,
                            excerpt: newPost.excerpt,
                            status: newPost.status,
                            view_count: newPost.view_count,
                            author: {
                                id: newPost.author_id,
                                email: newPost.author_email,
                            },
                            created_at: newPost.created_at,
                            updated_at: newPost.updated_at,
                        },
                    },
                };

                return res.status(201).json(response);
            }
        }
    } else {
        const response = {
            success: false,
            error: 'Error generating resource',
        };

        return res.status(500).json(response);
    }
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
