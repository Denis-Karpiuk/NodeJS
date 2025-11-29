import { Schema, model } from 'mongoose'

const CommentSchema = new Schema(
	{
		postId: { type: String, required: true },
		content: { type: String, required: true },
		commentatorInfo: {
			type: {
				userId: { type: String, required: true },
				userLogin: { type: String, required: true },
			},
			required: true,
		},
		createdAt: { type: Date, default: new Date().toISOString() },
	},
	{ _id: true }
)

export const CommentModel = model('comments', CommentSchema)
