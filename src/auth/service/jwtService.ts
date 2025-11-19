import jwt, { JwtPayload } from 'jsonwebtoken'
import { appConfig } from '../../core/config/config'

export interface MyJwtPayload extends JwtPayload {
	userId: string
	login: string
}

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

	async verifyToken(token: string): Promise<MyJwtPayload> {
		try {
			return jwt.verify(token, appConfig.AC_SECRET) as MyJwtPayload
		} catch (err) {
			throw new Error('Invalid or expired token')
		}
	},
}
