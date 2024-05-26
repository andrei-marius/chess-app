import io from 'socket.io-client'

const socket = io(`http://${process.env.IP_ADDRESS}:${process.env.SERVER_PORT}`)

socket.on('connect', () => console.log(socket.id, 'connected'))

export default socket