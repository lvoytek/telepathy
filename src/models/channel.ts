import { Channel } from "../types/channel";
import { db } from "../db";
import { RowDataPacket } from "mysql2";
import { BasicNetwork } from "src/types/network";
import { BasicUser } from "src/types/user";

export const create = (channel: Channel, callback: Function) => {
    const queryString = "INSERT INTO channels (channelid, user, network, spectator) VALUES (?, ?, ?, ?);";

    db.query(
        queryString,
        [channel.channelid, channel.user.userid, channel.network.networkid, channel.spectator],
        (error) => {
            callback(error ? error : null);
        }
    );
};

export const get = (channelID: string, callback: Function) => {
    const queryString = "SELECT c.* FROM channels AS c WHERE c.channelid=?";

    db.query(queryString, channelID, (error, result) => {
        if (error) callback(error);
        else {
            const row = (<RowDataPacket>result)[0];
            if (!row) callback(null, null);
            else {
                const channel: Channel = {
                    channelid: channelID,
                    user: { userid: row.user },
                    network: { networkid: row.network },
                    spectator: row.spectator
                };

                callback(null, channel);
            }
        }
    });
};

export const getChannelFromNetworkAndUser = (network: BasicNetwork, user: BasicUser, callback: Function) => {
    const queryString = "SELECT c.* FROM channels AS c WHERE c.network=? AND c.user=?";

    db.query(queryString, [network.networkid, user.userid], (error, result) => {
        if (error) callback(error);
        else {
            const row = (<RowDataPacket>result)[0];
            if (!row) callback(null, null);
            else {
                const channel: Channel = {
                    channelid: row.channelid,
                    user,
                    network,
                    spectator: row.spectator
                };

                callback(null, channel);
            }
        }
    });
};
