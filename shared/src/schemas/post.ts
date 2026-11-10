import { z } from 'zod';
import { ErrorDetails as E } from '@transcendence/shared/errors/error-details'


export type CreatePostInput = z.infer<typeof createPostSchema>;

export const userIdField = z.uuid(E.INVALID_UUID)

export const multimediaUrlField = z.url(E.INVALID_VALUE)

export const captionField = z.string().max(400, E.INVALID_VALUE).optional().nullable()


export const createPostSchema = z.object({
	userId: userIdField,
	multimediaUrl: multimediaUrlField,
	caption: captionField,
})
