import {Server as Socket} from "socket.io"

let io
const sockets = {}

export default {

    init(server) {
        io = new Socket(server, {
            path: '/item-socket',
            cors: {
                origin: '*'
            }
        })
        
        io.on('connection', (socket) => {
            console.log(socket.id)
            sockets[socket.id] = socket
        })
    },

    addItem(info) {
        for (const key in sockets) {
            sockets[key].emit('item-added', info)
        }
        return
    },

    addDeal(info) {
        for (const key in sockets) {
            sockets[key].emit('deal-added', info)
        }
        return
    }

}