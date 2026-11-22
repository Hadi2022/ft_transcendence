
export type ImageSize = { width: number, height: number }

export async function getImageSize(file: File): Promise<ImageSize|null>{
    try {
        const bitmap = await createImageBitmap(file)
        const size = { width: bitmap.width, height: bitmap.height}
        bitmap.close()
        return (size)
    } catch {
        return (null)
    }
}

export default async function canDecodeImage(file: File): Promise<boolean> {
    return ((await getImageSize(file)) !== null)
}