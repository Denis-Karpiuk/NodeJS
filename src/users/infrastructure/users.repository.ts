import { WithId } from 'mongodb'
import { isValidObjectId } from 'mongoose'
import { UsersModel } from '../../models/users.model'
import { UserDBType } from '../types/user.db.type'

export const usersRepository = {
	async findByEmailOrLogin(
		loginOrEmail: string
	): Promise<WithId<UserDBType> | null> {
		const result = await UsersModel.findOne({
			$or: [{ email: loginOrEmail }, { login: loginOrEmail }],
		}).lean()

		return result as WithId<UserDBType> | null
	},

	async create(user: UserDBType): Promise<string> {
		const newUser = new UsersModel(user)
		await newUser.save()

		return newUser._id.toString()
	},

	async deleteUserById(id: string) {
		if (!isValidObjectId(id)) {
			return null
		}

		return await UsersModel.findByIdAndDelete(id)
	},

	async doesExistByLoginOrEmail(
		login: string,
		email: string
	): Promise<boolean> {
		const resultByLogin = await this.findByEmailOrLogin(login)
		if (resultByLogin) return true

		const resultByEmail = await this.findByEmailOrLogin(email)
		if (resultByEmail) return true

		return false
	},

	async findByConfirmationCode(
		confirmationCode: string
	): Promise<WithId<UserDBType> | null> {
		const result = await UsersModel.findOne({
			'emailConfirmation.confirmationCode': confirmationCode,
		}).lean()

		return result as WithId<UserDBType> | null
	},

	async updateUser(
		id: string,
		body: Partial<UserDBType>
	): Promise<WithId<UserDBType> | null> {
		return await UsersModel.findOneAndUpdate({ _id: id }, body, {
			new: true,
		})
	},
}
