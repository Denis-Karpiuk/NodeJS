import { Schema, model } from 'mongoose'

const UsersSchema = new Schema(
	{
		email: { type: String, required: true },
		login: { type: String, required: true },
		passwordHash: { type: String, required: true },
		createdAt: { type: Date, default: new Date().toISOString() },
		emailConfirmation: {
			confirmationCode: { type: String, default: '' },
			expirationDate: { type: Date, required: true },
			isConfirmed: { type: Boolean, default: false },
		},
	},
	{ _id: true }
)

export const UsersModel = model('users', UsersSchema)
