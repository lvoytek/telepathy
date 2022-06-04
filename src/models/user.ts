import { User } from "../types/user";
import { db } from "../db";

export const create = (user: User, callback: Function) => {
    const queryString = "INSERT INTO users (userid) VALUES (?);";

    db.query(queryString, [user.userid], (error) => {
        callback((error) ? error : null);
    });
};
