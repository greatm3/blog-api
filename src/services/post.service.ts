import appPool from '../db';
import {
    Post,
    PostServiceType,
    StatusEnum,
    UpdatePostParams,
} from '../types/post.type';
import { generateUpdateQuery } from '../utils/generateUpdateQuery.util';

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
                    p.updated_at
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
            const benchPost = await this.getPostBySlug(slug);
            if (benchPost === undefined) {
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
            } else {
                throw new Error('slug exists');
            }
        } catch (err) {
            if (err instanceof Error) {
                if (err.message == '')
                    console.log(err.stack, 'error creating post');
                throw new Error(
                    err.message === 'slug exists'
                        ? err.message
                        : 'error creating post'
                );
            }
        }
    }

    async updatePost(
        slug: string,
        updateFields: UpdatePostParams
    ): Promise<Post | undefined> {
        const updateFieldsWithTime = updateFields;
        updateFieldsWithTime.updated_at = new Date().toISOString(); // use current time to add to post table, updated_at column

        try {
            const updateQuery = generateUpdateQuery(
                'posts',
                updateFieldsWithTime,
                'slug',
                slug
            );

            const post = await this.db.query(
                updateQuery.query,
                updateQuery.params
            );

            if (post) {
                // get the updated post, using the new slug, this is because the getPostBySlug query has a join statement important for response
                return await this.getPostBySlug(post.rows[0].slug);
            }
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.stack, 'error updating post');
                throw new Error('error updating post');
            }
        }
    }

    async deletePost(slug: string): Promise<boolean | undefined> {
        try {
            const post = await this.db.query(
                `DELETE FROM posts WHERE slug = $1`,
                [slug]
            );
            return post.rowCount ? post.rowCount > 0 : false;
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.stack, 'error deleting post');
                throw new Error('error deleting post');
            }
        }
    }
}
