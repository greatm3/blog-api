export type StatusEnum = 'draft' | 'published';

export type PostRequest = {
    title: string;
    content: string;
    excerpt: string;
    status: StatusEnum;
};

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
