import { Schema } from 'mongoose'
import { LikeStatusEnum } from '../types/types'

export const LikeSchema = new Schema(
	{
		id: { type: String, required: true },
		likeStatus: {
			type: String,
			enum: LikeStatusEnum,
			default: 'None',
			required: true,
		},
		userId: { type: String, required: true },
	},
	{ _id: true, timestamps: true }
)
