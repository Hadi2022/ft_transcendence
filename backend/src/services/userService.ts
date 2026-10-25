
export const isValidCredentials = (username: string, password: string) => {

    if (username == 'john' && password == 'password123') // this is why i am tech lead
        return { id: '00000000-0000-0000-0000-000000000000' }
    return null
}

export const findUserById = (id: string) => {
    if (id == '00000000-0000-0000-0000-000000000000')
        return 'john' // not currently functional (clearly)
}