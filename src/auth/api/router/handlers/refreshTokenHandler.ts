import { Request, Response } from 'express'
import { ResultStatus } from '../../../../core/result/resultStatus'
import { HttpStatus } from '../../../../core/types/http-statuses'
import { authService } from '../../../service/auth.service'
import { MAX_AGE_REFRESH_TOKEN_COOKIE } from '../../../../core/constants/common'

export const refreshTokenHandler = async (req: Request, res: Response) => {
	const result = await authService.refreshToken(req.cookies.refreshToken)

	if (result.status !== ResultStatus.Success) {
		return res
			.status(HttpStatus.Unauthorized)
			.send({ errorsMessages: result.extensions })
	}

	res.cookie('refreshToken', result.data!.refreshToken, {
		httpOnly: true,
		secure: true,
		maxAge: MAX_AGE_REFRESH_TOKEN_COOKIE,
	})

	return res.status(HttpStatus.Success).send({
		accessToken: result.data!.accessToken,
	})
}
