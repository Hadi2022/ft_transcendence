import multer from 'multer';
import type { RequestHandler } from 'express';
import { ImageRequiredError, ImageTooLargeError, InvalidMultipartError} from '../errors/imageErrors.ts';

/*
	memoryStorage() - Temporarily stores the image in RAM.
	fileSize		- Maximum file size in bytes.
	files			- Maximum number of files.
	fields			- Maximum number of text fields.
	fieldSize		- Maximum size of each text field.
	single(field)	- Accepts a single file with the specified name.
*/
export function imageUpload(
    field: string,
    maxSize: number
): RequestHandler {

    const upload = multer({
        storage: multer.memoryStorage(),
        limits: {
            fileSize: maxSize,
            files: 1,
            fields: 5,
            fieldSize: 16 * 1024,
        },
    }).single(field);

    return (req, res, next) => {

        if (!req.is('multipart/form-data')) {
            return next(new InvalidMultipartError(field));
        }

        upload(req, res, (error: unknown) => {

            if (error instanceof multer.MulterError) {

                if (error.code === 'LIMIT_FILE_SIZE') {
                    return next(new ImageTooLargeError(field));
                }

                return next(new InvalidMultipartError(field));
            }

            if (error) {
                return next(new InvalidMultipartError(field));
            }

            if (!req.file) {
                return next(new ImageRequiredError(field));
            }

            next();
        });
    };
}
