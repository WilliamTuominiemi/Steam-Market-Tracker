const BitSkins = require('bitskins-api');
const bitskins = new BitSkins("80e4a51c-91a9-4160-ad8b-4d081e146f5b", "GP3JZ7NBAKDGKF7X");

const dotenv = require('dotenv')
const express = require('express')

const connectDB = require('./config/db')
dotenv.config({ path: './config/config.env' })

const Item = require('./models/item')
const PriceNow = require('./models/price')

const app = express()

const PORT1 = process.env.PORT || 3000

const bodyParser = require('body-parser')

app.set('view engine', 'ejs')

connectDB()

const get_data = () => {
    // Get item price
    bitskins.getMarketData({
        names: ['AK-47 | Baroque Purple (Field-Tested)']
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

        console.log(res.data.items[0])

        let body = {
            Name: res.data.items[0].market_hash_name.toString(),
            Price: res.data.items[0].lowest_price.toString(),
            Date: date.toString(),
        }
        
        const item = new Item(body)

        /*item
            .save()
            .then((result) => {
                console.log(result)
            })
            .catch((err) => {
                console.log(err)
        })*/

        Item.find()
        .then((result) => {
            result.forEach(item_obj =>{
                const d1 = item_obj.createdAt.getTime();
                const d2 = new Date().getTime();
                const diff = d2 - d1;
                const days = diff/(1000*60*60*24);
                console.log("days" + days)
                if(days > 2)	{
                    Item.find( {_id: item_obj._id} )
                    .remove()
                    .then((result1) => {
                        console.log("deleted" + days)
                    })
                    .catch((err) => {
                        console.log(err)
                    })			
                }
            } )
        })
        setTimeout(get_data, 3600000);
    })
}

const display_price = () => {
    bitskins.getMarketData({
        names: ['AK-47 | Baroque Purple (Field-Tested)']
    }) .then((res) => {
        
        let body = {
            Price: res.data.items[0].lowest_price.toString(),
        }

        const price_db = new PriceNow(body)

       PriceNow.find()
        .then((result) => {
            if(result != null)
            {
                const d1 = result[0].createdAt.getTime();
                const d2 = new Date().getTime();
                const diff = d2 - d1;
                const days = diff/(500*60*60*24);
                console.log("days price" + days)
                if(days > 1)	{
                    Item.find( {_id: result[0]._id} )
                    .remove()
                    .then((result1) => {
                        console.log("deleted" + days)
                        price_db
                        .save()
                        .then((result2) => {
                            console.log(result2)
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                    })			
                }
            }
            
            } )
    })

       /* */

        //setTimeout(get_data, 3600000);
}

get_data()

display_price()


app.get('/', (req, res) => {
    Item.find()
    .sort({ createdAt: -1 })
    .then((result) => {
        //console.log(result)
        res.render('index', {items: result})

    })
    .catch((err) => {
        console.log(err)
    })
})
   
app.listen(3000, () => {
    console.log('listening on port 3000')
})