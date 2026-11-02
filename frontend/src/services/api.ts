// -- Errors class --

export class ApiError extends Error {
    code: string;
    details: Record<string, string>;
    
    constructor(message: string, code: string, details: Record<string, string>) {
        super(message)
        this.code = code
        this.details = details
    }
}

export async function throwApiError(res: Response): Promise<never> {
    const body = await res.json().catch(() => null)

    throw new ApiError(
        body?.error?.message ?? "Unexpected server error",
        body?.error?.code ?? "UNKNOWN",
        body?.error?.details ?? {}
    )
}