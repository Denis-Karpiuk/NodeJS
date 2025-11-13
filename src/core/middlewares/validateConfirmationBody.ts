import { body } from 'express-validator'

export const validateConfirmationBody = body('code')
	.trim()
	.isString()
	.withMessage('Поле login должно быть строкой')
	.trim()
	.isLength({ min: 1 })
