import path from 'node:path';

// Physical directory where the backend will store the images. 
// This matches the volume defined in docker-compose.yml
export const UPLOAD_ROOT = path.resolve(
    process.env.UPLOAD_ROOT ?? '/app/uploads'
)

// Public prefix from which Nginx serves images.
export const UPLOAD_PUBLIC_PATH = '/uploads'

// Maximum avatar size (2MB)
export const AVATAR_MAX_SIZE = 2 * 1024 * 1024

// Formats accepted after verifying the actual image content
export const ALLOWED_IMAGE_FORMATS = [
    'jpeg',
    'png',
    'webp',
] as const

// Extension that we will assign, regardless of the original file name.
export const IMAGE_EXTENSIONS = {
    jpeg: 'jpg',
    png: 'png',
    webp: 'webp',
} as const

// Directories managed by the utilities
export const UPLOAD_DIRECTORIES = {
    avatars: 'avatars',
    posts: 'posts',
} as const

// Maximum number of pixels allowed during image decoding (25 megapixels)
export const MAX_IMAGE_PIXELS = 25_000_000