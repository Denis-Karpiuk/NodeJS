import { usersRepository } from '../../users/infrastructure/users.repository'
import { bcryptService } from './bcrypt.service'

export const authService = {
	async login({
		loginOrEmail,
		password,
	}: {
		loginOrEmail: string
		password: string
	}) {
		const user = await usersRepository.findByEmailOrLogin(loginOrEmail)

		if (!user) {
			return {
				success: false,
				error: { field: 'loginOrEmail', message: 'User not found' },
			}
		}

		const isPasswordCorrect = await bcryptService.checkPassword(
			password,
			user.passwordHash
		)

		if (!isPasswordCorrect) {
			return {
				success: false,
				error: { field: 'password', message: 'Password is incorrect' },
			}
		}

		return { success: true }
	},
}
