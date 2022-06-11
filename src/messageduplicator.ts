import { Message, Client, TextChannel } from "discord.js";
import { Channel } from "./types/channel";
import * as channelQuery from "./models/channel";
import { BasicUser } from "./types/user";
import * as bondQuery from "./models/bond";
import { QueryError } from "mysql2";
import { BasicNetwork } from "./types/network";

export const handleMessage = async (client: Client, message: Message): Promise<void> => {
    if (message.channel.isText() && !message.author.bot && !message.content.startsWith("@self")) {
        // Check for mention at beginning of message
        if (message.content.startsWith("<@") && message.content.indexOf(">")) {
            const mentionID = message.content.slice(2, message.content.indexOf(">"));
            channelQuery.get(message.channelId, (error: QueryError | null, channel: Channel) => {
                if (!error && channel) {
                    bondQuery.doesBondExist(
                        { userid: message.author.id },
                        { userid: mentionID },
                        channel.network,
                        (bondError: QueryError | null, bondExists: boolean) => {
                            if (!bondError) {
                                if (!bondExists) {
                                    message.reply("<@" + mentionID + "> is not bonded to you.");
                                } else {
                                    channelQuery.getChannelFromNetworkAndUser(
                                        channel.network,
                                        { userid: mentionID },
                                        (otherChannelError: QueryError | null, otherChannel: Channel) => {
                                            if (!otherChannelError && otherChannel)
                                                sendDuplicateMessage(message, otherChannel);
                                        }
                                    );
                                }
                            }
                        }
                    );
                }
            });
        // Send to all connections
        } else {
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
    }
};

export const sendDuplicateMessage = async (message: Message, channel: Channel) => {
    if (message.guild) {
        const sendChannel = await message.guild.channels.fetch(channel.channelid);
        if (sendChannel && sendChannel.type === "GUILD_TEXT") {
            const fromUser = await message.guild.members.fetch(message.author.id);
            const fromUserName = fromUser.nickname ?? fromUser.displayName ?? "Telepathy";
            const msgHook = (await sendChannel.fetchWebhooks()).first();

            if (msgHook) {
                if (msgHook.name != fromUserName)
                    await msgHook.edit({ name: fromUserName, avatar: message.author.avatarURL() });
                await msgHook.send({
                    files: Array.from(message.attachments.values()),
                    content: message.content ? message.content : " "
                });
            }
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
