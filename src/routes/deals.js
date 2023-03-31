import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
    res.sendFile("views/deals.html", {root: './src'})
})

export default router