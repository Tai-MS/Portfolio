import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

dotenv.config()
export const constants = {
    PORT: process.env.PORT,
    MONGO_CONNECT: process.env.MONGO_CONNECT,
    SECRET_KEY: process.env.SECRET_KEY,
    ENVIRONMENT: process.env.ENVIRONMENT,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    USERMAILER: process.env.USERMAILER,
    PASSMAILER: process.env.PASSMAILER
} 

// Correcting __dirname to point to the root directory
export const rootDir = join(__dirname, '../')
