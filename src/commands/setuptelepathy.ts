import { ApplicationCommandOption, BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../command";
import { Channel } from "../types/channel";
import * as channelQuery from "../models/channel";
import { Network } from "../types/network";
import * as networkQuery from "../models/network";
import { QueryError } from "mysql2";
import { ChannelTypes } from "discord.js/typings/enums";

export const Setup: Command = {
    name: "setuptelepathy",
    description: "Create a new telepathy network on this server",
    type: "CHAT_INPUT",
    options: [{name: "name", description: "The name of the network", type: 'STRING', required: true} as ApplicationCommandOption],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const server = interaction.guild;

        let network: Network = {
            name: interaction.options.get("name")?.value as string,
            networkid: 0
        }

        networkQuery.create(network, (networkDBError: QueryError | null, networkID: number) => {
            let content = "Telepathy network creation failed: ";

            if(networkDBError) {
                content += "database error";
            } else {
                network.networkid = networkID;

                if(network.name) {
                    if(server) {
                        const everyoneRole = server.roles.everyone;
                        server.members.fetch().then((allUsers) =>
                        {
                            const users = allUsers.filter(user => !user.user.bot);
                            users.forEach((user) => {
                                server.channels.create(network.name + " " + user.displayName,
                                    {type: ChannelTypes.GUILD_TEXT, reason: "Telepathy time"}).then(channel => {
                                    channel.permissionOverwrites.create(user, {VIEW_CHANNEL: true});
                                    channel.permissionOverwrites.create(everyoneRole, {VIEW_CHANNEL: false});
                                    console.log(channel.id + " " + channel.name);
                                });
                            });
                        });

                        content = "Telepathy network " + network.name + " set up successfully";
                    } else {
                        content += "unable to find guild";
                    }
                } else {
                    content = "invalid name provided";
                }
            }

            interaction.followUp({
                ephemeral: false,
                content
            });
        });
    }
}
