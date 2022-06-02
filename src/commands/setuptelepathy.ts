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
        const name = interaction.options.get("name")?.value as string;

        let content = "Telepathy network creation failed: ";
        if(name) {
            if(server) {
                server.channels.create(name, {type: ChannelTypes.GUILD_TEXT, reason: "Telepathy time",}).then(channel => {
                    console.log(channel.id + " " + channel.name);
                });
                content = "Telepathy network " + name + " set up successfully";
            } else {
                content += "unable to find guild";
            }
        } else {
            content = "invalid name provided";
        }

        interaction.followUp({
            ephemeral: false,
            content
        });
    }
}
