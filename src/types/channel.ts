import { BasicUser, User } from "./user";
import { BasicNetwork, Network } from "./network";
export interface BasicChannel {
    channelid: string
};

export interface Channel extends BasicChannel {
    user: BasicUser,
    network: BasicNetwork,
    spectator: boolean
};

export interface ExtendedChannel extends Channel {
    user: User,
    network: Network
};
