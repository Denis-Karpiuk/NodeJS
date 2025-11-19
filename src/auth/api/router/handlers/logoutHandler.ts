import { Request, Response } from 'express'
import { ResultStatus } from '../../../../core/result/resultStatus'
import { resultCodeToHttpException } from '../../../../core/result/resultStatusToHttpCode'
import { HttpStatus } from '../../../../core/types/http-statuses'
import { authService } from '../../../service/auth.service'

export const logoutHandler = async (req: Request, res: Response) => {
	const result = await authService.logout(req.cookies.refreshToken)

	if (result.status !== ResultStatus.Success) {
		return res
			.status(resultCodeToHttpException(result.status))
			.send({ errorsMessages: result.extensions })
	}

	res.cookie('refreshToken', '')

	return res.sendStatus(HttpStatus.NoContent)
}
