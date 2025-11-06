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
                console.log(
                    err.stack,
                    'a post with similar title already exists'
                );
                throw new Error('a post with similar title already exists');
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
                console.log(
                    err.stack,
                    'error getting user posts'
                );
                throw new Error('error getting user posts');
            }
        }
    }
}
