import { Router } from 'express'
import { sendEmailHandler } from './handlers/sendEmailHandler'

export const emailRouter = Router({}).post('/send', sendEmailHandler)
