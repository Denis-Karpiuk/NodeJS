import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transport = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASS,
	},
})

export const emailAdapter = {
	sendEmail: async (
		emailAddress: string,
		subject: string,
		template: string
	): Promise<boolean> => {
		const info = await transport.sendMail({
			from: 'Denis <' + process.env.EMAIL + '>',
			to: emailAddress,
			subject: subject,
			html: template,
		})

		return !!info
	},
}
