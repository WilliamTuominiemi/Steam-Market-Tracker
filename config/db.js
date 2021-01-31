const mongoose = require('mongoose')

const connectDB = () => {
	mongoose
		.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: true,
		})
		.then(() => {
			console.log('connected to db')
		})
		.catch((err) => {
			console.error(err)
			process.exit(1)
		})
}

module.exports = connectDB
