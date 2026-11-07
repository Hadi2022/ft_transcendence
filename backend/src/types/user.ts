
export type NewUserData = {
    username: string
	email: string
    passwordHash: string
}

export type NewUserDataGoogle = {
	email: string
    passwordHash: null
    googleId:string
    picture: string | null
    name: string | null
}



export type GoogleProfile = {
    passwordHash : null
    emailVerified : boolean
    googleId:string
    email: string
    name : string | null
    picture : string | null
};

export type GoogleProfileResponse =  Omit <GoogleProfile,
    'passwordHash' |
    'emailVerified'
>

export type User = {
    id: string;
    username: string;
    email: string;
    passwordHash: string | null;
    googleId: string | null;
    name: string | null;
    biography: string | null;
    avatarUrl: string | null;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type UserProfile = Omit<User,
    'passwordHash' |
    'googleId' |
    'email' |
    'updatedAt'
    >

export type UserCredentials = Pick<User,
    "id" | "email" | "passwordHash"
>

export type OwnProfile = UserProfile & Pick<User, 'email'>

export type UpdateUserData = {
    name?: string | null | undefined
    biography?: string | null | undefined
    avatarUrl?: string | null | undefined
}

export type UserOrderBy = 'createdAt' | 'username'
