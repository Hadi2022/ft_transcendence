import type { ZodError } from 'zod'

export function formatZodErrors(error: ZodError): Record<string, string> {
	const details: Record<string, string> = {}

	for (const issue of error.issues) {
		const key = issue.path.join('.') || '_root'
		if (!(key in details)) details[key] = issue.message
	}

	return details
}