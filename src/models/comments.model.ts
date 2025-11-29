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
			required: true, // 👈 это делает commentatorInfo обязательным
		},
		createdAt: { type: Date, default: new Date().toISOString() },
		likesInfo: {
			likesCount: { type: Number, default: 0 },
			dislikesCount: { type: Number, default: 0 },
			myStatus: { type: String, default: 'None' },
		},
	},
	{ _id: true }
)

export const CommentModel = model('comments', CommentSchema)
