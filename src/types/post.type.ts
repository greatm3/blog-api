export type StatusEnum = 'draft' | 'published';

export type PostRequest = {
    title: string;
    content: string;
    excerpt: string;
};

export type PostRequestParams = PostRequest & {
    status: StatusEnum
}

export type ZodPostValidation = PostRequest & { slug: string, status: string };

export interface Post {
    id: number;
    user_id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    status: StatusEnum;
    view_count: number;
    created_at: Date;
    updated_at: Date;
}
