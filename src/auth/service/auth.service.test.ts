import { MongoMemoryServer } from 'mongodb-memory-server'
import { db } from '../../db/db'
import { authService } from './auth.service'
import { ResultStatus } from '../../core/result/resultStatus'
import { emailAdapter } from '../../core/adapters/emailAdapter'
import { usersService } from '../../users/service/users.service'
import { User } from '../../users/service/user.entity'
import { usersRepository } from '../../users/infrastructure/users.repository'

const testSeeder = {
	createUserDto: () => {
		return {
			login: 'test',
			password: 'test',
			email: 'test@test.com',
		}
	},
	insertUser: ({
		login,
		email,
		password,
		code,
		isConfirmed,
	}: {
		login: string
		email: string
		password: string
		code?: string
		isConfirmed?: boolean
	}) => {
		const user = new User(login, email, password)
		if (code) {
			user.emailConfirmation.confirmationCode = code
		}
		if (isConfirmed) {
			user.emailConfirmation.isConfirmed = isConfirmed
		}
		return usersRepository.create(user)
	},
}

describe('AUTH-INTEGRATION', () => {
	let mongoServer: MongoMemoryServer

	beforeAll(async () => {
		mongoServer = await MongoMemoryServer.create()
		await db.run(mongoServer.getUri())
	})

	afterAll(async () => {
		await db.drop()
		await db.stop()
		await mongoServer.stop()
	})

	describe('Create user', () => {
		beforeEach(() => {
			jest.spyOn(emailAdapter, 'sendEmail').mockResolvedValue(true)
		})

		afterEach(() => {
			jest.restoreAllMocks()
		})

		const registerUserUseCase = authService.registration

		it('should register user with correct data status', async () => {
			const { login, password, email } = testSeeder.createUserDto()

			const result = await registerUserUseCase({ login, password, email })

			expect(result.status).toBe(ResultStatus.Success)
			expect(emailAdapter.sendEmail).toHaveBeenCalled()
			expect(emailAdapter.sendEmail).toHaveBeenCalledTimes(1)
		})

		it('should not register user twice', async () => {
			const { login, password, email } = testSeeder.createUserDto()
			await testSeeder.insertUser({ login, password, email })

			const result = await registerUserUseCase({ login, password, email })

			expect(result.status).toBe(ResultStatus.BadRequest)
		})
	})

	describe('Confirm email', () => {
		const confirmEmailUseCase = authService.registrationConfirmation

		it('should not confirm email if user does not exist', async () => {
			const result = await confirmEmailUseCase('bnfgndflkgmk')

			expect(result.status).toBe(ResultStatus.BadRequest)
		})

		it('should not confirm email which is confirmed', async () => {
			const code = 'test'

			const { login, password, email } = testSeeder.createUserDto()
			await testSeeder.insertUser({
				login,
				password,
				email,
				code,
				isConfirmed: true,
			})

			const result = await confirmEmailUseCase(code)

			expect(result.status).toBe(ResultStatus.BadRequest)
		})

		it('should not confirm email with expired code', async () => {
			const code = 'test'

			const { login, password, email } = testSeeder.createUserDto()
			await usersService.createUser({ login, password, email })

			const result = await confirmEmailUseCase(code)

			expect(result.status).toBe(ResultStatus.BadRequest)
		})

		it('confirm user', async () => {
			const code = 'code'

			const { login, password, email } = testSeeder.createUserDto()

			const user = new User(login, email, password)
			user.emailConfirmation.confirmationCode = code
			user.emailConfirmation.expirationDate = new Date(
				Date.now() + 2 * 60 * 1000
			) // 2 minutes in the future

			await usersRepository.create(user)

			const result = await confirmEmailUseCase(code)

			expect(result.status).toBe(ResultStatus.Success)
		})
	})
})
