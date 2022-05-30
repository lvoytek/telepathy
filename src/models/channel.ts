import { Channel } from "../types/channel";
import { db } from "../db";
import { OkPacket } from "mysql2";

export const create = (channel: Channel, callback: Function) => {
    const queryString = "INSERT INTO channels (channelid) VALUES (?);";

    db.query(queryString, [channel.id], (error, result) => {
        if(error)
            callback(error);
        else
            callback(null, <OkPacket> result);
    });
};
