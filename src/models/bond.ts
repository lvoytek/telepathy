import { Bond } from "../types/bond";
import { db } from "../db";
import { QueryError, ResultSetHeader, RowDataPacket } from "mysql2";
import { BasicUser } from "../types/user";
import { BasicNetwork, Network } from "../types/network";

export const create = (bond: Bond, callback: Function) => {
    const queryString = "INSERT INTO bonds (user1, user2, network) VALUES (?, ?, ?);";

    // Check if entry already exists since undirected bonds can have swapped user orders
    doesBondExist(bond.user1, bond.user2, bond.network, (error: QueryError | null, alreadyExists: boolean) => {
        if (error) {
            console.log("Error checking if bond exists: " + error.code);
            callback(error);
        } else {
            // Add bond if it is new
            if (alreadyExists) callback(null, false);
            else {
                db.query(queryString, [bond.user1.userid, bond.user2.userid, bond.network.networkid], (error) => {
                    if (error) callback(error);
                    else callback(null, true);
                });
            }
        }
    });
};

export const remove = (bond: Bond, callback: Function) => {
    // Remove any connections where either user is user1 and the other is user2 and vice versa
    const queryString = "DELETE FROM bonds WHERE user1=? AND user2=? AND network=?;";

    db.query(queryString, [bond.user1.userid, bond.user2.userid, bond.network.networkid], (error, result: ResultSetHeader) => {
        if (error) callback(error);
        else {
            db.query(queryString, [bond.user2.userid, bond.user1.userid, bond.network.networkid], (error, result2: ResultSetHeader) => {
                if(error) callback(error);
                else callback(null, result.affectedRows > 0 || result2.affectedRows > 0);
            });
        }
    });
};

export const doesBondExist = (from: BasicUser, to: BasicUser, network: BasicNetwork, callback: Function) => {
    const queryString =
        "SELECT c.* FROM bonds as c WHERE c.network=? AND ((c.user1=? AND c.user2=?)" +
        " OR (c.user2=? AND c.user1=?))";

    db.query(queryString, [network.networkid, from.userid, to.userid, from.userid, to.userid], (error, result) => {
        if (error) callback(error);
        else callback(null, (<RowDataPacket[]>result).length > 0);
    });
};
