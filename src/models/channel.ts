import { Channel } from "../types/channel";
import { db } from "../db";

export const create = (channel: Channel, callback: Function) => {
    const queryString = "INSERT INTO channels (channelid, user, network, spectator) VALUES (?, ?, ?, ?);";

    db.query(queryString, [channel.channelid, channel.user.userid, channel.network.networkid, channel.spectator], (error) => {
        callback((error) ? error : null);
    });
};
