
import { initSocket } from "../socket.ts"
import http from 'node:http'

const server = http.createServer((req, res) => {
    res.end()
})

initSocket(server)

server.listen(4242, 'localhost', () => {
    console.log('test server running')
})
