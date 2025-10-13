type RawValidationError = {
	msg: string
	path: string
}

type FormattedError = {
	errorsMessages: {
		message: string
		field: string
	}[]
}

export function formatValidationErrors(
	errors: RawValidationError[]
): FormattedError {
	return {
		errorsMessages: errors.map(err => ({
			message: err.msg,
			field: err.path,
		})),
	}
}
