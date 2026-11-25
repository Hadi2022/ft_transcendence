import type { UserProfile } from "./user.ts";

export type NewFollowData = {
    followerId: string;
    continuedId: string;
};

export type Follow = {
    followerId: string;
    continuedId: string;
    createdAt: Date;
}

export type ListFollowResult = {
    data: UserProfile[];
    pagination:{
        total: number;
    }

}