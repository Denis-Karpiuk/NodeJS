import { body } from 'express-validator'

export const validateEmail = body('email')
	.trim()
	.isString()
	.withMessage('Поле email должно быть строкой')
	.matches(/^[\w+\.-]+@([\w-]+\.)+[\w-]{2,4}$/)
	.withMessage(
		'Неверный формат email, должен быть в формате example@example.com'
	)
