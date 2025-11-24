import { subSeconds } from 'date-fns'
import { Result } from '../../core/result/result.type'
import { ResultStatus } from '../../core/result/resultStatus'
import { securityRepository } from '../repository/security.repository'
import { DeviceType, RequestDto } from '../types/security.types'

export const securityService = {
	async addRequestToRequestsList(
		data: Omit<RequestDto, 'date'>
	): Promise<Result<null>> {
		const result = await securityRepository.addRequestByIp(data.ip, {
			...data,
			date: new Date(),
		})

		if (!result) {
			return {
				status: ResultStatus.Failure,
				data: null,
			}
		}

		return {
			status: ResultStatus.Success,
			data: null,
		}
	},

	async getAllRequestsCount(
		filter: Omit<RequestDto, 'date'>
	): Promise<number> {
		const tenSecondsAgo = subSeconds(new Date(), 10)

		const requestsCount =
			await securityRepository.getRequestsTotalCountByFilter({
				...filter,
				date: tenSecondsAgo,
			})

		if (!requestsCount) {
			return 0
		}

		return requestsCount
	},

	async getAllDevicesByUserId(userId: string): Promise<Result<DeviceType[]>> {
		try {
			const devices =
				await securityRepository.getUserDevicesByUserId(userId)

			return {
				status: ResultStatus.Success,
				data: devices,
			}
		} catch (error) {
			return {
				status: ResultStatus.Failure,
				data: undefined,
				errorMessage:
					error instanceof Error ? error.message : 'Unknown error',
			}
		}
	},
	async getAllDevicesByIp(ip: string): Promise<Result<DeviceType[]>> {
		try {
			const devices = await securityRepository.getDevicesByField(
				'devices.ip',
				ip
			)

			return {
				status: ResultStatus.Success,
				data: devices,
			}
		} catch (error) {
			return {
				status: ResultStatus.Failure,
				data: undefined,
				errorMessage:
					error instanceof Error ? error.message : 'Unknown error',
			}
		}
	},

	async checkExistTokenIat(iat: number): Promise<Result<boolean>> {
		try {
			const devices = await securityRepository.getDevicesByField(
				'devices.iat',
				iat
			)

			return {
				status: ResultStatus.Success,
				data: !!devices.length,
			}
		} catch (error) {
			return {
				status: ResultStatus.Failure,
				data: undefined,
				errorMessage:
					error instanceof Error ? error.message : 'Unknown error',
			}
		}
	},
	async getAllDevicesByDeviceName(
		deviceName: string
	): Promise<Result<DeviceType[]>> {
		try {
			const devices = await securityRepository.getDevicesByField(
				'title',
				deviceName
			)

			return {
				status: ResultStatus.Success,
				data: devices,
			}
		} catch (error) {
			return {
				status: ResultStatus.Failure,
				data: undefined,
				errorMessage:
					error instanceof Error ? error.message : 'Unknown error',
			}
		}
	},

	async getDeviceByIpAndName(
		ip: string,
		deviceName: string
	): Promise<Result<DeviceType[]>> {
		try {
			const devices = await securityRepository.getDeviceByIpAndName(
				ip,
				deviceName
			)

			return {
				status: ResultStatus.Success,
				data: devices,
			}
		} catch (error) {
			return {
				status: ResultStatus.Failure,
				data: undefined,
				errorMessage:
					error instanceof Error ? error.message : 'Unknown error',
			}
		}
	},

	async getDeviceByDeviceId(deviceId: string): Promise<Result<DeviceType>> {
		try {
			const devices = await securityRepository.getDevicesByField(
				'devices.deviceId',
				deviceId
			)

			return {
				status: ResultStatus.Success,
				data: devices[0],
			}
		} catch (error) {
			return {
				status: ResultStatus.NotFound,
				data: undefined,
				errorMessage: 'Device not found',
			}
		}
	},

	async addUserDevice(dto: DeviceType): Promise<Result<string>> {
		try {
			await securityRepository.addUserDevice(dto)

			return {
				status: ResultStatus.Success,
				data: '',
			}
		} catch (error) {
			return {
				status: ResultStatus.Failure,
				data: '',
				errorMessage:
					error instanceof Error ? error.message : 'Unknown error',
			}
		}
	},
	async updateUserDeviceByIpAndNameAndUserId(
		dto: Omit<DeviceType, 'deviceId'>
	): Promise<Result<string>> {
		try {
			await securityRepository.updateUserDeviceByIpAndNameAndUserId(dto)

			return {
				status: ResultStatus.Success,
				data: '',
			}
		} catch (error) {
			return {
				status: ResultStatus.Failure,
				data: '',
				errorMessage:
					error instanceof Error ? error.message : 'Unknown error',
			}
		}
	},
	async updateUserDeviceByDeviceId(
		dto: Omit<DeviceType, 'title' | 'ip'>
	): Promise<Result<string>> {
		try {
			await securityRepository.updateUserDeviceByDeviceId(dto)

			return {
				status: ResultStatus.Success,
				data: '',
			}
		} catch (error) {
			return {
				status: ResultStatus.Failure,
				data: '',
				errorMessage:
					error instanceof Error ? error.message : 'Unknown error',
			}
		}
	},
	async deleteDevices(
		userId: string,
		currentDeviceId: string
	): Promise<Result<boolean>> {
		try {
			await securityRepository.deleteDevices(userId, currentDeviceId)

			return {
				status: ResultStatus.Success,
				data: true,
			}
		} catch (error) {
			return {
				status: ResultStatus.Failure,
				data: false,
				errorMessage:
					error instanceof Error ? error.message : 'Unknown error',
			}
		}
	},

	async deleteDeviceById(
		userId: string,
		deviceId: string
	): Promise<Result<boolean>> {
		try {
			const result = await securityRepository.deleteDeviceById(
				userId,
				deviceId
			)

			if (result?.matchedCount === 0) {
				return {
					status: ResultStatus.NotFound,
					data: false,
					errorMessage: 'Device not found',
				}
			}

			return {
				status: ResultStatus.Success,
				data: true,
			}
		} catch (error) {
			return {
				status: ResultStatus.Failure,
				data: false,
				errorMessage:
					error instanceof Error ? error.message : 'Unknown error',
			}
		}
	},
}
