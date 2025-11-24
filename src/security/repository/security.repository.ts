import { SecurityModel, RequestType } from '../../models/security.model'
import { DeviceType } from '../types/security.types'

export const securityRepository = {
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
					'requests.IP': filter.ip,
					'requests.URL': filter.url,
					'requests.date': { $gte: filter.date },
				},
			},
			{ $count: 'totalCount' },
		])

		return result[0]?.totalCount || 0
	},

	async getDevicesByField(field: string, value: string | number) {
		return SecurityModel.aggregate([
			{ $unwind: '$devices' },
			{ $match: { [field]: value } },
			{ $replaceRoot: { newRoot: '$devices' } },
		])
	},

	async getDeviceByIpAndName(ip: string, deviceName: string) {
		return SecurityModel.aggregate([
			{ $unwind: '$devices' },
			{ $match: { 'devices.ip': ip, 'devices.title': deviceName } },
			{ $replaceRoot: { newRoot: '$devices' } },
		])
	},

	async getUserDevicesByUserId(userId: string) {
		return SecurityModel.aggregate([
			{ $unwind: '$devices' },
			{ $match: { 'devices.userId': userId } },
			{ $replaceRoot: { newRoot: '$devices' } },
		])
	},

	async addUserDevice(dto: DeviceType) {
		return SecurityModel.updateOne(
			{},
			{ $push: { devices: dto } },
			{ upsert: true }
		)
	},
	async updateUserDeviceByIpAndNameAndUserId(
		device: Omit<DeviceType, 'deviceId'>
	) {
		return SecurityModel.findOneAndUpdate(
			{
				'devices.ip': device.ip,
				'devices.title': device.title,
				'devices.userId': device.userId,
			},
			{
				$set: {
					'devices.$[elem].lastActiveDate': device.lastActiveDate,
					'devices.$[elem].iat': device.iat,
				},
			},
			{
				arrayFilters: [
					{
						'elem.ip': device.ip,
						'elem.title': device.title,
						'elem.userId': device.userId,
					},
				],
				new: true,
			}
		)
	},
	async updateUserDeviceByDeviceId(device: Omit<DeviceType, 'title' | 'ip'>) {
		return SecurityModel.updateOne(
			{
				'devices.deviceId': device.deviceId,
				'devices.userId': device.userId,
			},
			{
				$set: {
					'devices.$[elem].lastActiveDate': device.lastActiveDate,
					'devices.$[elem].iat': device.iat,
					'devices.$[elem].exp': device.exp,
				},
			},
			{
				arrayFilters: [
					{
						'elem.deviceId': device.deviceId,
						'elem.userId': device.userId,
					},
				],
			}
		)
	},
	async deleteDevices(userId: string, currentDeviceId: string) {
		return SecurityModel.updateOne(
			{ 'devices.userId': userId },
			{
				$pull: {
					devices: {
						userId: userId,
						deviceId: { $ne: currentDeviceId },
					},
				},
			}
		)
	},
	async deleteDeviceById(userId: string, deviceId: string) {
		return SecurityModel.updateOne(
			{ devices: { $elemMatch: { deviceId: deviceId, userId: userId } } },
			{ $pull: { devices: { deviceId: deviceId, userId: userId } } }
		)
	},
}
