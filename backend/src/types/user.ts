
import type { User } from '@prisma/client'

export type NewUserData = {
    username: string
	email: string
    passwordHash: string
}

export type UserProfile = Omit<User, 
    'passwordHash' |
    'email' |
    'updatedAt'
    >

export type UserCredentials = Pick<User,
    "id" | "email" | "passwordHash"
>

export type OwnProfile = UserProfile & Pick<User, 'email'>
