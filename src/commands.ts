import { Command } from "./command";
import { Setup } from "./commands/setuptelepathy";
import { Bond } from "./commands/bond";
import { Unbond } from "./commands/unbond";

export const Commands: Command[] = [Setup, Bond, Unbond];
