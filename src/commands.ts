import { Command } from "./command";
import { Setup } from "./commands/setuptelepathy";
import { AddContact } from "./commands/addcontact";

export const Commands: Command[] = [Setup, AddContact];
