import { Router, Response } from 'express'
import { blogsDB, db } from '../db/db'
import { HttpStatus } from '../core/types/http-statuses'

export const testingRouter = Router({})

testingRouter.delete('/all-data', (_, res: Response) => {
	db.length = 0
	blogsDB.length = 0
	res.sendStatus(HttpStatus.NoContent)
})
