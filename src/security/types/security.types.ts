export type RequestDto = {
	ip: string
	url: string
	date: Date
}

export type DeviceType = {
	ip: string
	title: string
	lastActiveDate: Date
	deviceId: string
	userId: string
	iat: number
	exp: number
}
