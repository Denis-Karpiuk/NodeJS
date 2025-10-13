import { param } from 'express-validator'

export const idParamsValidator = [
	param('id').trim().isLength({ min: 1 }).withMessage('id is required'),
]
