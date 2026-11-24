export type NewFollowData = {
    followerId: string;
    followedId: string;
};

export type Follow = {
    followerId: string;
    followedId: string;
    createdAt: Date;
}