// -- Errors class --

export class ApiError extends Error {
    status: number;
    code: string;
    details: Record<string, string>;
    
    constructor(status: number, message: string,
                code: string, details: Record<string, string>) {
        super(message)
        this.status = status
        this.code = code
        this.details = details
    }
}

export async function throwApiError(res: Response): Promise<never> {
    const body = await res.json().catch(() => null)

    throw new ApiError(
        res.status,
        body?.error?.message ?? "Unexpected server error",
        body?.error?.code ?? "UNKNOWN",
        body?.error?.details ?? {}
    )
}