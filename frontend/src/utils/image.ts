export default async function canDecodeImage(file: File): Promise<boolean>{
    try {
        const bitmap = await createImageBitmap(file)
        bitmap.close()
        return (true)
    } catch {
        return (false)
    }
}