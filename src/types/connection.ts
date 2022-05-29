import { BasicUser, User } from "./user";

export interface BasicConnection {
    user1: BasicUser,
    user2: BasicUser
}

export interface Connection extends BasicConnection {
    directed: boolean
}

export interface DetailedConnection extends Connection {
    user1: User,
    user2: User
}


