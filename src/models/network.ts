import { Network } from "../types/network";
import { db } from "../db";
import { OkPacket } from "mysql2";

export const create = (network: Network, callback: Function) => {
    const queryString = "INSERT INTO networks (name, spectatorid) VALUES (?, ?);";

    db.query(queryString, [network.name, network.spectatorid], (error, result) => {
        if(error)
            callback(error);
        else
            callback(null, (<OkPacket> result).insertId);
    });
};
