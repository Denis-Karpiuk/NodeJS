// types/express/index.d.ts (или любой .d.ts файл, подключённый к проекту)

import { Request } from 'express'

declare global {
	namespace Express {
		interface Request {
			context?: {
				user?: {
					id: string
					login: string
				}
			}
		}
	}
}
