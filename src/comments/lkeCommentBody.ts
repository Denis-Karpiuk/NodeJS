import { body } from 'express-validator'

export const likeCommentBodyValidator = [
	body('likeStatus')
		.exists()
		.withMessage('Поле likeStatus обязательно')

		.isString()
		.withMessage('Поле likeStatus должно быть строкой')

		.isIn(['Like', 'Dislike', 'None'])
		.withMessage('Недопустимое значение для likeStatus'),
]
