import { BasicUser, User } from "./user";
import { BasicChannel, Channel } from "./channel";

export interface BasicConnection {
    user1: BasicUser,
    user2: BasicUser,
    channel: BasicChannel,
    directed: Boolean
}

export interface Connection extends BasicConnection {
    user1: User,
    user2: User,
    channel: Channel
}
