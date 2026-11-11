
import { io } from 'socket.io-client';   // npm i -D socket.io-client

const token = '13d422fcdf93fcfcee1b0d1c9603d0808d9e2a73bf2282928198cb4212321955'

const socket = io('https://localhost', {
    path: '/api/socket.io',
    rejectUnauthorized: false,
    extraHeaders: {
        Cookie: `sessionID=${token}`
    }
})

socket.connect()

socket.on('status', (message: string) => {
    console.log(message)
})

//socket.disconnect()