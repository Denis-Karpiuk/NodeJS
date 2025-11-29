import { MAX_AGE_REFRESH_TOKEN_COOKIE } from '../../core/constants/common'
import { resultCodeToHttpException } from '../../core/result/resultStatusToHttpCode'
import { HttpStatus } from '../../core/types/http-statuses'
import { Request, Response } from 'express'
import { ResultStatus } from '../../core/result/resultStatus'
import { JwtService } from '../service/jwtService'
import { AuthService } from '../service/auth.service'
import { UsersQueryRepository } from '../../users/infrastructure/users.query.repository'
import { injectable } from 'inversify'

@injectable()
export class AuthController {
	constructor(
		protected authService: AuthService,
		protected jwtService: JwtService,
		protected usersQueryRepository: UsersQueryRepository
	) {
		this.login = this.login.bind(this)
		this.registration = this.registration.bind(this)
		this.registrationConfirmation = this.registrationConfirmation.bind(this)
		this.me = this.me.bind(this)
		this.registrationEmailResending =
			this.registrationEmailResending.bind(this)
		this.logout = this.logout.bind(this)
		this.refreshToken = this.refreshToken.bind(this)
		this.passwordRecovery = this.passwordRecovery.bind(this)
		this.createNewPassword = this.createNewPassword.bind(this)
	}

	async login(req: Request, res: Response) {
		const ipAddress =
			req.headers['x-forwarded-for'] || req.socket.remoteAddress
		const deviceName = req.headers['user-agent']

		const result = await this.authService.login({
			...req.body,
			ipAddress,
			deviceName,
		})

		if (result.status !== ResultStatus.Success) {
			return res
				.status(resultCodeToHttpException(result.status))
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

	async me(req: Request, res: Response) {
		const authorization = req.headers.authorization
		const token = authorization?.split(' ')[1]

		if (!token) {
			return res.sendStatus(HttpStatus.Unauthorized)
		}

		let verifiedTokenInfo
		try {
			verifiedTokenInfo = await this.jwtService.verifyToken(token)
		} catch (err) {
			return res.sendStatus(HttpStatus.Unauthorized)
		}

		if (!verifiedTokenInfo) {
			return res.sendStatus(HttpStatus.Unauthorized)
		}

		const result = await this.usersQueryRepository.findUserById(
			verifiedTokenInfo.userId
		)

		if (!result) {
			return res.sendStatus(HttpStatus.Unauthorized)
		}

		const me = {
			email: result.email,
			login: result.login,
			userId: result.id,
		}

		return res.status(HttpStatus.Success).send(me)
	}

	async registration(req: Request, res: Response) {
		const { login, email, password } = req.body

		const result = await this.authService.registration({
			email,
			login,
			password,
		})

		if (result.status !== ResultStatus.Success) {
			return res
				.status(resultCodeToHttpException(result.status))
				.send({ errorsMessages: result.extensions })
		}

		return res.sendStatus(HttpStatus.NoContent)
	}

	async registrationConfirmation(req: Request, res: Response) {
		const { code } = req.body

		const result = await this.authService.registrationConfirmation(code)

		if (result.status !== ResultStatus.Success) {
			return res
				.status(resultCodeToHttpException(result.status))
				.send({ errorsMessages: result.extensions })
		}

		return res.status(HttpStatus.NoContent).send('Registration success')
	}

	async registrationEmailResending(req: Request, res: Response) {
		const { email } = req.body

		const result = await this.authService.registrationEmailResending(email)

		if (result.status !== ResultStatus.Success) {
			return res
				.status(resultCodeToHttpException(result.status))
				.send({ errorsMessages: result.extensions })
		}

		return res.status(HttpStatus.NoContent).send('Resending code success')
	}

	async logout(req: Request, res: Response) {
		const result = await this.authService.logout(req.cookies.refreshToken)

		if (result.status !== ResultStatus.Success) {
			return res
				.status(resultCodeToHttpException(result.status))
				.send({ errorsMessages: result.extensions })
		}

		res.cookie('refreshToken', '')

		return res.sendStatus(HttpStatus.NoContent)
	}

	async refreshToken(req: Request, res: Response) {
		const result = await this.authService.refreshToken(
			req.cookies.refreshToken
		)

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

	async passwordRecovery(req: Request, res: Response) {
		const { email } = req.body

		const result = await this.authService.passwordRecovery(email)

		if (result.status !== ResultStatus.Success) {
			return res
				.status(resultCodeToHttpException(result.status))
				.send({ errorsMessages: result.extensions })
		}

		res.sendStatus(HttpStatus.NoContent)
	}

	async createNewPassword(req: Request, res: Response) {
		const { newPassword, recoveryCode } = req.body

		const result = await this.authService.createNewPassword(
			recoveryCode,
			newPassword
		)

		if (result.status !== ResultStatus.Success) {
			return res
				.status(resultCodeToHttpException(result.status))
				.send({ errorsMessages: result.extensions })
		}

		res.sendStatus(HttpStatus.NoContent)
	}
}
