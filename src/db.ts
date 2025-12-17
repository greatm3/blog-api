import { Pool } from "pg"
import { type PoolConfig } from "pg"
import dotenv from "dotenv"
import path from "path"

dotenv.config({
    path: path.resolve(__dirname, '../.env')
})

const dbConfig: PoolConfig = {
    connectionString: process.env.DATABASE_URL
}

const appPool = new Pool(dbConfig)

let connected = false; // control flag so, to stop continous side-effect on connection

appPool.on("connect", (client) => {
    if (!connected) {
        console.log("Database connected.");
        connected = true;
    }
})

appPool.on("error", (err, client) => {
    if (err instanceof Error) {
        console.error("Database error:", err.message);
    }
})

export default appPool
