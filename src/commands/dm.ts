import { ApplicationCommandOption, BaseCommandInteraction, Client, GuildMember, TextChannel } from "discord.js";
import { Command } from "../command";
import { Channel } from "../types/channel";
import * as channelQuery from "../models/channel";
import * as bondQuery from "../models/bond";
import { QueryError } from "mysql2";

export const DirectMessage: Command = {
    name: "dm",
    description: "DM a user in your telepathic group",
    type: "CHAT_INPUT",
    options: [
        {
            name: "user",
            description: "Name of the user to dm",
            type: "USER",
            required: true
        } as ApplicationCommandOption,
        {
            name: "message",
            description: "The message to send",
            type: "STRING",
            required: true
        } as ApplicationCommandOption
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const channelID = interaction.channelId;

        const currentUserID = interaction.user.id;
        const dmUser = interaction.options.getMember("user") as GuildMember;
        const dmUserName = dmUser.nickname ?? dmUser.displayName;

        if (interaction.guild) {
            // User is talking to themself
            if (currentUserID == dmUser.id) {
                sendDM(interaction, channelID, (success: boolean) => {
                    if (success) {
                        interaction.followUp({
                            ephemeral: false,
                            content: "You sent a message to yourself"
                        });
                    } else {
                        interaction.followUp({
                            ephemeral: false,
                            content: "Message failed to send to yourself"
                        });
                    }
                });

                // Send to someone else
            } else {
                channelQuery.get(channelID, (error: QueryError | null, channel: Channel) => {
                    if (error) {
                        interaction.followUp({
                            ephemeral: false,
                            content: "Failed to get channel, database error"
                        });
                    } else {
                        if (!channel) {
                            interaction.followUp({
                                ephemeral: false,
                                content:
                                    "This channel is not connected to a telepathy network, use a connected channel to dm someone."
                            });
                        } else {
                            bondQuery.doesBondExist(
                                { userid: currentUserID },
                                { userid: dmUser.id },
                                channel.network,
                                (bondError: QueryError | null, bondExists: boolean) => {
                                    if (bondError) {
                                        interaction.followUp({
                                            ephemeral: false,
                                            content: "Failed to find bond, database error"
                                        });
                                    } else {
                                        if (!bondExists) {
                                            const content = "<@" + dmUser.id + "> is not bonded to you.";
                                            interaction.followUp({
                                                ephemeral: false,
                                                content
                                            });
                                        } else {
                                            channelQuery.getChannelFromNetworkAndUser(
                                                channel.network,
                                                { userid: dmUser.id },
                                                (otherChannelError: QueryError | null, otherChannel: Channel) => {
                                                    if (!otherChannelError && otherChannel) {
                                                        sendDM(
                                                            interaction,
                                                            otherChannel.channelid,
                                                            (success: boolean) => {
                                                                if (success) {
                                                                    sendDM(interaction, channel.channelid, (_:boolean)=>{});
                                                                    interaction.followUp({
                                                                        ephemeral: false,
                                                                        content: "Sent message to <@" + dmUser.id + ">"
                                                                    });
                                                                } else {
                                                                    interaction.followUp({
                                                                        ephemeral: false,
                                                                        content:
                                                                            "Failed to send message to <@" +
                                                                            dmUser.id +
                                                                            ">"
                                                                    });
                                                                }
                                                            }
                                                        );
                                                    } else {
                                                        interaction.followUp({
                                                            ephemeral: false,
                                                            content:
                                                                "Failed to find <@" +
                                                                dmUser.id +
                                                                ">'s channel, database error"
                                                        });
                                                    }
                                                }
                                            );
                                        }
                                    }
                                }
                            );
                        }
                    }
                });
            }
        } else {
            interaction.followUp({
                ephemeral: false,
                content: "Message failed to send, guild missing"
            });
        }
    }
};

const sendDM = async (interaction: BaseCommandInteraction, channelID: string, callback: Function) => {
    if (interaction.guild) {
        const currentChannel = (await interaction.guild.channels.fetch(channelID)) as TextChannel;
        const msgHook = (await currentChannel.fetchWebhooks()).first();
        const currentUser = await interaction.guild.members.fetch(interaction.user.id);
        const dmUserName = currentUser.nickname ?? currentUser.displayName;

        if (msgHook) {
            if (msgHook.name != dmUserName)
                await msgHook.edit({ name: dmUserName, avatar: currentUser.user.avatarURL() });
            msgHook.send({ content: (interaction.options.get("message")?.value as string) ?? " " });
            callback(true);
        } else callback(false);
    } else callback(false);
};
