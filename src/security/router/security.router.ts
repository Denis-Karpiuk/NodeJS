import { Router } from 'express'
import { authBearerMiddleware } from '../../core/middlewares/authBearerMiddleWare'
import { deleteDeviceByIdHandler } from './handlers/deleteDevicesByIdHanlder'
import { deleteDevicesHandler } from './handlers/deleteDevicesHanlder'
import { getDevicesHandler } from './handlers/getDevicesHandler'
import { idParamsValidator } from '../../core/middlewares/requiredId.middleWare'
import { validation } from '../../core/middlewares/validatation.middleware'

export const securityRouter = Router({})
	.get('/devices', authBearerMiddleware, getDevicesHandler)
	.delete('/devices', authBearerMiddleware, deleteDevicesHandler)
	.delete(
		'/devices/:id',
		idParamsValidator,
		validation,
		authBearerMiddleware,
		deleteDeviceByIdHandler
	)
