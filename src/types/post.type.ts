export type StatusEnum = 'draft' | 'published';

export type PostRequest = {
    title: string;
    content: string;
    excerpt: string;
};

export type PostRequestParams = PostRequest & {
    status: StatusEnum;
};

export type ZodPostValidation = PostRequest & { slug: string; status: string };

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
        postID: number,
        title?: string,
        content?: string,
        excerpt?: string,
        status?: StatusEnum
    ): Promise<Post | undefined>;

    deletePost(postID: number): Promise<boolean | undefined>

    getPosts(): Promise<Post[] | Error>;
    getPostByUserID(userID: number): Promise<Post[] | undefined>;
    getPostBySlug(slug: string): Promise<Post | undefined>
}
