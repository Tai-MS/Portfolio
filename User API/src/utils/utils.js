import { dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

dotenv.config()
export const constants = {
    PORT: process.env.PORT,
    MONGO_CONNECT: process.env.MONGO_CONNECT,
    SECRET_KEY: process.env.SECRET_KEY,
    ENVI: process.env.ENVI,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL
}

