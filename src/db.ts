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

export default appPool