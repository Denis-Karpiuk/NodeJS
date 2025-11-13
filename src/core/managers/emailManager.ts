import { authEmails } from '../adapters/authEmails'
import { emailAdapter } from '../adapters/emailAdapter'

export const emailManager = {
	async sendConfirmationCode(email: string, confirmationCode: string) {
		const result = await emailAdapter.sendEmail(
			email,
			'Confirmation registration code',
			authEmails.registrationEmail(confirmationCode)
		)

		return result
	},

	async sendVerifiedEmail(email: string) {
		const result = await emailAdapter.sendEmail(
			email,
			'Success verified email',
			authEmails.verifiedEmailSuccess()
		)
		return result
	},
}
