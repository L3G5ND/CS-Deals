import UserModule from '../models/User.js'
import settings from '../settings.js'

const defualtUser = {
    Tier: settings.defaultTier
}

export default async (req, res, next) => {
    const sessionId = req.cookies['session-id']
    if (!sessionId) {
        req.User = defualtUser
        req.TierInfo = settings.tierInfo[settings.defaultTier]
        next()
        return
    }
    const user = await UserModule.findOne({ sessionId: sessionId })
    if (!user) {
        req.User = defualtUser
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