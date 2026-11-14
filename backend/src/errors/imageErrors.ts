import { BadRequestError, PayloadTooLargeError, UnsupportedMediaTypeError } from './HttpErrors.ts';
import { ErrorCodes } from '@transcendence/shared/errors/error-codes';
import { ErrorDetails } from '@transcendence/shared/errors/error-details';

export class ImageRequiredError extends BadRequestError {

    constructor(field: string) {
        super({
            message: 'Image is required',
            code: ErrorCodes.VALIDATION_ERROR,
            details: {
                [field]: ErrorDetails.IMAGE_REQUIRED,
            },
        })
    }
}

export class ImageTooLargeError extends PayloadTooLargeError {

    constructor(field: string) {
        super({
            message: 'Image exceeds the maximum allowed size',
            details: {
                [field]: ErrorDetails.IMAGE_TOO_LARGE,
            },
        })
    }
}

export class ImageInvalidFormatError extends UnsupportedMediaTypeError {

    constructor(field: string) {
        super({
            message: 'Unsupported image format',
            details: {
                [field]: ErrorDetails.IMAGE_INVALID_FORMAT,
            },
        })
    }
}

export class ImageInvalidContentError extends BadRequestError {

    constructor(field: string) {
        super({
            message: 'Invalid image content',
            code: ErrorCodes.VALIDATION_ERROR,
            details: {
                [field]: ErrorDetails.IMAGE_INVALID_CONTENT,
            },
        })
    }
}

export class InvalidMultipartError extends BadRequestError {

    constructor(field: string) {
        super({
            message: 'Invalid multipart request',
            details: {
                [field]: ErrorDetails.INVALID_MULTIPART,
            },
        })
    }
}
