import { model } from 'mongoose'
import { LikeSchema } from './likeSchema'

export const CommentsLikesModel = model('commentsLikes', LikeSchema)
