import { Schema, model } from 'mongoose'

const CommentsLikesSchema = new Schema(
	{
		commentId: { type: String, required: true },
		likeStatus: { type: String, default: 'None' },
		userId: { type: String, required: true },
	},
	{ _id: true }
)

export const CommentsLikesModel = model('commentsLikes', CommentsLikesSchema)
