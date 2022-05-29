export interface BasicChannel {
    id: number
};

export interface Channel extends BasicChannel {
    servername: string,
    channelname: string
};
