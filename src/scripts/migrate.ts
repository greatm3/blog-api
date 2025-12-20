import appPool from "../db";

const MAX_RETRIES = 5;

export const sleep = (ms: number, resolve: () => void) => {
    return new Promise((_resolve) => {
        setTimeout(() => {
            resolve;
        }, ms);
    });
};

async function createUsersTable() {
    await appPool.query(
        `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        )`
    );
    console.log("Users table created.");
}

async function createStatusEnum() {
    const exists = await appPool.query(`
        SELECT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'status_enum'
        )
    `);

    if (!exists.rows[0].exists) {
        await appPool.query(
            `CREATE TYPE status_enum AS ENUM ('draft', 'published')`
        );
        console.log("Status enum created.");
    } else {
        console.log("Status enum already exists.");
    }
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
            updated_at TIMESTAMP DEFAULT NOW(),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
        `
    );
    console.log("Posts table created.");
}

async function createIndexes() {
    await appPool.query(
        `CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id)`
    );

    await appPool.query(
        `CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC)`
    );
    console.log("Indexes created.");
}

let success = false;

async function up() {
    try {
        console.log("Running migrations.");
        await createUsersTable();
        await createStatusEnum();
        await createPostsTable();
        await createIndexes();
        console.log("Migrations done.");

        success = true;
    } catch (err) {
        for (let i = 0; i < MAX_RETRIES; i++) {
            
        }

        if (err instanceof Error) {
            console.log("Migration Failed!");
            console.error(err.stack);
        }
    }
}

