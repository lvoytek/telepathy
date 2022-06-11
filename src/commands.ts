import { Command } from "./command";
import { Setup } from "./commands/setuptelepathy";
import { Bond } from "./commands/bond";
import { Unbond } from "./commands/unbond";
import { ListBonds } from "./commands/listbonds";
import { DirectMessage } from "./commands/dm";
import { Help } from "./commands/help";

export const Commands: Command[] = [Setup, Bond, Unbond, ListBonds, DirectMessage, Help];

export const CommandDescriptions : Map<string, string> = new Map([
    ["setuptelepathy",  "Create a new telepathy network on this server"],
    ["bond", "Create a bond with a person"],
    ["unbond", "Destroy a bond with a person"],
    ["listbonds", "Check which users are in your telepathic group"],
]);
