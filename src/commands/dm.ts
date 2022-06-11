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
        } as ApplicationCommandOption
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const channelID = interaction.channelId;

        const currentUserID = interaction.user.id;
        const dmUser = interaction.options.getMember("user") as GuildMember;
        const dmUserName = dmUser.nickname ?? dmUser.displayName;
    }
};
