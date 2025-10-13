import { body } from 'express-validator'

export const postBodyValidator = [
	body('title')
		.trim()
		.exists()
		.withMessage('Поле title обязательно')

		.isString()
		.withMessage('Поле title должно быть строкой')

		.isLength({ max: 30 })
		.withMessage('Максимальная длина title — 30 символов'),

	body('shortDescription')
		.trim()
		.exists()
		.withMessage('Поле shortDescription обязательно')

		.isString()
		.withMessage('Поле shortDescription должно быть строкой')

		.isLength({ min: 1, max: 100 })
		.withMessage('Максимальная длина shortDescription — 100 символов'),

	body('content')
		.trim()
		.exists()
		.withMessage('Поле content обязательно')

		.isString()
		.withMessage('Поле content должно быть строкой')

		.isLength({ max: 1000 })
		.withMessage('Максимальная длина content — 1000 символов'),

	body('blogId')
		.trim()
		.exists()
		.withMessage('Поле blogId обязательно')

		.isString()
		.withMessage('Поле blogId должно быть строкой')

		.notEmpty()
		.withMessage('Поле blogId не должно быть пустым'),
]
