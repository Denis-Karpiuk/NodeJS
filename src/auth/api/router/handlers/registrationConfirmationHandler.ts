import { Request, Response } from 'express'
import { authService } from '../../../service/auth.service'
import { ResultStatus } from '../../../../core/result/resultStatus'
import { resultCodeToHttpException } from '../../../../core/result/resultStatusToHttpCode'
import { HttpStatus } from '../../../../core/types/http-statuses'

export const registrationConfirmationHandler = async (
	req: Request,
	res: Response
) => {
	const { code } = req.body

	const result = await authService.registrationConfirmation(code)

	if (result.status !== ResultStatus.Success) {
		return res
			.status(resultCodeToHttpException(result.status))
			.send({ errorsMessages: result.extensions })
	}

	res.status(HttpStatus.NoContent).send('Registration success')
}
