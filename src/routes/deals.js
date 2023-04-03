import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
    res.render("deals")
})

export default {
    router: router,
    path: 'deals'
}