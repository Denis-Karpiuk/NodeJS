import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'

export const updateCommentHandler = (req: Request, res: Response) => {
	res.status(HttpStatus.NoContent).send('update comment')
}
