const BitSkins = require('bitskins-api');
const bitskins = new BitSkins("80e4a51c-91a9-4160-ad8b-4d081e146f5b", "GP3JZ7NBAKDGKF7X");

const dotenv = require('dotenv')
const express = require('express')

const connectDB = require('./config/db')
dotenv.config({ path: './config/config.env' })

const Item = require('./models/item')
const PriceNow = require('./models/price')
const Percentage = require('./models/percentage')

const app = express()

const PORT1 = process.env.PORT || 3000

const bodyParser = require('body-parser')

app.set('view engine', 'ejs')

connectDB()

const checkInterval = 900000

const get_data = () => {
    // Get item price
    bitskins.getMarketData({
        names: ['AK-47 | Baroque Purple (Field-Tested)']
    }) 
    .then((res) => {
        let body = {
            Name: res.data.items[0].market_hash_name.toString(),
            Price: res.data.items[0].lowest_price.toString()
        }
            
        const item = new Item(body)

        item
            .save()
            .then((result) => {
                console.log(result)
            })
            .catch((err) => {
                console.log(err)
        })

        Item.find()
        .then((result) => {
            result.forEach(item_obj =>{
                const d1 = item_obj.createdAt.getTime();
                const d2 = new Date().getTime();
                const diff = d2 - d1;
                const days = diff/(1000*60*60*24);
                //console.log("days" + days)
                /*if(days > 2)	{
                    Item.find( {_id: item_obj._id} )
                    .remove()
                    .then((result1) => {
                        console.log("deleted" + days)
                    })
                    .catch((err) => {
                        console.log(err)
                    })			
                }*/
            })
        }) 
        setTimeout(get_data, 3600000);
    })
}

const display_price = () => {
    bitskins.getMarketData({ names: ['AK-47 | Baroque Purple (Field-Tested)'] }) 
    .then((res) => {       
        let body = {
            Price: res.data.items[0].lowest_price.toString(),
        }

        const price_db = new PriceNow(body)

        PriceNow.find()
        .then((result) => {
            result.forEach(element => {
                const newPrice = res.data.items[0].lowest_price.toString()
                const id = element._id.toString() 
                PriceNow.updateOne({ _id: id }, { Price: newPrice }, function(err, res) {
                    //console.log("Price updated")
                    setTimeout(display_price, checkInterval);
                });               
            })
        })
    })
}

const calculate_percentage = (priceNow, priceAverage) => {
    let percentage = ((priceAverage/priceNow)*100 )-100
    return percentage.toFixed(2)
}

const check_value_change = () => {
    PriceNow.find()
    .then((result) => {
        Item.find()
        .then((items) => {
            let index = 0;
            let total = 0.00;

            items.forEach(item => {
                total = total + parseFloat(item.Price)
                index = index + 1
                
            })

            let average = total/index
            let now = result[0].Price
            let percentage = calculate_percentage(average, now)

            const percentageText = percentage + "%"

            Percentage.find()
            .then((result) => {
                result.forEach(element => {
                    const percentageText = percentage + "%"
                    const id = element._id.toString() 
                    Percentage.updateOne({ _id: id }, { Percentage: percentageText }, {upsert: true}, function(err, res) {
                        console.log("Percentage updated")
                        setTimeout(check_value_change, checkInterval);
                    });               
                })
            })
        })
    })
}


get_data()

display_price()

check_value_change()

app.get('/', (req, res) => {
    Item.find()
    .then((result) => {
        PriceNow.find()
        .then((result1) => {
            Percentage.find()
            .then((result2) => {
                res.render('index', {items: result, price: result1, percentage: result2})
            })
        })

    })
    .catch((err) => {
        console.log(err)
    })
})
   
app.listen(3000, () => {
    console.log('listening on port 3000')
})