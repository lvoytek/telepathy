import { Command } from "./command";
import { Setup } from "./commands/setuptelepathy";
import { Bond } from "./commands/bond";
import { Unbond } from "./commands/unbond";
import { ListBonds } from "./commands/listbonds";
import { DirectMessage } from "./commands/dm";

export const Commands: Command[] = [Setup, Bond, Unbond, ListBonds, DirectMessage];
