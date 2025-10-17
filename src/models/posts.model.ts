import { Schema, model } from 'mongoose'

const PostSchema = new Schema(
	{
		title: { type: String, required: true },
		shortDescription: { type: String, required: true },
		content: { type: String, required: true },
		blogId: { type: String, required: true },
		blogName: { type: String, required: true },
		createdAt: { type: String, default: new Date().toISOString() },
	},
	{ _id: true }
)

export const PostsModel = model('posts', PostSchema)
