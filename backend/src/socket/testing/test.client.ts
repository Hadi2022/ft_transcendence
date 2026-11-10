
import { io } from 'socket.io-client';   // npm i -D socket.io-client

const socket = io('https://localhost', {
    path: '/api/socket.io',
    rejectUnauthorized: false,
})

socket.connect()

socket.on('status', (message: string) => {
    console.log(message)
})

//socket.disconnect()