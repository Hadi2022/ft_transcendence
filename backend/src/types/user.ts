export type NewUserData = {
    username: string
	email: string
    passwordHash: string
}

export type User = NewUserData & {
    id: string
}