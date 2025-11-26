import { body } from 'express-validator'

export const validateEmailRecovery = body('email')
	.trim()
	.isString()
	.withMessage('Поле email должно быть строкой')
	.matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
	.withMessage(
		'Неверный формат email, должен быть в формате example@example.com'
	)
