import { Request, Response } from 'express'
import { authService } from '../../../service/auth.service'
import { ResultStatus } from '../../../../core/result/resultStatus'
import { resultCodeToHttpException } from '../../../../core/result/resultStatusToHttpCode'
import { HttpStatus } from '../../../../core/types/http-statuses'

export const registrationEmailResendingHandler = async (
	req: Request,
	res: Response
) => {
	const { login, email, password } = req.body

	const result = await authService.registration({ email, login, password })

	if (result.status !== ResultStatus.Success) {
		return res
			.status(resultCodeToHttpException(result.status))
			.send({ errorsMessages: result.extensions })
	}

	return res.status(HttpStatus.NoContent).send('Registration success')
}
