import { Schema, model } from 'mongoose'

const TokenBlackListSchema = new Schema(
	{
		token: { type: String, required: true },
		userId: { type: String, required: true },
		expiresAt: { type: Date, required: true },
		createdAt: { type: Date, default: Date.now },
	},
	{ _id: true }
)

TokenBlackListSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const TokenBlackListModel = model(
	'tokensBlackList',
	TokenBlackListSchema
)

export type TokenBlackListDBType = {
	token: string
	userId: string
	expiresAt: Date
	createdAt?: Date
}
