import {Server as Socket} from "socket.io"
import UserModule from '../models/User.js'
import Item from './modules/Item.js'
import settings from "../settings.js"

let io
const sockets = {}

function getCookies(cookieStr) {
    let cookies = {}
    cookieStr.split(/\s*;\s*/).forEach((pair) => {
        pair = pair.split(/\s*=\s*/)
        cookies[pair[0]] = pair.splice(1).join('=')
    })
    return cookies
}

export default {

    init(context) {
        io = new Socket(context.server, {
            path: '/item-socket',
            cors: {
                origin: '*'
            }
        })
        
        io.on('connection', async (socket) => {
            const cookies = getCookies(socket.request.headers.cookie)
            let user = await UserModule.findOne({ sessionId: cookies['session-id'] })
            if (!user) {
                user = settings.defualtUser
            } else {
                user = {
                    tier: user.tier
                }
            }
            socket.user = user
            socket.tierInfo = settings.tierInfo[user.tier]
            sockets[socket.id] = socket
        })
    },

    addItem(item) {
        for (const key in sockets) {
            const socket = sockets[key]
            if (Item.getItemDeal(item) <= socket.tierInfo.maxDeals) {
                sockets[key].emit('item-added', item)
            }
        }
        return
    },

    addDeal(item) {
        for (const key in sockets) {
            const socket = sockets[key]
            if (Item.getItemDeal(item) <= socket.tierInfo.maxDeals) {
                sockets[key].emit('deal-added', item)
            }
        }
        return
    }

}