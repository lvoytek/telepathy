import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../command";

export const Setup: Command = {
    name: "setuptelepathy",
    description: "Setup this channel as a channel for telepathy",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const channelID = interaction.channelId;
        const channel = client.channels.cache.get(channelID) ?? await client.channels.fetch(channelID);
        const content = (channel) ? channel.toString() + " set up for telepathy" : "Error: channel not found";

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}
