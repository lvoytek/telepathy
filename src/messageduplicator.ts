import { Message, Client, TextChannel } from "discord.js";
import { Channel } from "./types/channel";
import * as channelQuery from "./models/channel";
import { QueryError } from "mysql2";

export const handleMessage = async (client: Client, message: Message): Promise<void> => {
    if (message.channel.isText() && !message.author.bot) {
        channelQuery.get(message.channelId, (error: QueryError | null, channel: Channel) => {
            if(!error && channel) {
                (message.channel as TextChannel).send("Yes channel");
            }
        });
    }
};
