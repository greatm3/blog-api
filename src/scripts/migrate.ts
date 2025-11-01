import appPool from '../db';

async function createUsersTable() {
    await appPool.query(
        `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        )`
    );
    console.log('Users table created.')
}

async function createStatusEnum() {
    await appPool.query(
        `CREATE TYPE IF NOT EXISTS status_enum AS ENUM ('draft', 'published')
        `
    );
    console.log('Status Enum created.')
}

async function createPostsTable() {
    await appPool.query(
        `CREATE TABLE IF NOT EXISTS posts (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            content TEXT,
            excerpt TEXT,
            status status_enum DEFAULT 'draft',
            view_count INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
        `
    );
    console.log('Posts table created.')
}

async function createIndexes() {
    await appPool.query(
        `CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id)`
    );

    await appPool.query(
        `CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC)`
    );
    console.log('Indexes created.')
}


async function up() {
    try {
        console.log('Running migrations.')
        await createUsersTable();
        await createStatusEnum();
        await createPostsTable();
        await createIndexes();
        console.log('Migrations done.')
    } catch (err) {
        if (err instanceof Error) {
            console.log('Migration Failed!')
            console.error(err.stack)
        }
    }
}

up();