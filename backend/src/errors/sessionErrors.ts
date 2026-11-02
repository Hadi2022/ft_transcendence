export class ErrorSessionCleanup extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ErrorSessionCleanup'
    }
}
