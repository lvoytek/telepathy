import { ApplicationCommandOption, BaseCommandInteraction, Client, GuildMember, TextChannel } from "discord.js";
import { Command } from "../command";
import { Channel } from "../types/channel";
import * as channelQuery from "../models/channel";
import * as bondQuery from "../models/bond";
import { QueryError } from "mysql2";

export const Bond: Command = {
    name: "bond",
    description: "Add a user to your telepathic group",
    type: "CHAT_INPUT",
    options: [
        {
            name: "user",
            description: "Name of the user to add",
            type: "USER",
            required: true
        } as ApplicationCommandOption
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const channelID = interaction.channelId;

        const currentUserID = interaction.user.id;
        const addedUser = interaction.options.getMember("user") as GuildMember;
        const addedUserName = addedUser.nickname ?? addedUser.displayName;

        if (currentUserID == addedUser.id) {
            const content =
                addedUserName +
                ", there's no need to use telepathy on yourself. If you want your own internal" +
                " monologue use @self at the beginning of your message in your telepathy channel.";

            interaction.followUp({
                ephemeral: false,
                content
            });
        } else if (addedUser.user.bot) {
            interaction.followUp({
                ephemeral: false,
                content: "Bots cannot be added to a telepathy network."
            });
        } else {
            channelQuery.get(channelID, (error: QueryError | null, fromChannel: Channel) => {
                if (error) {
                    interaction.followUp({
                        ephemeral: false,
                        content: "Error accessing database"
                    });
                } else if (!fromChannel) {
                    interaction.followUp({
                        ephemeral: false,
                        content:
                            "This channel is not connected to a telepathy network, use a connected channel to add a bond."
                    });
                } else {
                    channelQuery.getChannelFromNetworkAndUser(
                        fromChannel.network,
                        { userid: addedUser.id },
                        (error: QueryError | null, toChannel: Channel) => {
                            if (error) {
                                interaction.followUp({
                                    ephemeral: false,
                                    content: "Error accessing database"
                                });
                            } else if (!toChannel) {
                                const content =
                                    addedUserName + " is not yet part of this network. An admin must add them first.";
                                interaction.followUp({
                                    ephemeral: false,
                                    content
                                });
                            } else {
                                bondQuery.create(
                                    {
                                        user1: { userid: currentUserID },
                                        user2: { userid: addedUser.id },
                                        network: fromChannel.network
                                    },
                                    (error: QueryError | null, added: boolean) => {
                                        if (error) {
                                            interaction.followUp({
                                                ephemeral: false,
                                                content: "Error creating bond in database"
                                            });
                                        } else if (!added) {
                                            const content = addedUserName + " is already in your telepathy group";
                                            interaction.followUp({
                                                ephemeral: false,
                                                content
                                            });
                                        } else {
                                            interaction.guild?.channels.fetch(toChannel.channelid).then((channel) => {
                                                if (channel) {
                                                    interaction.user.fetch().then((user) => {
                                                        (channel as TextChannel).send(
                                                            user.username + " added you to their telepathy group"
                                                        );
                                                    });
                                                }
                                            });

                                            const content = "Added " + addedUserName + " to your telepathy group";
                                            interaction.followUp({
                                                ephemeral: false,
                                                content
                                            });
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            });
        }
    }
};
