import { query } from 'express-validator'

export function searchTermValidation(paramName: string) {
	return query(paramName)
		.optional({ values: 'falsy' }) // позволяет использовать пустую строку и применить trim
		.isString()
		.withMessage(`${paramName} must be a string`)
		.trim()
}
