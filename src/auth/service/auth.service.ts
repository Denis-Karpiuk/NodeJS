import { create } from 'domain'
import { log } from 'console'
import { Result } from '../../core/result/result.type'
import { ResultStatus } from '../../core/result/resultStatus'
import { usersRepository } from '../../users/infrastructure/users.repository'
import { UserDBType } from '../../users/types/user.db.type'
import { bcryptService } from './bcrypt.service'
import { WithId } from 'mongodb'
import { jwtService } from './jwtService'

export const authService = {
	async login({
		loginOrEmail,
		password,
	}: {
		loginOrEmail: string
		password: string
	}): Promise<Result<{ accessToken: string } | null>> {
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

		const accessToken = await jwtService.createToken(
			result.data!._id.toString()
		)

		return {
			status: ResultStatus.Success,
			data: { accessToken },
			errorMessage: '',
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

		return { status: ResultStatus.Success, data: user, errorMessage: '' }
	},
}
