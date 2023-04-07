import express from 'express'

import accountController from '../controllers/account.js'

const router = express.Router()

router.post('/create', accountController.createAccount)

router.post('/login', accountController.loginAccount)

router.post('/logout', accountController.logoutAccount)

router.get('/info', accountController.getInfo)

export default {
    router: router,
    path: 'account'
}