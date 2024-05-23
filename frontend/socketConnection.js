import io from 'socket.io-client'

const socket = io('http://192.168.0.19:3000')

socket.on('connect', () => console.log(socket.id, 'connected'))

export default socket