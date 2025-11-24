import { Router } from 'express'
import { authRefreshTokenMiddleware } from '../../core/middlewares/authRefreshTokenMiddleWare'
import { deleteDeviceByIdHandler } from './handlers/deleteDevicesByIdHanlder'
import { deleteDevicesHandler } from './handlers/deleteDevicesHanlder'
import { getDevicesHandler } from './handlers/getDevicesHandler'

export const securityRouter = Router({})
	.get('/devices', authRefreshTokenMiddleware, getDevicesHandler)
	.delete('/devices', authRefreshTokenMiddleware, deleteDevicesHandler)
	.delete('/devices/:id', authRefreshTokenMiddleware, deleteDeviceByIdHandler)
