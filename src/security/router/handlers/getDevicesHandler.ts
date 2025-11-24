import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { ResultStatus } from '../../../core/result/resultStatus'
import { resultCodeToHttpException } from '../../../core/result/resultStatusToHttpCode'
import { securityService } from '../../service/security.service'

export const getDevicesHandler = async (req: Request, res: Response) => {
	const user = req.context!.user!

	const result = await securityService.getAllDevicesByUserId(user.id)

	if (result.status !== ResultStatus.Success) {
		return res
			.status(resultCodeToHttpException(result.status))
			.send({ errorsMessages: result.errorMessage })
	}

	return res.status(HttpStatus.Success).send(
		result?.data?.map(device => ({
			ip: device.ip,
			title: device.title,
			lastActiveDate: device.lastActiveDate,
			deviceId: device.deviceId,
		}))
	)
}
