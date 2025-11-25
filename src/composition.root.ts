import 'reflect-metadata'
import { Container } from 'inversify'
import { AuthService } from './auth/service/auth.service'
import { AuthController } from './auth/controller/auth.controller'
import { JwtService } from './auth/service/jwtService'
import { BcryptService } from './auth/service/bcrypt.service'
import { UsersRepository } from './users/infrastructure/users.repository'
import { UsersQueryRepository } from './users/infrastructure/users.query.repository'

export const iocContainer: Container = new Container()

iocContainer.bind(UsersRepository).to(UsersRepository)
iocContainer.bind(UsersQueryRepository).to(UsersQueryRepository)
iocContainer.bind(JwtService).to(JwtService)
iocContainer.bind(BcryptService).to(BcryptService)
iocContainer.bind(AuthService).to(AuthService)
iocContainer.bind(AuthController).to(AuthController)
