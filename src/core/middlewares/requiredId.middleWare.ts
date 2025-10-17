import { param } from 'express-validator'

export const idParamsValidator = [
	param('id')
		.trim()
		.isLength({ min: 24 })
		.withMessage('id is required and must be 24 symbols'),
]
