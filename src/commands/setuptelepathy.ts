import { BaseCommandInteraction, Client } from "discord.js";
import { db } from "../db";
import { Command } from "../command";
import { Channel } from "../types/channel";
import * as channelQuery from "../models/channel";
import { QueryError } from "mysql2";

export const Setup: Command = {
    name: "setuptelepathy",
    description: "Setup this channel as a channel for telepathy",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const channelID = interaction.channelId;
        const channel : Channel = {id: channelID};
        const channelInfo = client.channels.cache.get(channelID) ?? await client.channels.fetch(channelID);

        channelQuery.create(channel, (error: QueryError | null) => {
            const content = (channelInfo) ?
                ((error) ?
                    ((error.code == 'ER_DUP_ENTRY') ?
                        channelInfo.toString() + " is already set up for telepathy"
                        : "Failed to set up " + channelInfo.toString() + "for telepathy: database error")
                    : channelInfo.toString() + " set up for telepathy")
                : "Error: channel not found";

            interaction.followUp({
                ephemeral: true,
                content
            });
        });
    }
}
