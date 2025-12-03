import { Container } from 'inversify'
import 'reflect-metadata'
import { AuthController } from '../auth/controller/auth.controller'
import { AuthService } from '../auth/service/auth.service'
import { BcryptService } from '../auth/service/bcrypt.service'
import { JwtService } from '../auth/service/jwtService'
import { CommentsController } from '../comments/controller/comments.controller'
import { CommentQwRepository } from '../comments/repository/comment.query.repository'
import { CommentRepository } from '../comments/repository/comment.repository'
import { CommentService } from '../comments/services/comment.service'
import { PostsService } from '../posts/services/post-service'
import { UsersQueryRepository } from '../users/infrastructure/users.query.repository'
import { UsersRepository } from '../users/infrastructure/users.repository'
import { PostsRepository } from './../posts/repository/posts.repository'
import { BlogsService } from '../blogs/service/blog.service'
import { BlogsRepository } from '../blogs/repository/blogs.mongo.repository'
import { BlogsController } from '../blogs/controller/blogs.controller'
import { PostController } from '../posts/controller/post.controller'
import { CommentsLikeService } from '../likes/servece/comments.like.service'
import { CommentsLikesRepository } from '../likes/repository/comment.likes.repository'

export const iocContainer: Container = new Container()

iocContainer.bind(UsersRepository).to(UsersRepository)
iocContainer.bind(UsersQueryRepository).to(UsersQueryRepository)
iocContainer.bind(JwtService).to(JwtService)
iocContainer.bind(BcryptService).to(BcryptService)
iocContainer.bind(AuthService).to(AuthService)
iocContainer.bind(AuthController).to(AuthController)
iocContainer.bind(CommentsController).to(CommentsController)
iocContainer.bind(CommentService).to(CommentService)
iocContainer.bind(CommentQwRepository).to(CommentQwRepository)
iocContainer.bind(CommentRepository).to(CommentRepository)
iocContainer.bind(PostsRepository).to(PostsRepository)
iocContainer.bind(PostsService).to(PostsService)
iocContainer.bind(BlogsService).to(BlogsService)
iocContainer.bind(BlogsRepository).to(BlogsRepository)
iocContainer.bind(BlogsController).to(BlogsController)
iocContainer.bind(PostController).to(PostController)
iocContainer.bind(CommentsLikeService).to(CommentsLikeService)
iocContainer.bind(CommentsLikesRepository).to(CommentsLikesRepository)
