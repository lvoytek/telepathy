import { ApplicationCommandOption, BaseCommandInteraction, Client, GuildMember } from "discord.js";
import { Command } from "../command";
import { Channel } from "../types/channel";
import * as channelQuery from "../models/channel";
import * as bondQuery from "../models/bond";
import { QueryError } from "mysql2";

export const Unbond: Command = {
    name: "unbond",
    description: "Remove a user from your telepathic group",
    type: "CHAT_INPUT",
    options: [
        {
            name: "user",
            description: "Name of the user to remove",
            type: "USER",
            required: true
        } as ApplicationCommandOption
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const channelID = interaction.channelId;

        const currentUserID = interaction.user.id;
        const removedUser = interaction.options.getMember("user") as GuildMember;
        const removedUserName = removedUser.nickname ?? removedUser.displayName;

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
                        "This channel is not connected to a telepathy network, use a connected channel to remove a bond."
                });
            } else {
                bondQuery.remove(
                    {
                        user1: { userid: currentUserID },
                        user2: { userid: removedUser.id },
                        network: fromChannel.network
                    },
                    (error: QueryError | null, deleted: boolean) => {
                        if (error) {
                            interaction.followUp({
                                ephemeral: false,
                                content: "Error removing bond from database"
                            });
                        } else if (!deleted) {
                            const content = removedUserName + " is not in your telepathy group";
                            interaction.followUp({
                                ephemeral: false,
                                content
                            });
                        } else {
                            const content = "Removed " + removedUserName + " from your telepathy group";
                            interaction.followUp({
                                ephemeral: false,
                                content
                            });
                        }
                    }
                );
            }
        });
    }
};
