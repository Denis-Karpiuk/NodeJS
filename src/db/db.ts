import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

export const db = {
	async run(url?: string) {
		try {
			await mongoose.connect(url || process.env.MONGO_URI || '')
			console.info('MongoDB connected successfully')
		} catch (err) {
			console.error(`MongoDB connection error: ${err}`)
			process.exit(1)
		}

		// Обработчики событий подключения
		mongoose.connection.on('connected', () => {
			console.info('Mongoose connected to DB')
		})

		mongoose.connection.on('error', err => {
			console.error(`MongoDB connection error: ${err}`)
		})

		mongoose.connection.on('disconnected', () => {
			console.info('Mongoose disconnected')
		})

		// Graceful shutdown
		process.on('SIGINT', async () => {
			await mongoose.connection.close()
			console.info('Mongoose connection closed due to app termination')
			process.exit(0)
		})
	},

	async drop() {
		await mongoose.connection.dropDatabase()
	},

	async stop() {
		await mongoose.connection.close()
	},
}
