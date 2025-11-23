import { ApiRequestsModel, RequestType } from '../../models/requests.model'

export const secureRepository = {
	async addOne(requestData: RequestType): Promise<boolean> {
		try {
			await ApiRequestsModel.create(requestData)
			return true
		} catch (e) {
			return false
		}
	},

	async getRequestsTotalCountByFilter(filter: RequestType): Promise<number> {
		return await ApiRequestsModel.countDocuments({
			...filter,
			date: { $gte: filter.date },
		})
	},
}
