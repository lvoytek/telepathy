export interface BasicNetwork {
    networkid: number
};

export interface Network extends BasicNetwork {
    name: string,
    spectatorid: string
};
