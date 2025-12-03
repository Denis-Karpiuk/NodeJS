import { model } from 'mongoose'
import { LikeSchema } from './likeSchema'

export const PostLikesModel = model('postLikes', LikeSchema)
