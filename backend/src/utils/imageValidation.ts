import sharp from 'sharp';
import type { Metadata } from 'sharp';

import { ALLOWED_IMAGE_FORMATS, MAX_IMAGE_PIXELS } from '../constants/imageUpload.ts';

import type {
    ImageFormat,
    ValidatedImage,
} from '../types/image.ts';

import { ImageInvalidFormatError, ImageInvalidContentError } from '../errors/imageErrors.ts';


function isAllowedFormat(
    format: string | undefined
): format is ImageFormat {

    return ALLOWED_IMAGE_FORMATS.some(
        allowed => allowed === format
    );
}

export async function validateImage(
    buffer: Buffer,
    field: string
): Promise<ValidatedImage> {

    const image = sharp(buffer, {
        failOn: 'warning',
        limitInputPixels: MAX_IMAGE_PIXELS,
    });

	let metadata: Metadata;

    try {
        metadata = await image.metadata();
    } catch {
        throw new ImageInvalidContentError(field);
    }

    if (!isAllowedFormat(metadata.format)) {
        throw new ImageInvalidFormatError(field);
    }

    if (!metadata.width || !metadata.height) {
        throw new ImageInvalidContentError(field);
    }

    if (metadata.pages && metadata.pages > 1) {
        throw new ImageInvalidContentError(field);
    }

    try {
        await image.raw().toBuffer();
    } catch {
        throw new ImageInvalidContentError(field);
    }

    return {
        buffer,
        format: metadata.format,
    };
}
