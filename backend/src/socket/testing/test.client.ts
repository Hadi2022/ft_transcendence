
import { io } from 'socket.io-client';   // npm i -D socket.io-client

const socket = io('http://localhost:3000');

socket.connect()

socket.on('status', (message: string) => {
    console.log(message)
})

//socket.disconnect()