const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PriceSchema = new Schema({
	Price: {
        type: String,
        required: true
    },
    }, 	{ timestamps: true }
)

module.exports = mongoose.model('Price', PriceSchema)