import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
    res.sendFile("views/activity.html", {root: './src'})
})

export default router