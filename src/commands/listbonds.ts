import { Client, BaseCommandInteraction, GuildMember } from "discord.js";
import { Command } from "../command";
import { Channel } from "../types/channel";
import * as channelQuery from "../models/channel";
import { BasicUser } from "../types/user";
import * as bondQuery from "../models/bond";
import { QueryError } from "mysql2";

export const ListBonds: Command = {
    name: "listbonds",
    description: "Check which users are in your telepathic group",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        channelQuery.get(interaction.channelId, (error: QueryError | null, channel: Channel) => {
            if (error) {
                interaction.followUp({
                    ephemeral: false,
                    content: "Error accessing database"
                });
            } else if (!channel) {
                interaction.followUp({
                    ephemeral: false,
                    content:
                        "This channel is not connected to a telepathy network, use a connected channel to view bonds."
                });
            } else {
                bondQuery.getAllBondedUsers(
                    { userid: interaction.user.id },
                    channel.network,
                    (error: QueryError | null, users: BasicUser[]) => {
                        let userIDs: string[] = [];
                        for (let user of users) {
                            userIDs.push(user.userid);
                        }
                        if (interaction.guild) {
                            interaction.guild.members.fetch({ user: userIDs }).then((members) => {
                                let content = "Bonds: ";
                                for (let member of members) {
                                    content += "<@" + (member[1].id) + ">, ";
                                }

                                content = content.slice(0, -2);

                                interaction.followUp({
                                    ephemeral: false,
                                    content
                                });
                            });
                        } else {
                            interaction.followUp({
                                ephemeral: false,
                                content: "Error accessing guild"
                            });
                        }
                    }
                );
            }
        });
    }
};
