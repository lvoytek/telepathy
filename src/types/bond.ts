import { BasicUser, User } from "./user";
import { BasicNetwork, Network } from "./network";

export interface Bond {
    user1: BasicUser,
    user2: BasicUser,
    network: BasicNetwork
}

export interface ExtendedBond extends Bond {
    user1: User,
    user2: User,
    network: Network
}
