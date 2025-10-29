import { Router } from 'express'

export const authRouter = Router({}).post('/login', (req, res) => {
	res.send('login')
})
