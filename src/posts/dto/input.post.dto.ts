export type InputPostDto = {
	id: number
	title: string
	shortDescription: string
	content: string
	blogId: string
	blogName: string
}

export type newPostBodyType = Omit<InputPostDto, 'id' | 'blogName'>
