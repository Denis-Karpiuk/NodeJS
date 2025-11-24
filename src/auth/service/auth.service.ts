import { WithId } from 'mongodb'
import { emailManager } from '../../core/managers/emailManager'
import { Result } from '../../core/result/result.type'
import { ResultStatus } from '../../core/result/resultStatus'
import { usersRepository } from '../../users/infrastructure/users.repository'
import { User } from '../../users/service/user.entity'
import { CreateUserDto } from '../../users/types/create.user.dto'
import { UserDBType } from '../../users/types/user.db.type'
import { bcryptService } from './bcrypt.service'
import { jwtService } from './jwtService'
import { randomUUID } from 'crypto'
import { tokenBlackListRepository } from '../repository/tokenRepository'
import { securityService } from '../../security/service/security.service'

export const authService = {
	async registration({
		email,
		login,
		password,
	}: CreateUserDto): Promise<Result<User | null>> {
		const userByLogin = await usersRepository.findByEmailOrLogin(login)
		const userByEmail = await usersRepository.findByEmailOrLogin(email)

		if (userByLogin || userByEmail) {
			const extensions: Array<{ field: string; message: string }> = []

			if (userByLogin) {
				extensions.push({
					field: 'login',
					message: 'Already Registered',
				})
			}

			if (userByEmail) {
				extensions.push({
					field: 'email',
					message: 'Already Registered',
				})
			}

			return {
				status: ResultStatus.BadRequest,
				extensions,
				errorMessage: 'Bad Request',
			}
		}

		const passwordHash = await bcryptService.generateHash(password)

		const newUser = new User(login, email, passwordHash)

		await usersRepository.create(newUser)

		emailManager
			.sendConfirmationCode(
				newUser.email,
				newUser.emailConfirmation.confirmationCode
			)
			.catch(err => console.log('Error sending email', err))

		return {
			status: ResultStatus.Success,
			data: newUser,
			extensions: [],
		}
	},

	async registrationConfirmation(code: string): Promise<Result<string>> {
		const userByConfirmationCode =
			await usersRepository.findByConfirmationCode(code)

		if (!userByConfirmationCode) {
			return {
				status: ResultStatus.BadRequest,
				extensions: [
					{
						field: 'code',
						message: 'User not found',
					},
				],
				errorMessage: 'Bad Request',
			}
		}

		const isConfirmed = userByConfirmationCode.emailConfirmation.isConfirmed

		if (isConfirmed) {
			return {
				status: ResultStatus.BadRequest,
				extensions: [
					{
						field: 'code',
						message: 'User already confirmed',
					},
				],
				errorMessage: 'Bad Request',
			}
		}

		const expirationData =
			userByConfirmationCode.emailConfirmation.expirationDate

		if (expirationData < new Date()) {
			return {
				status: ResultStatus.BadRequest,
				extensions: [
					{
						field: 'code',
						message: 'Confirmation code expired',
					},
				],
				errorMessage: 'Bad Request',
			}
		}

		await usersRepository.updateUser(
			userByConfirmationCode._id.toString(),
			{
				emailConfirmation: {
					...userByConfirmationCode.emailConfirmation,
					isConfirmed: true,
				},
			}
		)

		emailManager
			.sendVerifiedEmail(userByConfirmationCode.email)
			.catch(err => console.log('Error sending email', err))

		return {
			status: ResultStatus.Success,
			data: 'Success confirmation email',
			extensions: [],
		}
	},

	async login({
		deviceName,
		ipAddress,
		loginOrEmail,
		password,
	}: {
		deviceName?: string
		ipAddress: string
		loginOrEmail: string
		password: string
	}): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
		const result = await this.checkUserCredentials(loginOrEmail, password)

		if (result.status !== ResultStatus.Success) {
			return {
				status: ResultStatus.Unauthorized,
				errorMessage: 'Unauthorized',
				extensions: [
					{ field: 'loginOrEmail', message: 'Wrong credentials' },
				],
			}
		}

		const userId = result.data!._id.toString()

		const deviceId = randomUUID()

		const accessToken = await jwtService.createToken({
			userId,
			login: result.data!.login,
			expiresIn: '10s',
		})

		const refreshToken = await jwtService.createToken({
			deviceId,
			userId,
			login: result.data!.login,
			expiresIn: '20s',
		})

		const refreshTokenInfo = await jwtService.decodeToken(refreshToken)

		const deviceNameNormalized = deviceName ?? 'Unknown device name'

		const existingDevice = await securityService.getDeviceByIpAndName(
			ipAddress,
			deviceNameNormalized
		)

		const shouldAddDevice =
			existingDevice.status === ResultStatus.Success &&
			!existingDevice.data?.length

		if (shouldAddDevice) {
			securityService.addUserDevice({
				ip: ipAddress,
				title: deviceNameNormalized,
				lastActiveDate: new Date(),
				deviceId: refreshTokenInfo.deviceId,
				userId: refreshTokenInfo.userId,
				iat: refreshTokenInfo.iat,
				exp: refreshTokenInfo.exp,
			})
		} else {
			securityService.updateUserDeviceByIpAndNameAndUserId({
				ip: ipAddress,
				title: deviceNameNormalized,
				lastActiveDate: new Date(),
				userId: refreshTokenInfo.userId,
				iat: refreshTokenInfo.iat,
				exp: refreshTokenInfo.exp,
			})
		}

		return {
			status: ResultStatus.Success,
			data: { accessToken, refreshToken },
			extensions: [],
		}
	},

	async logout(refreshToken: string): Promise<Result<boolean>> {
		const parts = refreshToken?.split('.')
		if (parts?.length !== 3) {
			return {
				status: ResultStatus.Unauthorized,
				extensions: [
					{
						field: 'refreshToken',
						message: 'Invalid refresh token',
					},
				],
			}
		}

		const blackListTokenResult =
			await tokenBlackListRepository.findOne(refreshToken)

		if (blackListTokenResult.status === ResultStatus.Success) {
			return {
				status: ResultStatus.Unauthorized,
				extensions: [
					{
						field: 'refreshToken',
						message: 'Refresh token is blacklisted',
					},
				],
			}
		}

		try {
			const payload = await jwtService.verifyToken(refreshToken)

			if (payload.exp) {
				tokenBlackListRepository.addOne({
					userId: payload.userId,
					token: refreshToken,
					expiresAt: new Date(payload.exp),
				})
			}
		} catch (err: any) {
			return {
				status: ResultStatus.Unauthorized,
				extensions: [
					{
						field: 'refreshToken',
						message: err?.message,
					},
				],
			}
		}

		return {
			status: ResultStatus.Success,
			data: true,
			extensions: [],
		}
	},

	async refreshToken(
		refreshToken: string
	): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
		const isRefreshToken = this.checkIsToken(refreshToken)
		if (!isRefreshToken) {
			return {
				status: ResultStatus.Unauthorized,
				extensions: [
					{
						field: 'refreshToken',
						message: 'Invalid refresh token',
					},
				],
			}
		}

		const { iat } = await jwtService.decodeToken(refreshToken)

		const checkRefreshTokenIatResult =
			await securityService.checkExistTokenIat(iat)

		if (
			checkRefreshTokenIatResult.status !== ResultStatus.Success ||
			!checkRefreshTokenIatResult.data
		) {
			return {
				status: ResultStatus.Unauthorized,
				extensions: [
					{
						field: 'refreshToken',
						message: 'Refresh token is blacklisted',
					},
				],
			}
		}

		try {
			const refreshTokenPayload =
				await jwtService.verifyToken(refreshToken)

			const { userId, login, exp, iat, deviceId } = refreshTokenPayload

			if (iat) {
				securityService.updateUserDeviceByDeviceId({
					userId: userId,
					iat: iat ?? 0,
					lastActiveDate: new Date(),
					deviceId: deviceId,
					exp: exp ?? 0,
				})
			}

			const accessToken = await jwtService.createToken({
				userId,
				login,
				expiresIn: '10s',
			})

			const newRefreshToken = await jwtService.createToken({
				deviceId,
				userId,
				login,
				expiresIn: '20s',
			})

			return {
				status: ResultStatus.Success,
				data: { accessToken, refreshToken: newRefreshToken },
				extensions: [],
			}
		} catch (err: any) {
			return {
				status: ResultStatus.Unauthorized,
				extensions: [
					{
						field: 'refreshToken',
						message: err?.message,
					},
				],
			}
		}
	},

	checkIsToken(refreshToken: string) {
		return refreshToken?.split('.').length === 3
	},

	async checkUserCredentials(
		loginOrEmail: string,
		password: string
	): Promise<Result<WithId<UserDBType> | null>> {
		const user = await usersRepository.findByEmailOrLogin(loginOrEmail)

		if (!user) {
			return {
				status: ResultStatus.NotFound,
				data: null,
				errorMessage: 'Not found',
				extensions: [
					{ field: 'loginOrEmail', message: 'User not found' },
				],
			}
		}

		const isPasswordCorrect = await bcryptService.checkPassword(
			password,
			user.passwordHash
		)

		if (!isPasswordCorrect) {
			return {
				status: ResultStatus.BadRequest,
				data: null,
				errorMessage: 'Not found',
				extensions: [
					{ field: 'loginOrEmail', message: 'User not found' },
				],
			}
		}

		const isConfirmed = user.emailConfirmation.isConfirmed

		if (!isConfirmed) {
			return {
				status: ResultStatus.Unauthorized,
				data: null,
				errorMessage: 'Unauthorized',
				extensions: [
					{ field: 'loginOrEmail', message: 'Email not confirmed' },
				],
			}
		}

		return { status: ResultStatus.Success, data: user, extensions: [] }
	},

	async registrationEmailResending(email: string): Promise<Result<string>> {
		const user = await usersRepository.findByEmailOrLogin(email)

		if (!user) {
			return {
				status: ResultStatus.BadRequest,
				extensions: [
					{
						field: 'email',
						message: 'User not found',
					},
				],
				errorMessage: 'Bad Request',
			}
		}

		const isConfirmed = user.emailConfirmation.isConfirmed

		if (isConfirmed) {
			return {
				status: ResultStatus.BadRequest,
				extensions: [
					{
						field: 'email',
						message: 'Email already confirmed',
					},
				],
				errorMessage: 'Bad Request',
			}
		}

		const confirmationCode = randomUUID()

		await usersRepository.updateUser(user._id.toString(), {
			emailConfirmation: {
				...user.emailConfirmation,
				confirmationCode,
				expirationDate: new Date(Date.now() + 2 * 60 * 1000),
			},
		})

		emailManager
			.sendConfirmationCode(user.email, confirmationCode)
			.catch(err => console.log('Error sending email', err))

		return {
			status: ResultStatus.Success,
			data: 'Success',
			extensions: [],
		}
	},
}
