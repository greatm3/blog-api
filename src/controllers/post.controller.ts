import { Request, Response, NextFunction } from 'express';
import { generateExcerpt } from '../utils/excerpt.util';
import { generateSlug } from '../utils/slug.util';
import {
    validatePostsRequest,
    validateUpdatePostRequest,
} from '../utils/validation.util';
import { PostService } from '../services/post.service';
import appPool from '../db';
import { UpdatePostParams } from '../types/post.type';

const postService = new PostService(appPool);

export async function showAllPosts(req: Request, res: Response) {
    res.status(200).json({ test: 'working' });
}

export async function getPost(req: Request, res: Response) {
    if (req.params.slug) {
        const post = await postService.getPostBySlug(req.params.slug);

        if (post) {
            if (post.status === 'draft') {
                return res
                    .status(404)
                    .json({ success: false, error: 'Post not found' });
            }

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
            await postService.updatePost(req.params.slug, {
                view_count: post.view_count + 1,
            });

            return res.status(200).json(response);
        }
    }

    return res.status(404).json({ success: false, error: 'Post not found' });
}

// return the owner's post if the status is 'draft'
export async function getOwnerPost(req: Request, res: Response) {
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
            return res.status(200).json(response);
        }

        return res
            .status(404)
            .json({ success: false, error: 'Post not found' });
    }
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
        const validationResult = validatePostsRequest(title, content, status);

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
        next(new Error('Error generation slug/excerpt'));
    }
}

export async function updatePost(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const fields: UpdatePostParams = {};

    // if title and content exists, generate new slug and excerpt

    if (req.body.title) {
        fields.title = req.body.title;
        fields.slug = generateSlug(req.body.title);
    }

    if (req.body.content) {
        fields.content = req.body.content;
        fields.excerpt = generateExcerpt(req.body.title);
    }

    if (req.body.status) {
        fields.status = req.body.status;
    }

    const validationResult = validateUpdatePostRequest(
        fields.title,
        fields.content,
        fields.status
    );

    if (!validationResult.success) {
        const response = {
            success: false,
            error: JSON.parse(validationResult.error.message)[0].message,
        };

        return res.status(422).json(response);
    }

    const updatedPost = await postService.updatePost(req.params.slug, fields);

    if (updatedPost) {
        const response = {
            success: true,
            message: 'Post updated successfully',
            data: {
                post: {
                    id: updatedPost.id,
                    title: updatedPost.title,
                    slug: updatedPost.slug,
                    content: updatedPost.content,
                    excerpt: updatedPost.excerpt,
                    status: updatedPost.status,
                    view_count: updatedPost.view_count,
                    author: {
                        id: updatedPost.author_id,
                        email: updatedPost.author_email,
                    },
                    created_at: updatedPost.created_at,
                    updated_at: updatedPost.updated_at,
                },
            },
        };

        return res.status(200).json(response);
    }
}

export async function deletePost(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.params.slug) {
        const post = await postService.deletePost(req.params.slug);

        if (typeof post === 'boolean' && post) {
            return res.status(204).send("");
        }

        return res
            .status(404)
            .json({ success: false, error: 'Post not found' });
    }
}
