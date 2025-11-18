import { add } from 'date-fns'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { emailAdapter } from '../../core/adapters/emailAdapter'
import { ResultStatus } from '../../core/result/resultStatus'
import { db } from '../../db/db'
import { UsersModel } from '../../models/users.model'
import { usersRepository } from '../../users/infrastructure/users.repository'
import { User } from '../../users/service/user.entity'
import { usersService } from '../../users/service/users.service'
import { authService } from './auth.service'
import { bcryptService } from './bcrypt.service'

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
		passwordHash,
		code,
		isConfirmed,
	}: {
		login: string
		email: string
		passwordHash: string
		code?: string
		isConfirmed?: boolean
	}) => {
		const user = new User(login, email, passwordHash)
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
		beforeEach(async () => {
			await UsersModel.deleteMany({})
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

		it('should return confirmation code when user is registered', async () => {
			const { login, password, email } = testSeeder.createUserDto()

			const result = await registerUserUseCase({ login, password, email })

			expect(result.status).toBe(ResultStatus.Success)
			expect(result.data).toBeDefined()
			expect(result.data).toBeInstanceOf(User)
			expect(
				result.data?.emailConfirmation?.confirmationCode
			).toBeDefined()
			expect(result.data?.emailConfirmation?.confirmationCode).toEqual(
				expect.any(String)
			)
			expect(
				result.data?.emailConfirmation?.confirmationCode.length
			).toBeGreaterThan(0)
		})

		it('should not register user twice', async () => {
			const { login, password, email } = testSeeder.createUserDto()

			const passwordHash = await bcryptService.generateHash(password)
			await testSeeder.insertUser({ login, passwordHash, email })

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

			const passwordHash = await bcryptService.generateHash(password)

			await testSeeder.insertUser({
				login,
				passwordHash,
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
			;((user.emailConfirmation.expirationDate = add(new Date(), {
				hours: 1,
				minutes: 30,
			})),
				await usersRepository.create(user))

			const result = await confirmEmailUseCase(code)

			expect(result.status).toBe(ResultStatus.Success)
		})
	})

	describe('Login user', () => {
		let userEmail: string, userPassword: string

		beforeEach(async () => {
			await UsersModel.deleteMany({})
			jest.spyOn(emailAdapter, 'sendEmail').mockResolvedValue(true)

			const { login, password, email } = testSeeder.createUserDto()
			userEmail = email
			userPassword = password
			const confirmationCode = 'code'

			const passwordHash = await bcryptService.generateHash(password)

			await testSeeder.insertUser({
				login,
				passwordHash,
				email,
				code: confirmationCode,
				isConfirmed: true,
			})
		})

		const loginUseCase = authService.login.bind(authService)

		it('should login user and return access token in body', async () => {
			const result = await loginUseCase({
				loginOrEmail: userEmail,
				password: userPassword,
			})

			expect(result.status).toBe(ResultStatus.Success)
			expect(result.data).toBeDefined()
			expect(result.data).toBeInstanceOf(Object)
			expect(result.data?.accessToken).toBeDefined()
		})

		it('should not login user if user does not exist', async () => {
			const result = await loginUseCase({
				loginOrEmail: 'incorrectEmail',
				password: 'incorrectPassword',
			})

			expect(result.status).toBe(ResultStatus.Unauthorized)
		})
	})
})
