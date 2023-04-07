import mongoose from 'mongoose'

const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    sessionId: {
        type: String,
    },
    tier: {
        type: String,
        required: true,
        default: 'Tier0'
    }
}, { timestamps: true })

export default mongoose.model('Users', UserSchema)
