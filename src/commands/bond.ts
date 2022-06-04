import { ApplicationCommandOption, BaseCommandInteraction, Client, GuildMember, User } from "discord.js";
import { Command } from "../command";
import { Connection } from "../types/connection";
import * as connectionQuery from "../models/connection";
import { Channel } from "../types/channel";
import { QueryError } from "mysql2";

export const AddContact: Command = {
    name: "addcontact",
    description: "Add a user to your telepathy squad",
    type: "CHAT_INPUT",
    options: [{name: "user", description: "The name of the user to add", type: 'USER', required: true} as ApplicationCommandOption],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const channelID = interaction.channelId;
        const channel : Channel = {id: channelID};
        const channelInfo = client.channels.cache.get(channelID) ?? await client.channels.fetch(channelID);

        const currentUserID = interaction.user.id;
        const addedUser = interaction.options.getMember("user") as GuildMember;
        const addedUserName = addedUser.nickname ?? addedUser.displayName;

        let content = "";

        if(currentUserID == addedUser.id) {
            content = addedUserName + ", there's no need to use telepathy on yourself. If you want your own internal" + 
                " monologue use /internal instead.";
        } else if(interaction.guild) {
            const currentUser = (await interaction.guild.members.fetch(currentUserID));
            const currentUserName = currentUser.nickname ?? currentUser.displayName;
            content = currentUserName + " added " + addedUserName + " as a contact";
        } else {
            content = "Added " + addedUserName + " as a contact";
        }

        interaction.followUp({
            ephemeral: true,
            content
        });
    }
}
