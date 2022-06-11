import { Client, BaseCommandInteraction, ApplicationCommandOption, ApplicationCommandOptionChoiceData } from "discord.js";
import { Command } from "../command";


const Commands : Map<string, string> = new Map([
    ["setuptelepathy",  "Create a new telepathy network on this server"],
    ["bond", "Create a bond with a person"],
    ["unbond", "Destroy a bond with a person"],
    ["listbonds", "Check which users are in your telepathic group"],
]);

function createCommandChoices(): ApplicationCommandOptionChoiceData[] {
    let commandChoices : ApplicationCommandOptionChoiceData[] = [];
    for (let command of Commands.keys()) {
        if(command !== 'help') {
            commandChoices.push({
                name: command,
                value: command
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
