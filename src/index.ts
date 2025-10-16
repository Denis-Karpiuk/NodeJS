import express from 'express'
import { setupApp } from './setup-app'
import { connectDB } from './core/connectDB'

// создание приложения

const appStarter = async () => {
	const app = express()
	setupApp(app)

	// порт приложения
	const PORT = process.env.PORT || 5001

	await connectDB()

	// запуск приложения
	app.listen(PORT, () => {
		console.log(`Example app listening on port ${PORT}`)
	})
}

appStarter()
