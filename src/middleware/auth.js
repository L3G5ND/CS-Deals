import UserModule from '../models/User.js'
import settings from '../settings.js'

export default async (req, res, next) => {
    const sessionId = req.cookies['session-id']
    if (!sessionId) {
        req.User = settings.defualtUser
        req.TierInfo = settings.tierInfo[settings.defaultTier]
        next()
        return
    }
    const user = await UserModule.findOne({ sessionId: sessionId })
    if (!user) {
        req.User = settings.defualtUser
        req.TierInfo = settings.tierInfo[settings.defaultTier]
        next()
        return
    }
    req.User = user
    req.TierInfo = settings.tierInfo[user.tier]
    if (!req.TierInfo) {
        req.TierInfo = settings.tierInfo[settings.defaultTier]
    }
    next()
    return
}