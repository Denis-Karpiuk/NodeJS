import jwt, { JwtPayload } from 'jsonwebtoken'
import { appConfig } from '../../core/config/config'
import { RefreshTokenType } from '../../core/types/common.types'

export interface MyJwtPayload extends JwtPayload {
	userId: string
	login: string
}

export const jwtService = {
	createToken: async ({
		deviceId,
		userId,
		login,
		expiresIn,
	}: {
		deviceId?: string
		userId: string
		login: string
		expiresIn: any
	}): Promise<string> => {
		return jwt.sign({ userId, login, deviceId }, appConfig.AC_SECRET, {
			expiresIn: expiresIn ?? '1h',
		})
	},

	decodeToken: async (token: string): Promise<RefreshTokenType> => {
		return jwt.decode(token) as RefreshTokenType
	},

	async verifyToken(token: string): Promise<MyJwtPayload> {
		try {
			return jwt.verify(token, appConfig.AC_SECRET) as MyJwtPayload
		} catch (err) {
			throw new Error('Invalid or expired token')
		}
	},
}
