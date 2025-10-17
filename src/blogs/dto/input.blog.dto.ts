export type InputBlogDto = {
	id: string
	name: string
	description: string
	websiteUrl: string
	createdAt: Date
	isMembership: boolean
}

export type newBlogBodyType = Omit<InputBlogDto, 'id' | 'createdAt'>
