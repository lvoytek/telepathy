import { Channel } from "../types/channel";
import { db } from "../db";

export const create = (channel: Channel, callback: Function) => {
    const queryString = "INSERT INTO channels (channelid, user, network) VALUES (?, ?, ?);";

    db.query(queryString, [channel.channelid, channel.user.userid, channel.network.networkid], (error) => {
        callback((error) ? error : null);
    });
};
