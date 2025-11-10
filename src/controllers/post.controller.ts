import { Request, Response, NextFunction } from 'express';
import { generateExcerpt } from '../utils/excerpt.util';
import { generateSlug } from '../utils/slug.util';
import { validatePostsRequest } from '../utils/validation.util';
import { PostService } from "../services/post.service"
import appPool from '../db';

const postService = new PostService(appPool)

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
    if (!req.body || !req.body.title || !req.body.content || !req.body.status) {
        return res
            .status(400)
            .json({ success: false, error: 'title, content and status are required' });
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

        const newPost = await 

        const response = {
            success: true,
            message: 'Post created successfully',
            data: {

            }
        }

        return res.status(201).json(response)
        
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
