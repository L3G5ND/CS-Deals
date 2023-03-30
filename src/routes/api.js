import fs from 'fs'
import express from 'express'

import ItemCache from '../js/ItemCache.js'

const router = express.Router()

router.get('/item-cache', async (req, res) => {
    if (!req.query.market) {
        req.query.market = 'all'
    }
    const cache = await ItemCache.getCache(req.query.market)
    res.json(cache)
})

export default router