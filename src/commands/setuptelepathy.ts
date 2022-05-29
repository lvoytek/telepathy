import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../command";

export const Setup: Command = {
    name: "setuptelepathy",
    description: "Setup this channel as a channel for telepathy",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const content = "Setup channel for telepathy";

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}
