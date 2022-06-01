import { User } from "../types/user";
import { db } from "../db";

export const create = (user: User, callback: Function) => {
    const queryString = "INSERT INTO users (userid, spectator) VALUES (?, ?);";

    db.query(queryString, [user.userid, user.spectator], (error) => {
        callback((error) ? error : null);
    });
};
