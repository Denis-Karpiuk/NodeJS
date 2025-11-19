import { NextFunction, Request, Response } from 'express'
import { HttpStatus } from '../../../../core/types/http-statuses'
import { authService } from '../../../service/auth.service'
import { ResultStatus } from '../../../../core/result/resultStatus'
import { resultCodeToHttpException } from '../../../../core/result/resultStatusToHttpCode'
import { MAX_AGE_20_SEC } from '../../../../core/constants/common'

export const loginHandler = async (req: Request, res: Response) => {
	const result = await authService.login(req.body)

	if (result.status !== ResultStatus.Success) {
		return res
			.status(resultCodeToHttpException(result.status))
			.send({ errorsMessages: result.extensions })
	}

	res.cookie('refreshToken', result.data!.refreshToken, {
		httpOnly: true,
		secure: true,
		maxAge: MAX_AGE_20_SEC,
	})

	return res.status(HttpStatus.Success).send({
		accessToken: result.data!.accessToken,
	})
}
