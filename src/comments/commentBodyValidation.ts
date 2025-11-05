import { body } from 'express-validator'

export const commentBodyValidator = [
	body('content')
		.trim()
		.exists()
		.withMessage('Поле content обязательно')

		.isString()
		.withMessage('Поле content должно быть строкой')

		.isLength({ min: 20, max: 300 })
		.withMessage(
			'Максимальная длина content — 300 символов, минимальная 20'
		),
]
