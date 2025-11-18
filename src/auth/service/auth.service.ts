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
		loginOrEmail,
		password,
	}: {
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

		const accessToken = await jwtService.createToken({
			userId: result.data!._id.toString(),
			login: result.data!.login,
			expiresIn: '10s',
		})

		const refreshToken = await jwtService.createToken({
			userId: result.data!._id.toString(),
			login: result.data!.login,
			expiresIn: '20s',
		})

		return {
			status: ResultStatus.Success,
			data: { accessToken, refreshToken },
			extensions: [],
		}
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
