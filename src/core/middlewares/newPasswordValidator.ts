import { body } from 'express-validator'

export const newPasswordValidator = [
	body('recoveryCode')
		.trim()
		.isString()
		.withMessage('Поле login должно быть строкой')
		.trim()
		.isLength({ min: 1 }),

	body('newPassword')
		.trim()
		.isString()
		.withMessage('Поле password должно быть строкой')
		.isLength({ min: 6, max: 20 })
		.withMessage('Максимальная длина password — 20 символов'),
]
