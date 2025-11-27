import { PostFilterQueryParams } from '../types/post.type';

// this is particularly for this blog api. would abstract it entirely later, also returns another query fro counting
export function generatePaginationQuery(fields: PostFilterQueryParams) {
    let query = `SELECT p.id, p.title, p.slug, p.excerpt, p.status, p.view_count, p.created_at, p.updated_at, u.id AS author_id, u.email AS author_email FROM posts AS p INNER JOIN users AS u ON p.user_id = u.id WHERE p.status = 'published'`;
    let countQuery = `SELECT COUNT(*) FROM posts AS p INNER JOIN users AS u ON p.user_id = u.id WHERE p.status = 'published'`;
    let count = 0;
    let endingExpression = '';
    let middleExpression = '';
    const values: (string | number)[] = [];

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
            } else {
                if (key == 'author') {
                    middleExpression += ' AND u.email = ' + '$' + (count + 1);
                    if (fields.author) {
                        values.push(fields.author);
                    }
                    count++;
                } else if (key == 'search') {
                    if (middleExpression !== '') {
                        middleExpression +=
                            ' AND (title ILIKE $' +
                            (count + 1) +
                            ' OR content ILIKE $' +
                            (count + 1) +
                            ')';
                    } else {
                        middleExpression +=
                            ' AND (p.title ILIKE $' +
                            (count + 1) +
                            ' OR p.content ILIKE $' +
                            (count + 1) +
                            ')';
                    }
                    if (fields.search) {
                        values.push(`%${fields.search}%`);
                    }
                    count++;
                }
            }
        }
    });

    countQuery += middleExpression;

    if (!fields.sort) {
        endingExpression += ' ORDER BY created_at DESC';
    }

    let offset = 0;

    if (fields.limit && fields.page) {
        offset = fields.limit * fields.page - fields.limit;
        query +=
            middleExpression +
            endingExpression +
            ' LIMIT ' +
            fields.limit +
            ' OFFSET ' +
            offset;
    }

    return { query, countQuery, values };
}
