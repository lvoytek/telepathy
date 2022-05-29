import mysql from "mysql2";
import { config } from "./config";

export const db = mysql.createConnection({
    host: config.DBHost,
    user: config.DBUser,
    password: config.DBPassword,
    database: config.DBName
});
