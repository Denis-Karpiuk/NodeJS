import jwt from 'jsonwebtoken'
import { appConfig } from '../../core/config/config'
import { decode } from 'punycode'

export const jwtService = {
	createToken: async ({
		userId,
		login,
		expiresIn,
	}: {
		userId: string
		login: string
		expiresIn: any
	}): Promise<string> => {
		return jwt.sign({ userId, login }, appConfig.AC_SECRET, {
			expiresIn: expiresIn ?? '1h',
		})
	},

	decodeToken: async (token: string): Promise<any> => {
		return jwt.decode(token)
	},
}
