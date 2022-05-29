export interface BasicUser {
    username: string
};

export interface User extends BasicUser {
    spectator: boolean
};
