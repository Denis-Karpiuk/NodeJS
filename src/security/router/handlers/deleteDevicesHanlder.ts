import { jwtService } from '../../../auth/service/jwtService'
import { ResultStatus } from '../../../core/result/resultStatus'
import { resultCodeToHttpException } from '../../../core/result/resultStatusToHttpCode'
import { HttpStatus } from '../../../core/types/http-statuses'
import { securityService } from '../../service/security.service'
import { Request, Response } from 'express'

export const deleteDevicesHandler = async (req: Request, res: Response) => {
	const user = req.context!.user!

	const refreshTokenPayload = await jwtService.decodeToken(
		req.cookies.refreshToken
	)

	if (!refreshTokenPayload?.deviceId) {
		return res.status(HttpStatus.BadRequest).send({
			errorsMessages: [
				{ message: 'Device ID is required', field: 'deviceId' },
			],
		})
	}

	const result = await securityService.deleteDevices(
		user.id,
		refreshTokenPayload.deviceId
	)

	if (result.status !== ResultStatus.Success) {
		return res
			.status(resultCodeToHttpException(result.status))
			.send({ errorsMessages: result.errorMessage })
	}

	return res.sendStatus(HttpStatus.NoContent)
}
