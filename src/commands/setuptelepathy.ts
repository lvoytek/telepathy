import { ApplicationCommandOption, BaseCommandInteraction, Client, RoleManager } from "discord.js";
import { Command } from "../command";
import * as channelQuery from "../models/channel";
import { Network } from "../types/network";
import * as networkQuery from "../models/network";
import * as userQuery from "../models/user";
import { QueryError } from "mysql2";
import { ChannelTypes } from "discord.js/typings/enums";

export const Setup: Command = {
    name: "setuptelepathy",
    description: "Create a new telepathy network on this server",
    type: "CHAT_INPUT",
    options: [{name: "name", description: "The name of the network", type: 'STRING', required: true} as ApplicationCommandOption],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const server = interaction.guild;

        const networkName = interaction.options.get("name")?.value as string;
        const spectatorRole = await server?.roles.create({name: networkName + " spectator"});

        let network: Network = {
            name: networkName,
            networkid: 0,
            spectatorid: (spectatorRole) ? spectatorRole.id : ((server) ? server.id : "")
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
                            await channel.permissionOverwrites.create(user, {VIEW_CHANNEL: true, SEND_MESSAGES: true});
                            if(spectatorRole)
                                await channel.permissionOverwrites.create(spectatorRole, {VIEW_CHANNEL: true, SEND_MESSAGES: false});

                            if(everyoneRole)
                                await channel.permissionOverwrites.create(everyoneRole, {VIEW_CHANNEL: false, SEND_MESSAGES: false});

                            userQuery.create({userid: user.id}, (error: QueryError | null) => {
                                if(error && error.code != 'ER_DUP_ENTRY')
                                    console.log("Error creating user " + user.id + ": " + error.code);
                                else {
                                    channelQuery.create({
                                        channelid: channel.id,
                                        user: {userid: user.id},
                                        network: {networkid: networkID},
                                        spectator: false
                                    }, (error: QueryError | null) => {
                                        if(error)
                                            console.log("Error creating channel " + channel.name + ": " + error.code);
                                    });
                                }
                            });
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
