import express from 'express'

import item from '../js/Item.js'

const router = express.Router()

router.get('/item-cache', async (req, res) => {
    if (!req.query.market) {
        req.query.market = 'all'
    }
    res.json(await item.getItems(req.query.market))
})

export default router