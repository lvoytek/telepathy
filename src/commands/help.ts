import {
    Client,
    BaseCommandInteraction,
    ApplicationCommandOption,
    ApplicationCommandOptionChoiceData
} from "discord.js";
import { Command } from "../command";

const commands: Map<string, string> = new Map([
    [
        "setuptelepathy",
        `usage: /setuptelepathy [network name]
        Set up private channels for each user to send telepathy messages through, along with a spectator role for the network. The network name is used to differentiate the channels and role for the created telepathy structure`
    ],
    [
        "bond",
        `usage: /bond [user]
        Add another user to your telepathy group. With the user connected, whenever you send a message in your channel they will see it in theirs. This command must be run in a telepathy channel for the connection to work.`
    ],
    [
        "unbond",
        `usage: /unbond [user]
        Remove a user from your telepathy group. Removed users will no longer see messages you send in your telepathy channel. This command must be run in a telepathy channel to work.`
    ],
    [
        "listbonds",
        `usage: /listbonds
        Show a list of people who are in your telepathy group. This command must be run in a telepathy channel to work.`
    ],
    [
        "dm",
        `usage: /dm [user] [message]
        To send a message only to a specific contact, you can start a message in your channel with @<userid>. However, since this is often inconvenient on discord due to users outside the channel not showing up, you can also send a direct message with the dm command. Specify the user to send the message to in the user section, and add the message to the message section. This command must be run in a telepathy channel to work.`
    ]
]);

const helpText = `
setuptelepathy
usage: /setuptelepathy [network name]

Set up private channels for each user to send telepathy messages through, along with a spectator role for the network. The network name is used to differentiate the channels and role for the created telepathy structure.

bond
usage: /bond [user]

Add another user to your telepathy group. With the user connected, whenever you send a message in your channel they will see it in theirs. This command must be run in a telepathy channel for the connection to work.

unbond
usage: /unbond [user]

Remove a user from your telepathy group. Removed users will no longer see messages you send in your telepathy channel. This command must be run in a telepathy channel to work.

listbonds
usage: /listbonds

Show a list of people who are in your telepathy group. This command must be run in a telepathy channel to work.

dm
usage: /dm [user] [message]
To send a message only to a specific contact, you can start a message in your channel with @<userid>. However, since this is often inconvenient on discord due to users outside the channel not showing up, you can also send a direct message with the dm command. Specify the user to send the message to in the user section, and add the message to the message section. This command must be run in a telepathy channel to work.
`;

function createCommandChoices(): ApplicationCommandOptionChoiceData[] {
    let commandChoices: ApplicationCommandOptionChoiceData[] = [];
    for (let command of commands.keys()) {
        commandChoices.push({
            name: command,
            value: command
        });
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
            choices
        } as ApplicationCommandOption
    ],

    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const choice = interaction.options.get("command", false)?.value as string;
        const content = choice ? `${choice} : ${commands.get(choice)}` : helpText;
        interaction.followUp({
            ephemeral: false,
            content
        });
    }
};
