import { Command } from "./command";
import { Setup } from "./commands/setuptelepathy";
import { Bond } from "./commands/bond";

export const Commands: Command[] = [Setup, Bond];
