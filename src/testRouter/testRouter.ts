import { Router, Response } from 'express'
import { blogsDB, db, postsDB } from '../db/db'
import { HttpStatus } from '../core/types/http-statuses'
import { BlogsModel } from '../models/blogs.model'
import { PostsModel } from '../models/posts.model'

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (_, res: Response) => {
	db.length = 0
	blogsDB.length = 0
	postsDB.length = 0

	await BlogsModel.deleteMany({})
	await PostsModel.deleteMany({})

	res.sendStatus(HttpStatus.NoContent)
})
