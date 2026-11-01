

export type NewUserData = {
    username: string
	email: string
    passwordHash: string
}

export type User = {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    name: string | null;
    biography: string | null;
    avatarUrl: string | null;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type UserProfile = Omit<User, 
    'passwordHash' |
    'email' |
    'updatedAt'
    >

export type UserCredentials = Pick<User,
    "id" | "email" | "passwordHash"
>

export type OwnProfile = UserProfile & Pick<User, 'email'>

export type UserOrderBy = 'createdAt' | 'username'
