import type { ZodError } from 'zod'
import { ErrorDetails } from '@transcendence/shared/errors/error-details'

const knownDetails = Object.values(ErrorDetails)

function toErrorDetail(message: string): ErrorDetails {
	for (const detail of knownDetails) {
		if (detail === message) {
			return detail
		}
	}

	return ErrorDetails.INVALID
}

export function formatZodErrors(error: ZodError): Record<string, ErrorDetails> {
	const details: Record<string, ErrorDetails> = {}

	for (const issue of error.issues) {
		const key = issue.path.join('.') || '_root'

		if (key in details) {
			continue
		}

		details[key] = toErrorDetail(issue.message)
	}

	return details
}