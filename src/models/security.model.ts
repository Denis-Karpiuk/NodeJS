import { Schema, model } from 'mongoose'

const RequestSchema = new Schema(
	{
		ip: { type: String, required: true },
		url: { type: String, required: true },
		date: { type: Date, required: true },
	},
	{ _id: false }
)

const DevicesSchema = new Schema(
	{
		ip: { type: String, required: true },
		title: { type: String, required: true },
		lastActiveDate: { type: Date, required: true },
		deviceId: { type: String, required: true },
		userId: { type: String, required: true },
		iat: { type: Number, required: true },
		exp: { type: Number, required: true },
	},
	{ _id: false }
)

const SecuritySchema = new Schema(
	{
		requests: { type: [RequestSchema], default: [] },
		devices: { type: [DevicesSchema], default: [] },
	},
	{ _id: true }
)

export const SecurityModel = model('Security', SecuritySchema, 'security')

export type RequestType = {
	ip: string
	url: string
	date: Date
}
