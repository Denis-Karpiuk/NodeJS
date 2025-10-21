import { Request, Response } from 'express'
import { matchedData } from 'express-validator'
import { HttpStatus } from '../../../core/types/http-statuses'
import { blogsService } from '../../service/blog.service'

export const addPostsByBlogId = async (req: Request, res: Response) => {
	res.status(HttpStatus.Created).send('new post')
}
