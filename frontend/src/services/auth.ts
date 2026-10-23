export type LoginData = {
    email: string;
    password: string;
}

export async function login({email, password}: LoginData)  {
    console.log("Logeando..." + email + ", " + password)
}

export type RegisterData = {
    username: string;
    email: string;
    password: string;
}

export async function register({username, email, password}: RegisterData) {
    console.log("Registering..." + username + ", " + email + ", " + password)
}