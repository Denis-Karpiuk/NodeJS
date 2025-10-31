import { bcryptService } from '../../auth/service/bcrypt.service'
import { usersRepository } from '../infrastructure/users.repository'
import { CreateUserDto } from '../types/create.user.dto'

export const usersService = {
	async createUser(dto: CreateUserDto): Promise<{
		error?: { field: string; message: string }
		id?: string
	}> {
		const { email, login, password } = dto

		const userByEmail = await usersRepository.findByEmailOrLogin(email)
		const userByLogin = await usersRepository.findByEmailOrLogin(login)

		if (userByEmail) {
			return {
				error: { field: 'email', message: 'email should be unique' },
			}
		}

		if (userByLogin) {
			return {
				error: { field: 'login', message: 'login should be unique' },
			}
		}

		const passwordHash = await bcryptService.generateHash(password)

		const userId = await usersRepository.create({
			email,
			login,
			passwordHash,
			createdAt: new Date(),
		})

		return { id: userId }
	},

	async deleteUser(id: string) {
		return usersRepository.deleteUserById(id)
	},
}
