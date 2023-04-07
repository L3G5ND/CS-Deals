import crypto from 'crypto'
import bcrypt from 'bcrypt'
import emailValidator from 'email-validator';

import UserModule from '../models/User.js'
import settings from '../settings.js'

export default {

    async createAccount(req, res) {
        let { email, password } = req.body
        email = email.toLowerCase()

        let hashedPassword
        try {
            hashedPassword = await bcrypt.hash(password, 10)
        } catch {
            res.status(500)
            res.json({
                success: false,
                message: 'Internal error'
            })
            return
        }

        if (!email || !password) {
            res.status(401)
            res.json({
                success: false,
                message: 'Requires an email and password'
            })
            return
        }
        const isValidEmail = emailValidator.validate(email)
        if (!isValidEmail) {
            res.status(401)
            res.json({
                success: false,
                message: 'Invalid email'
            })
            return
        }
        if (password.length < 5) {
            res.status(401)
            res.json({
                success: false,
                message: 'Password must be at least 5 characters long'
            })
            return
        }

        const sessionId = crypto.randomUUID()
        
        const user = new UserModule({
            email: email,
            password: hashedPassword,
            sessionId: sessionId,
        })
        user.save()

        res.cookie('session-id', sessionId)
        res.json({
            success: true,
            message: 'Successfully created an account'
        })
        return
    },

    async loginAccount(req, res) {
        let { email, password } = req.body
        email = email.toLowerCase()

        if (!email || !password) {
            res.status(401)
            res.json({
                success: false,
                message: 'Requires an email and password'
            })
            return
        }
        const user = await UserModule.findOne({
            email: email
        })
        if (!user) {
            res.status(401)
            res.json({
                success: false,
                message: 'Invalid credentials'
            })
            return
        }

        try {
            const validPassword = await bcrypt.compare(password, user.password)
            if (!validPassword) {
                res.status(401)
                res.json({
                    success: false,
                    message: 'Invalid credentials'
                })
                return
            }
        } catch {
            res.status(500)
            res.json({
                success: false,
                message: 'Internal error'
            })
            return
        }

        const sessionId = crypto.randomUUID()

        user.sessionId = sessionId
        user.save()

        res.cookie('session-id', sessionId)
        res.json({
            success: true,
            message: 'Successfully logged in'
        })
        return
    },

    async logoutAccount(req, res) {
        const sessionId = req.cookies['session-id']
        if (!sessionId) {
            res.status(401)
            res.json({
                success: false,
                message: 'Already logged out'
            })
            return
        }

        const user = await UserModule.findOne({ sessionId: sessionId })
        if (!user) {
            res.status(401)
            res.json({
                success: false,
                message: 'Invalid credentials'
            })
            return
        }

        user.sessionId = null
        user.save()

        res.cookie('session-id', '')
        res.json({
            success: true,
            message: 'Successfully logged out'
        })
        return
    },

    async getInfo(req, res) {
        const sessionId = req.cookies['session-id']
        if (!sessionId) {
            res.json({
                success: true,
                data: {
                    loggedIn: false,
                    tier: settings.defaultTier
                }
            })
            return
        }

        const user = await UserModule.findOne({ sessionId: sessionId })
        if (!user) {
            res.json({
                success: true,
                data: {
                    loggedIn: false,
                    tier: settings.defaultTier
                }
            })
            return
        }

        res.json({
            success: true,
            data: {
                loggedIn: true,
                email: user.email,
                tier: user.tier
            }
        })
        return
    }

}
