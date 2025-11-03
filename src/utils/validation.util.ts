import * as zod from 'zod';
import { StatusEnum, ZodPostValidation } from '../types/post.type';

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
    status: StatusEnum,
    slug: string
): zod.ZodSafeParseResult<ZodPostValidation> {
    const schema = zod.object({
        title: zod
            .string()
            .min(5, { message: 'title must be at least 5 characters' })
            .max(255, { message: 'title must not exceed 255 characters' }),
        content: zod
            .string()
            .min(50, { message: 'content must be at least 50 characters' }),
        excerpt: zod
            .string()
            .max(500, { message: 'excerpt must not exceed 500 characters' }),
        status: zod.string(),
        slug: zod.string(),
    });

    type PostRequestInferedFromSchema = zod.infer<typeof schema>;

    const postRequestParams: PostRequestInferedFromSchema = {
        title,
        content,
        excerpt,
        status,
        slug,
    };

    let result = schema.safeParse(postRequestParams)

    return result
}
