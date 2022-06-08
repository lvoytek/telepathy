import { BaseCommandInteraction, Message, Client, Interaction } from "discord.js";
import { Commands } from "../commands";
import * as messageDuplicator from "../messageduplicator";

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            await handleSlashCommand(client, interaction);
        }
    });

    client.on("messageCreate", async (message: Message) => {
        await messageDuplicator.handleMessage(client, message);
    });
};

const handleSlashCommand = async (client: Client, interaction: BaseCommandInteraction): Promise<void> => {
    const slashCommand = Commands.find((c) => c.name === interaction.commandName);
    if (slashCommand) {
        await interaction.deferReply();
        slashCommand.run(client, interaction);
    } else {
        interaction.followUp({ content: "Error: slash command not found" });
    }
};
