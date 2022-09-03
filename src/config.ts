import path from 'path'

export const DOMAIN       = process.env.DOMAIN
export const SERVER_PORT  = process.env.SERVER_PORT
export const PUBLIC_PATH  = path.resolve(__dirname, '../', 'public')
export const PRIVATE_PATH = path.resolve(__dirname, '../', 'private')
export const UPLOADS_PATH = path.resolve(__dirname, '../', 'public', 'uploads')

export const DB = {
    client: process.env.DB_CLIENT,
    port: process.env.PG_PORT,
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE
}

export const LOCALES_ENUM = [
    'ar',
    'en'
]
