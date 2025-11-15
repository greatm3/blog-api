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
    status: StatusEnum
): zod.ZodSafeParseResult<ZodPostValidation> {
    const schema = zod.object({
        title: zod
            .string()
            .min(5, { message: 'title must be at least 5 characters' })
            .max(255, { message: 'title must not exceed 255 characters' }),
        content: zod
            .string()
            .min(50, { message: 'content must be at least 50 characters' }),
        status: zod.enum(['draft', 'published'], {
            message: "status must be 'draft' or 'published'",
        }),
    });

    type PostRequestInferedFromSchema = zod.infer<typeof schema>;

    const postRequestParams: PostRequestInferedFromSchema = {
        title,
        content,
        status,
    };

    let result = schema.safeParse(postRequestParams);

    return result;
}


// validation schema for updatepost endpoint, all fields are optional

export function validateUpdatePostRequest(
    title?: string,
    content?: string,
    status?: StatusEnum
) {
    const schema = zod.object({
        title: zod
            .string()
            .min(5, { message: 'title must be at least 5 characters' })
            .max(255, { message: 'title must not exceed 255 characters' })
            .optional(),
        content: zod
            .string()
            .min(50, { message: 'content must be at least 50 characters' })
            .optional(),
        status: zod
            .enum(['draft', 'published'], {
                message: "status must be 'draft' or 'published'",
            })
            .optional(),
    });

    type UpdateRequestFieldsSchema = zod.infer<typeof schema>;

    const updateRequestFields: UpdateRequestFieldsSchema = {
        title,
        content,
        status,
    };

    let result = schema.safeParse(updateRequestFields);

    return result;
}
