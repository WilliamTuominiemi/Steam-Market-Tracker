const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ItemSchema = new Schema({
	Name: {
        type: String,
        required: true
    },
    Price: {
        type: String,
        required: true
    }
    }, 	{ timestamps: true }
)

module.exports = mongoose.model('Item', ItemSchema)