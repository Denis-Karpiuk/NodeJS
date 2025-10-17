import { Schema, model } from 'mongoose'

const BlogSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		websiteUrl: { type: String, required: true },
		createdAt: { type: Date, default: new Date().toISOString() },
		isMembership: { type: Boolean, default: false },
	},
	{ _id: true }
)

export const BlogsModel = model('blogs', BlogSchema)
