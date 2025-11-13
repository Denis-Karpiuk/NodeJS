export type UserDBType = {
	email: string
	login: string
	passwordHash: string
	createdAt: Date
	emailConfirmation: {
		confirmationCode: string
		expirationDate: Date
		isConfirmed: boolean
	}
}
