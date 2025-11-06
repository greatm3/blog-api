import appPool from '../db';
import { Post, PostServiceType, StatusEnum } from '../types/post.type';

export class PostService implements PostServiceType<Post> {
    constructor(private readonly db = appPool) {}

    async getPostBySlug(slug: string): Promise<Post | undefined> {
        try {
            const post = await this.db.query(
                `
                SELECT 
                    p.id,
                    u.id AS author_id, 
                    u.email AS author_email,
                    p.title, 
                    p.slug, 
                    p.content, 
                    p.excerpt, 
                    p.status, 
                    p.view_count, 
                    p.created_at, 
                    p.updated_at, 
                FROM posts AS p INNER JOIN users AS u ON p.user_id = u.id WHERE p.slug = $1
            `,
                [slug]
            );
            return post.rows[0];
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.stack, 'error getting post');
                throw new Error('error getting post');
            }
        }
    }

    async getPostByUserID(userID: number): Promise<Post[] | undefined> {
        try {
            const post = await this.db.query(
                `
                SELECT 
                    p.id,
                    u.id AS author_id, 
                    u.email AS author_email,
                    p.title, 
                    p.slug, 
                    p.content, 
                    p.excerpt, 
                    p.status, 
                    p.view_count, 
                    p.created_at, 
                    p.updated_at, 
                FROM posts AS p INNER JOIN users AS u ON p.user_id = u.id WHERE u.id = $1
            `,
                [userID]
            );

            return post.rows;
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.stack, 'error getting user posts');
                throw new Error('error getting user posts');
            }
        }
    }

    async getPosts(): Promise<Post[] | undefined> {
        // only return published posts
        try {
            const posts = await this.db.query(
                `
                SELECT 
                    p.id,
                    u.id AS author_id, 
                    u.email AS author_email,
                    p.title, 
                    p.slug,  
                    p.excerpt, 
                    p.status, 
                    p.view_count, 
                    p.created_at, 
                    p.updated_at, 
                FROM posts AS p INNER JOIN users AS u ON p.user_id = u.id WHERE p.status = $1
            `,
                ['published']
            );

            return posts.rows;
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.stack, 'error getting posts');
                throw new Error('error getting posts');
            }
        }
    }

    async createPost(
        user_id: number,
        title: string,
        slug: string,
        content: string,
        excerpt: string,
        status: StatusEnum
    ): Promise<Post | undefined> {
        try {
            // check if slug exists
            if (!(await this.getPostBySlug(slug))) {
                const now = new Date().toISOString();

                await this.db.query(
                    `
                    INSERT INTO posts 
                        (user_id, title, slug, content, excerpt, status, created_at, updated_at) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                    [user_id, title, slug, content, excerpt, status, now, now]
                );

                const newPost = await this.getPostBySlug(slug);

                return newPost;
            }
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.stack, 'error creating post');
                throw new Error('error creating post');
            }
        }
    }
}
