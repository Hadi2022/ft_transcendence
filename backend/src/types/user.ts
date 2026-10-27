export type NewUserData = {
    username: string
	email: string
    passwordHash: string
}

export type User = NewUserData & {
    id: string
}

export interface userResponseDto {
    id:string;
    username: string;
    email: string;
}
