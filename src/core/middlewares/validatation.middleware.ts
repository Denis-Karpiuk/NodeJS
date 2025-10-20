import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { createErrorMessages } from '../utils/createError'
import { formatValidationErrors } from '../utils/formatValidationErrors'

export const validation = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req).array({ onlyFirstError: true })

	console.log(errors)

	if (!!errors.length) {
		return res.status(400).json(formatValidationErrors(errors as any))
	}
	next()
}
