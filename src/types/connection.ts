import { BasicUser, User } from "./user";
import { Channel } from "./channel";

export interface BasicConnection {
    user1: BasicUser,
    user2: BasicUser,
    channel: Channel,
    directed: Boolean
}

export interface Connection extends BasicConnection {
    user1: User,
    user2: User
}
