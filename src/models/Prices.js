import mongoose from 'mongoose'
const Schema = mongoose.Schema

const PricesSchema = new Schema({
    prices: {
        type: Object,
        required: true
    }
}, { timestamps: true })

const Prices = mongoose.model('Prices', PricesSchema)

export default Prices