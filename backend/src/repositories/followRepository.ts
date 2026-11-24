import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma/prisma.ts";
import { RecordNotFoundError } from "../errors/RepositoryErrors.ts";
import { FollowRelationshipError } from "../errors/followError.ts";
import type { Follow, NewFollowData } from "../types/follow.ts";

export async function createFollow(
    data: NewFollowData): Promise<Follow>{

        try
        {
            return await prisma.follow_up.create({
                data,
            })
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new RecordNotFoundError('Follower or followed user not found');
                }
                if (error.code === 'P2002') {
                    throw new FollowRelationshipError();
                }
            }
            throw error;
        }
}

export async function deleteFollow(
    _followerId: string,
    _followedId: string): Promise<Follow> {
        try
        {
            return await prisma.follow_up.delete({
                where: {
                    followerId_followedId: {
                        followerId: _followerId,
                        followedId: _followedId
                    }
                }
            })
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025' || error.code === 'P2003') {
                    throw new RecordNotFoundError('Follow relationship not found');
                }
            }
            throw error;
        }
}