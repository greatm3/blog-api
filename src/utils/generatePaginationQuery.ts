import { PostFilterQueryParams } from '../types/post.type';

// this is particularly for this blog api. would abstract it entirely later
export function generatePaginationQuery(fields: PostFilterQueryParams) {
    /**
     * SELECT p.id, p.title, p.slug, p.excerpt, p.status, p.view_count, p.created_at, p.updated_at, u.id AS author_id, u.email
     * AS author_email FROM posts AS p INNER JOIN users AS u ON p.user_id = u.id WHERE p.status = 'draft' AND u.email = 'test@gmail.com' AND (p.title ILIKE '%js%' OR p.content ILIKE '%js%') ORDER BY view_count DESC LIMIT 10 OFFSET 0;
     */

    let query =
        'SELECT p.id, p.title, p.slug, p.excerpt, p.status, p.view_count, p.created_at, p.updated_at, u.id AS author_id, u.email AS author_email FROM posts AS p INNER JOIN users AS u ON p.user_id = u.id';

    let count = 1;
    let endingExpression = '';

    Object.entries(fields).forEach((field) => {
        const [key, value] = field;

        if (value) {
            if (key == 'sort') {
                endingExpression += ' ORDER BY ';
                switch (value) {
                    case 'newest':
                        endingExpression += 'created_at DESC';
                        break;
                    case 'oldest':
                        endingExpression += 'created_at ASC';
                        break;
                    case 'popular':
                        endingExpression += 'view_count DESC';
                        break;
                    default:
                        break;
                }
            }
        }
    });

    query += endingExpression;

    return query;
}
