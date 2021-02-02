const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PercentageSchema = new Schema({
	Percentage: {
        type: String,
        required: true
    },
    }, 	{ timestamps: true }
)

module.exports = mongoose.model('Percentage', PercentageSchema)