import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

export const transport = nodemailer.createTransport({
	host: process.env.SMTP_HOST!,
	port: Number(process.env.SMTP_PORT),
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
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
