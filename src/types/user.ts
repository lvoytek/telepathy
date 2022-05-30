export interface BasicUser {
    userid: string
};

export interface User extends BasicUser {
    spectator: boolean
};
