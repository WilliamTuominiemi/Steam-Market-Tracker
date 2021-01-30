const BitSkins = require('bitskins-api');
const bitskins = new BitSkins("80e4a51c-91a9-4160-ad8b-4d081e146f5b", "GP3JZ7NBAKDGKF7X");

const dotenv = require('dotenv')

const connectDB = require('./config/db')
dotenv.config({ path: './config/config.env' })

const Item = require('./models/item')

connectDB()

// Get item price
bitskins.getMarketData({
    names: ['AK-47 | Redline (Field-Tested)']
}) .then((res) => {
    let d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    let date = [day, month, year].join('-');

    let body = {
        Name: res.data.items[0].market_hash_name.toString(),
        Price: res.data.items[0].lowest_price.toString(),
        Date: date.toString(),
    }
    
    const item = new Item(body)

    console.log(item)

	item
		.save()
		.then((result) => {
			console.log(result)
		})
		.catch((err) => {
			console.log(err)
    })
    
})

// Get account balance
bitskins.getAccountBalance()
    .then((data) => {
        //console.log(data)
    })
    .catch((error) => {
        // this will the response from the Bitskins API call if the actual
        // request was successful, or it will be the error from the `request`
        // module if the actual request failed.
});
