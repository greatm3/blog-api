export type StatusEnum = 'draft' | 'published';

export type PostRequest = {
    title: string;
    content: string; 
};

export type PostRequestParams = PostRequest & {
    status: StatusEnum;
};

export type ZodPostValidation = PostRequest & { status: string };

export interface Post {
    id: number;
    author_id: number;
    author_email: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    status: StatusEnum;
    view_count: number;
    created_at: Date;
    updated_at: Date;
}

export type UpdatePostParams = {
    title?: string;
    content?: string;
    excerpt?: string;
    status?: StatusEnum;
    view_count?: number;
    slug?: string;
    updated_at?: string;
};

export interface PostServiceType<Post> {
    createPost(
        user_id: number,
        title: string,
        slug: string,
        content: string,
        excerpt: string,
        status: StatusEnum
    ): Promise<Post | undefined>;

    updatePost(
        slug: string,
        updateFields: UpdatePostParams
    ): Promise<Post | undefined>;

    deletePost(slug: string): Promise<boolean | undefined>;

    getPosts(): Promise<Post[] | undefined>;
    getPostByUserID(userID: number): Promise<Post[] | undefined>;
    getPostBySlug(slug: string): Promise<Post | undefined>;
}
