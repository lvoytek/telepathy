import { Client } from "discord.js";
import ready from "./listeners/ready";
import { config } from "./config";
import interactionCreate from "./listeners/interactionCreate";

const client = new Client({
    intents: [
        "GUILD_MEMBERS",
        "GUILD_MESSAGES",
        "GUILDS"
    ]
});

ready(client);
interactionCreate(client);

client.login(config.Token);
