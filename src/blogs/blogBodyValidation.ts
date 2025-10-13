import { body } from 'express-validator'

export const blogBodyValidator = [
	body('name')
		.trim()
		.isString()
		.withMessage('Поле name должно быть строкой')
		.trim()
		.isLength({ min: 2, max: 15 })
		.withMessage('Максимальная длина name — 15 символов'),

	body('description')
		.trim()
		.isString()
		.withMessage('Поле description должно быть строкой')
		.isLength({ min: 2, max: 500 })
		.withMessage('Максимальная длина description — 500 символов'),

	body('websiteUrl')
		.trim()
		.isString()
		.withMessage('Поле websiteUrl должно быть строкой')
		.isLength({ min: 2, max: 100 })
		.withMessage('Максимальная длина websiteUrl — 100 символов')
		.matches(
			/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
		)
		.withMessage(
			'Неверный формат websiteUrl — должен начинаться с https:// и соответствовать шаблону'
		),
]
