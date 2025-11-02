import * as zod from 'zod';
import { StatusEnum, PostRequest } from '../types/post.type';

export function validateAuthRequest(
    email: string,
    password: string
): zod.ZodSafeParseResult<{ email: string; password: string }> {
    const schema = zod.object({
        email: zod.email(),
        password: zod
            .string()
            .min(8, { message: 'Password must be at least 8 characters' })
            .regex(/[A-Z]/, {
                message: 'Password must contain at least one uppercase letter',
            })
            .regex(/[a-z]/, {
                message: 'Password must contain at least one lowercase letter',
            })
            .regex(/[0-9]/, {
                message: 'Password must contain at least one number',
            })
            .regex(/[!@#$%^&*]/, {
                message: 'Password must contain at least one special character',
            }),
    });

    const requestParams = {
        email,
        password,
    };

    const result = schema.safeParse(requestParams);

    return result;
}

export function validatePostsRequest(
    title: string,
    content: string,
    excerpt: string,
    status: StatusEnum
): zod.ZodSafeParseResult<PostRequest> {
    const schema = zod.object({
        title: zod
            .string()
            .min(5, { message: 'title must be at least 5 characters' })
            .max(255, { message: 'title must not exceed 255 characters' }),
    });
}
