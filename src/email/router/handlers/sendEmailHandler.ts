import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { emailAdapter } from '../../../core/adapters/emailAdapter'

export const sendEmailHandler = async (req: Request, res: Response) => {
	const { email, subject, message } = req.body

	const result = await emailAdapter.sendEmail(email, subject, message)

	res.status(HttpStatus.Success).send(result)
}
