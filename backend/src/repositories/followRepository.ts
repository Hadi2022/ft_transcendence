import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma/prisma.ts";
import { RecordNotFoundError, UniqueConstraintError } from "../errors/RepositoryErrors.ts";
import type { Follow, ListFollowResult, NewFollowData } from "../types/follow.ts";
import type { ListParams } from "../types/query.ts";

export async function createFollow(
    data: NewFollowData): Promise<Follow> {

    try {
        return await prisma.follow_up.create({
            data,
        })
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
                throw new RecordNotFoundError('Follower or followed user not found');
            }
            if (error.code === 'P2002') {
                throw new UniqueConstraintError('Follow relationship already exists');
            }
        }
        throw error;
    }
}

export async function deleteFollow(
    _followerId: string,
    _continuedId: string): Promise<Follow> {
    try {
        return await prisma.follow_up.delete({
            where: {
                followerId_continuedId: {
                    followerId: _followerId,
                    continuedId: _continuedId
                }
            }
        })
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new RecordNotFoundError('Follow relationship not found');
            }
        }
        throw error;
    }
}

const userProfileSelect = {
  id: true,
  username: true,
  name: true,
  biography: true,
  avatarUrl: true,
  isVerified: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export async function getFollowers(
  userId: string,
  { limit, offset }: ListParams
): Promise<ListFollowResult> {
  
  const where = { continuedId: userId } satisfies Prisma.Follow_upWhereInput;

  const [rows, total] = await Promise.all([
    prisma.follow_up.findMany({
      where,
      select: {
        follower: {
          select: userProfileSelect,
        },
      },
      orderBy: [
        { createdAt: "desc" },
        { followerId: "desc" },
      ],
      take: limit,
      skip: offset,
    }),
    prisma.follow_up.count({ where }),
  ]);

  return {
    data: rows.map((row) => row.follower),
    pagination: { total },
  };
}

export async function getFollowings(
    userId: string,
    { limit, offset }: ListParams
): Promise<ListFollowResult> {
 
  const where = { followerId: userId } satisfies Prisma.Follow_upWhereInput;

  const [rows, total] = await Promise.all([
    prisma.follow_up.findMany({
      where,
      select: {
        continued: {
          select: userProfileSelect,
        },
      },
      orderBy: [
        { createdAt: "desc" },
        { continuedId: "desc" },
      ],
      take: limit,
      skip: offset,
    }),
    prisma.follow_up.count({ where }),
  ]);

  return {
    data: rows.map((row) => row.continued),
    pagination: { total },
  };

}

export async function countFollowers(
    userId: string
): Promise<number> {
  return await prisma.follow_up.count({
    where: { continuedId: userId } ,
  });
}

export async function countFollowings(
    userId: string
): Promise<number> {
  return await prisma.follow_up.count({
    where: { followerId: userId } ,
  });
}

export async function isFollowing(
    followerId: string,
    continuedId: string
): Promise<boolean> {
    const follow = await prisma.follow_up.findUnique({
        where: {
            followerId_continuedId: {
                followerId,
                continuedId
            }
        },
        select: {
            followerId: true,
        }

    });
    return follow !== null;
}