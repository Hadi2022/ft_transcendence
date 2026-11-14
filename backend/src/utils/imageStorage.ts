import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile, unlink } from 'node:fs/promises';

import {
    UPLOAD_ROOT,
    UPLOAD_PUBLIC_PATH,
    UPLOAD_DIRECTORIES,
    IMAGE_EXTENSIONS,
} from '../constants/imageUpload.ts';

import type {
    ImageDirectory,
    ValidatedImage,
} from '../types/image.ts';

import {
    BadRequestError,
    InternalError,
} from '../errors/HttpErrors.ts';


const IMAGE_FILENAME_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$/


function getStorageDirectory(
    directory: ImageDirectory
): string {

    if (!Object.hasOwn(UPLOAD_DIRECTORIES, directory)) {
        throw new BadRequestError({
            message: 'Invalid image directory',
        })
    }

    return path.join(
        UPLOAD_ROOT,
        UPLOAD_DIRECTORIES[directory]
    )
}

export async function saveImage(
    image: ValidatedImage,
    directory: ImageDirectory
): Promise<string> {

    const storageDirectory = getStorageDirectory(directory)

    const extension = IMAGE_EXTENSIONS[image.format]
    const filename = `${randomUUID()}.${extension}`

    const filePath = path.join(
        storageDirectory,
        filename
    )

    try {
        await mkdir(storageDirectory, {
            recursive: true,
        })

        await writeFile(filePath, image.buffer, {
            flag: 'wx',
        })

    } catch {
        throw new InternalError({
            message: 'Failed to save image',
        })
    }

    return `${UPLOAD_PUBLIC_PATH}/${directory}/${filename}`
}

export async function deleteImage(
    publicPath: string,
    directory: ImageDirectory
): Promise<void> {

    const storageDirectory = getStorageDirectory(directory);

    const expectedPrefix =
        `${UPLOAD_PUBLIC_PATH}/${directory}/`

    if (!publicPath.startsWith(expectedPrefix)) {
        throw new BadRequestError({
            message: 'Invalid image path',
        })
    }

    const filename = publicPath.slice(
        expectedPrefix.length
    )

    if (!IMAGE_FILENAME_PATTERN.test(filename)) {
        throw new BadRequestError({
            message: 'Invalid image filename',
        })
    }

    const filePath = path.join(
        storageDirectory,
        filename
    )

    try {
        await unlink(filePath);

    } catch (error) {

        if (
            error instanceof Error &&
            'code' in error &&
            error.code === 'ENOENT'
        ) {
            return;
        }

        throw new InternalError({
            message: 'Failed to delete image',
        })
    }
}
