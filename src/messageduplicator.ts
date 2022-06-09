import { Message, Client, TextChannel } from "discord.js";
import { Channel } from "./types/channel";
import * as channelQuery from "./models/channel";
import { BasicUser } from "./types/user";
import * as bondQuery from "./models/bond";
import { QueryError } from "mysql2";
import { BasicNetwork } from "./types/network";

export const handleMessage = async (client: Client, message: Message): Promise<void> => {
    if (message.channel.isText() && !message.author.bot && !message.content.startsWith("@self")) {
        channelQuery.get(message.channelId, (error: QueryError | null, channel: Channel) => {
            if (!error && channel) {
                bondQuery.getAllBondedUsers(
                    { userid: message.author.id },
                    channel.network,
                    (error: QueryError | null, users: BasicUser[]) => {
                        if (error)
                            (message.channel as TextChannel).send(
                                "Encountered database error while trying to send message"
                            );
                        else sendDuplicateMessagesToUsers(message, users, channel.network);
                    }
                );
            }
        });
    }
};

export const sendDuplicateMessage = async (message: Message, channel: Channel) => {
    if (message.guild) {
        const sendChannel = await message.guild.channels.fetch(channel.channelid);
        if (sendChannel && sendChannel.type === "GUILD_TEXT") {
            sendChannel.send({
                files: Array.from(message.attachments.values()),
                content: message.content ? message.content : " "
            });
        }
    }
};

export const sendDuplicateMessagesToUsers = async (message: Message, users: BasicUser[], network: BasicNetwork) => {
    users.forEach((user) => {
        channelQuery.getChannelFromNetworkAndUser(network, user, (error: QueryError | null, toChannel: Channel) => {
            if (error) {
                if (message.guild) {
                    message.guild.members.fetch(user.userid).then((attemptedUser) => {
                        const attemptedUserName = attemptedUser.nickname ?? attemptedUser.displayName;
                        (message.channel as TextChannel).send(
                            "Encountered database error while trying to send message to " + attemptedUserName
                        );
                    });
                }
            } else {
                sendDuplicateMessage(message, toChannel);
            }
        });
    });
};
