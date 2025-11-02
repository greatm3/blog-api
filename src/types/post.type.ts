export type status_enum = 'draft' | 'published'

export interface Post {
    id: number,
    user_id: number,
    title: string,
    slug: string,
    content: string,
    excerpt: string,
    status: status_enum,
    view_count: number,
    created_at: Date,
    updated_at: Date
}