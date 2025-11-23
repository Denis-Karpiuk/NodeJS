import { Schema, model } from 'mongoose'

const RequestSchema = new Schema(
	{
		IP: { type: String, required: true },
		URL: { type: String, required: true },
		date: { type: Date, required: true },
	},
	{ _id: false }
)

const DevicesSchema = new Schema(
	{
		devices: { type: Array, required: true },
		IP: { type: String, required: true },
		URL: { type: String, required: true },
		date: { type: Date, required: true },
	},
	{ _id: true }
)

const SecuritySchema = new Schema(
	{
		requests: { type: [RequestSchema], default: [] },
		devices: { type: DevicesSchema },
	},
	{ _id: true }
)

export const SecurityModel = model('Security', SecuritySchema, 'security')

export type RequestType = {
	IP: string
	URL: string
	date: Date
}
