import { SecurityModel, RequestType } from '../../models/security.model'

export const secureRepository = {
	async addRequestByIp(
		ip: string,
		requestData: RequestType
	): Promise<boolean> {
		try {
			await SecurityModel.updateOne(
				{},
				{ $push: { requests: requestData } },
				{ upsert: true }
			)

			return true
		} catch (e) {
			return false
		}
	},

	async getRequestsTotalCountByFilter(filter: RequestType): Promise<number> {
		const result = await SecurityModel.aggregate([
			{ $unwind: '$requests' },
			{
				$match: {
					'requests.IP': filter.IP,
					'requests.URL': filter.URL,
					'requests.date': { $gte: filter.date },
				},
			},
			{ $count: 'totalCount' },
		])

		return result[0]?.totalCount || 0
	},
}
