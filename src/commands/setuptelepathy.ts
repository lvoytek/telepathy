import { ApplicationCommandOption, BaseCommandInteraction, Client, RoleManager } from "discord.js";
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

        networkQuery.create(network, async (networkDBError: QueryError | null, networkID: number) => {
            let content = "Telepathy network creation failed: ";

            if(networkDBError) {
                content += "database error";
            } else {
                network.networkid = networkID;

                if(network.name) {
                    if(server) {
                        const everyoneRole = await server.roles.fetch(server.id);
                        const users = (await server.members.fetch()).filter(user => !user.user.bot);
                        for(const userSet of users) {
                            const user = userSet[1];
                            const channel = await server.channels.create(network.name + " " + user.displayName,
                                {type: ChannelTypes.GUILD_TEXT, reason: "Telepathy time"});
                            await channel.permissionOverwrites.create(user, {VIEW_CHANNEL: true});
                            if(everyoneRole)
                                await channel.permissionOverwrites.create(everyoneRole, {VIEW_CHANNEL: false});
                        }

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
