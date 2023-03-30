import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ItemCacheSchema = new Schema({
    info: {
        type: Object,
        required: true
    }
}, { timestamps: true })

export default {
    all: mongoose.model('AllItemCache', ItemCacheSchema),
    waxpeer: mongoose.model('WaxpeerItemCache', ItemCacheSchema),
}
