import type {
    ALLOWED_IMAGE_FORMATS,
    UPLOAD_DIRECTORIES,
} from '../constants/imageUpload.ts';

export type ImageFormat =
    typeof ALLOWED_IMAGE_FORMATS[number];

export type ImageDirectory =
    keyof typeof UPLOAD_DIRECTORIES;

export interface ValidatedImage {
    buffer: Buffer;
    format: ImageFormat;
}