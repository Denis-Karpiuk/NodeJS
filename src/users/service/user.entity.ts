import { randomUUID } from 'crypto'

export class User {
	login: string
	email: string
	passwordHash: string
	createdAt: Date
	confirmationCode: string
	emailConfirmation: {
		confirmationCode: string
		expirationDate: Date
		isConfirmed: boolean
	}

	constructor(login: string, email: string, hash: string) {
		this.login = login
		this.email = email
		this.passwordHash = hash
		this.createdAt = new Date()
		this.confirmationCode = randomUUID()
		this.emailConfirmation = {
			expirationDate: new Date(Date.now() + 2 * 60 * 1000),
			confirmationCode: this.confirmationCode,
			isConfirmed: false,
		}
	}
}
