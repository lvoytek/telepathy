import { BasicUser, User } from "./user";
import { BasicNetwork, Network } from "./network";
export interface BasicChannel {
    id: string
};

export interface Channel extends BasicChannel {
    user: BasicUser,
    network: BasicNetwork
};

export interface ExtendedChannel extends Channel {
    user: User,
    network: Network
};
