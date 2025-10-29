import { body } from 'express-validator'

export const authBodyValidator = [
	body('loginOrEmail')
		.trim()
		.isString()
		.withMessage('Поле login должно быть строкой'),

	body('password')
		.trim()
		.isString()
		.withMessage('Поле password должно быть строкой')
		.isLength({ min: 2, max: 20 })
		.withMessage('Максимальная длина password — 20 символов'),
]
