import { ApplicationCommandOption, BaseCommandInteraction, Client, GuildMember, TextChannel } from "discord.js";
import { Command } from "../command";
import { Channel } from "../types/channel";
import * as channelQuery from "../models/channel";
import * as bondQuery from "../models/bond";
import { QueryError } from "mysql2";

export const DirectMessage: Command = {
    name: "dm",
    description: "DM a user in your telepathic group",
    type: "CHAT_INPUT",
    options: [
        {
            name: "user",
            description: "Name of the user to dm",
            type: "USER",
            required: true
        } as ApplicationCommandOption,
        {
            name: "message",
            description: "The message to send",
            type: "STRING",
            required: true
        } as ApplicationCommandOption
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const channelID = interaction.channelId;

        const currentUserID = interaction.user.id;
        const dmUser = interaction.options.getMember("user") as GuildMember;
        const dmUserName = dmUser.nickname ?? dmUser.displayName;

        if (currentUserID == dmUser.id) {
            if (interaction.guild) {
                const currentChannel = (await interaction.guild.channels.fetch(channelID)) as TextChannel;
                const msgHook = (await currentChannel.fetchWebhooks()).first();

                if (msgHook) {
                    msgHook?.send({ content: (interaction.options.get("message") ?? " ") as string });

                    interaction.followUp({
                        ephemeral: false,
                        content: "You sent a message to yourself"
                    });

                    return;
                }
            }

            interaction.followUp({
                ephemeral: false,
                content: "Message failed to send to yourself"
            });
        }
    }
};
