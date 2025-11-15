import { Resend } from 'resend'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY)

export const transport = nodemailer.createTransport({
	host: process.env.SMTP_HOST!,
	port: Number(process.env.SMTP_PORT),
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
})

export const emailAdapter2 = {
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

export const emailAdapter1 = {
	sendEmail: async (
		emailAddress: string,
		subject: string,
		template: string
	): Promise<boolean> => {
		try {
			const info = await resend.emails.send({
				from: 'Denis <onboarding@resend.dev>', // можно позже подключить свой домен
				to: emailAddress,
				subject: subject,
				html: template,
			})

			return !!info
		} catch (error) {
			console.error('Error sending email', error)
			return false
		}
	},
}
