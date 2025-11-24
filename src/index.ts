import express from 'express'
import { setupApp } from './setup-app'
import { db } from './db/db'

// создание приложения

const appStarter = async () => {
	const app = express()
	setupApp(app)

	app.set('trust proxy', true)

	// порт приложения
	const PORT = process.env.PORT || 5001

	await db.run()

	// запуск приложения
	app.listen(PORT, () => {
		console.log(`Example app listening on port ${PORT}`)
	})
}

appStarter()
