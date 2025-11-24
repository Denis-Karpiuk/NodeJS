import { jwtService } from '../../../auth/service/jwtService'
import { ResultStatus } from '../../../core/result/resultStatus'
import { resultCodeToHttpException } from '../../../core/result/resultStatusToHttpCode'
import { HttpStatus } from '../../../core/types/http-statuses'
import { securityService } from '../../service/security.service'
import { Request, Response } from 'express'

export const deleteDeviceByIdHandler = async (req: Request, res: Response) => {
	const { id } = req.params
	const user = req.context!.user!

	const deviceResult = await securityService.getDeviceByDeviceId(id)

	if (deviceResult.status !== ResultStatus.Success) {
		return res
			.status(resultCodeToHttpException(deviceResult.status))
			.send({ errorsMessages: deviceResult.errorMessage })
	}

	if (deviceResult.data?.userId !== user.id) {
		return res.status(HttpStatus.Forbidden).send({
			errorsMessages: [
				{
					message: 'You are not allowed to delete this device',
					field: 'deviceId',
				},
			],
		})
	}

	const result = await securityService.deleteDeviceById(user.id, id)

	if (result.status !== ResultStatus.Success) {
		return res
			.status(resultCodeToHttpException(result.status))
			.send({ errorsMessages: result.errorMessage })
	}

	return res.sendStatus(HttpStatus.NoContent)
}
