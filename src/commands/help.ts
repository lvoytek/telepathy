import { Client, BaseCommandInteraction, ApplicationCommandOption, ApplicationCommandOptionChoiceData } from "discord.js";
import { Command } from "../command";
import { Commands, CommandDescriptions } from "src/commands";


function createCommandChoices(): ApplicationCommandOptionChoiceData[] {
    let commandChoices : ApplicationCommandOptionChoiceData[] = [];
    for (let command of Commands) {
        if(command.name !== 'help') {
            commandChoices.push({
                name: command.name,
                value: command.name
            })
        }
    }
    return commandChoices;
} 

const choices: ApplicationCommandOptionChoiceData[] = createCommandChoices();

export const Help: Command = {
    name: "help",
    description: "Learn about command(s)",
    type: "CHAT_INPUT",
    options: [
        {
            name: "command",
            description: "Command you want details for",
            type: "STRING",
            required: false,
            choices,
        } as ApplicationCommandOption
    ],
    
    run: async (client: Client, interaction: BaseCommandInteraction) => {
       const choice = interaction.options.get('command', false)?.value as string;
       const content = choice ? CommandDescriptions.get(choice) : 'Explantatory text';
       interaction.followUp({
        ephemeral: false,
            content
        });
    }
};
