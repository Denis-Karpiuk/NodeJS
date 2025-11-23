import { subSeconds } from 'date-fns'
import { Result } from '../../core/result/result.type'
import { ResultStatus } from '../../core/result/resultStatus'
import { secureRepository } from '../repository/secure.repository'
import { RequestDto } from '../types/request.dto'

export const secureService = {
	async addRequestToRequestsList(
		data: Omit<RequestDto, 'date'>
	): Promise<Result<null>> {
		const result = await secureRepository.addRequestByIp(data.IP, {
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
			await secureRepository.getRequestsTotalCountByFilter({
				...filter,
				date: tenSecondsAgo,
			})

		if (!requestsCount) {
			return 0
		}

		return requestsCount
	},
}
