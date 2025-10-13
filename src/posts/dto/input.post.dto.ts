export type InputPostDto = {
	id: number
	title: string
	shortDescription: string
	content: string
	blogId: number
	blogName: string
}

export type newPostBodyType = Omit<InputPostDto, 'id' | 'blogName'>
