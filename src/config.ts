import * as dotenv from "dotenv";
dotenv.config();

export const config = {
    Token: process.env.TOKEN ?? '',
    DBHost: process.env.MYSQL_HOST ?? 'localhost',
    DBUser: process.env.MYSQL_USER ?? '',
    DBPassword: process.env.MYSQL_PASSWORD ?? '',
    DBName: process.env.MYSQL_DB_NAME ?? ''
}
