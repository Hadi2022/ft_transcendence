import { prisma } from "../db/prisma/prisma.ts";
import type { NewPostData, Post, PostDelete, ListPostsResult } from "../types/post.ts";
import { Prisma } from '@prisma/client';
import { userProfileOmit } from "./userRepository.ts";
import { GenericConstraintError, RecordNotFoundError } from "../errors/RepositoryErrors.ts";
import type { ListParams } from "../types/query.ts";


export async function createPost(
    _data: NewPostData
): Promise<Post> {

    try {
        const post = await prisma.post.create({
            data: {
                userId : _data.userId,
                multimediaUrl: _data.multimediaUrl,
                caption: _data.caption ?? null,
            },
            include: {
                user: {
                    omit:userProfileOmit
                }
            }
        });
        return post;
    }
    catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003')
                throw new RecordNotFoundError('User not found');
            else if (error.code === 'P2025')
                throw new RecordNotFoundError();
        }
        throw error;
    }
}

export async function deletePost(
    _idPost: string):Promise<PostDelete> {

    try {
        const deletedPost = await prisma.post.delete({
            where:{id: _idPost},
            select: {
                id: true,
                userId: true,
                multimediaUrl: true,
            }
            })
            return deletedPost;
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025'){
                    throw new RecordNotFoundError();
                }//foreing key constrain
                if (error.code === 'P2003') {
                    throw new GenericConstraintError(error.message);
                }
            }
        throw error;
    }
}

export async function getPostById(
    _idPost:string):Promise<PostDelete|null> {

    return await prisma.post.findUnique({
            where: {id : _idPost},
            select: {
                id:true,
                userId:true,
                multimediaUrl:true,
            }
        })
}

export async function getPublicPostById(
    id: string
): Promise<Post | null> {

    return await prisma.post.findUnique({
        where: { id },
        include: {
            user: {
                omit: userProfileOmit
            }
        }
    });
}

export async function updatePost(
    _idPost:string, _caption:string|null):Promise<Post> {

        try {
            return await prisma.post.update({
                where: {id:_idPost},
                data:{
                    caption : _caption
                },
                include:{
                    user:{omit:userProfileOmit}
                }
            })
        } catch (error:unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025')
                throw new RecordNotFoundError('Post not found')
            throw error;
        }
}

export async function listPosts(
    { limit, offset, userId }: ListParams
): Promise<ListPostsResult> {

    const where: Prisma.PostWhereInput = {};

    if (userId !== undefined)
        where.userId = userId;

    const [data, total] = await Promise.all([
        prisma.post.findMany({
            where,
            orderBy: [
                { createdAt: 'desc' },
                { id: 'desc' }
            ],
            take: limit,
            skip: offset,
            include: {
                user: {
                    omit: userProfileOmit
                }
            }
        }),
        prisma.post.count({
            where
        })
    ]);

    return { data, pagination:{total} };
}
