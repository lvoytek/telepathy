import { Command } from "./command";
import { Setup } from "./commands/setuptelepathy";
import { Bond } from "./commands/bond";
import { Unbond } from "./commands/unbond";
import { ListBonds } from "./commands/listbonds";

export const Commands: Command[] = [Setup, Bond, Unbond, ListBonds];
