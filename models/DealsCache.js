import mongoose from 'mongoose'
const Schema = mongoose.Schema

const DealsCacheSchema = new Schema({
    price: Number,
    name: String,
}, { timestamps: true })

export const Waxpeer = mongoose.model('WaxpeerCache', DealsCacheSchema)
