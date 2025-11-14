import { body } from 'express-validator'
import { validateEmail } from './validateEmail'

export const userBodyValidator = [
	body('login')
		.trim()
		.isString()
		.withMessage('Поле login должно быть строкой')
		.trim()
		.isLength({ min: 3, max: 10 })
		.matches(/^[a-zA-Z0-9_-]*$/)
		.withMessage('Максимальная длина login — 10 символов'),

	body('password')
		.trim()
		.isString()
		.withMessage('Поле password должно быть строкой')
		.isLength({ min: 6, max: 20 })
		.withMessage('Максимальная длина password — 20 символов'),

	validateEmail,
]
