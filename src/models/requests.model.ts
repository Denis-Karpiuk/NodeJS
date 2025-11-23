import { Schema, model } from 'mongoose'

const RequestSchema = new Schema(
	{
		IP: { type: String, required: true },
		URL: { type: String, required: true },
		date: { type: Date, required: true },
	},
	{ _id: true }
)

export const ApiRequestsModel = model('ApiRequests', RequestSchema)

export type RequestType = {
	IP: string
	URL: string
	date: Date
}
