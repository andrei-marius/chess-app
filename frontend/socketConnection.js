import io from 'socket.io-client'

const socket = io(`http://${process.env.IP_ADDRESS}:3000`)

socket.on('connect', () => console.log(socket.id, 'connected'))

export default socket