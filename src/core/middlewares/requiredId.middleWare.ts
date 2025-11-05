// import { param } from 'express-validator'

// export const idParamsValidator = [
// 	param('id')
// 		.trim()
// 		.isLength({ min: 24 })
// 		.withMessage('id is required and must be 24 symbols'),
// ]

import { param } from 'express-validator'
import mongoose from 'mongoose'

export const idParamsValidator = [
	param('id')
		.trim()
		.isLength({ min: 24, max: 24 })
		.withMessage('id must be exactly 24 characters')
		.custom(value => mongoose.Types.ObjectId.isValid(value))
		.withMessage('id must be a valid MongoDB ObjectId'),
]
