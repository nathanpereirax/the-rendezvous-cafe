if(process.env.NODE_ENV !== 'production')
{
    require('dotenv').config()
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

console.log(stripeSecretKey)
console.log(stripePublicKey)

const express = require('express')
const app = express()
const fs = require('fs')
const stripe = require('stripe')(stripeSecretKey)

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))   

// app.get('/menu', function(req, res)
// {
//     fs.readFile('items.json', function(error, data)
//     {
//         if(error)
//         {
//             res.status(500).end()
//         }
//         else
//         {
//             res.render('menu.ejs',
//             {
//                 stripePublicKey: stripePublicKey,
//                 items: JSON.parse(data)
//             })
//         }
//     })
// })

// app.post('/purchase', function(req, res)
// {
//     fs.readFile('items.json', function(error, data)
//     {
//         if(error)
//         {
//             res.status(500).end()
//         }
//         else
//         {
//             const itemsJson = JSON.parse(data)
//             const itemsArray = itemsJson.storeItems
//             let total = 0
//             req.body.items.forEach(function(item) {
//                 const itemJson = itemsArray.filter(function(i) {
//                     return (i.id == item.id)
//                 })
//                 total = total + (itemJson[0].price * parseInt(item.quantity))
//             })
//             total = total * 100
            
//             const paymentIntent = stripe.paymentIntents.create({
//                 amount: total,
//                 // source: req.body.stripeTokenId,
//                 currency: 'inr',
//                 automatic_payment_methods: {
//                     enabled: true,
//                 }
//             }).then(function() {
//                 console.log('Charge successful')
//             }).catch(function(error) {
//                 console.log(error)
//                 console.log('Charge failed')
//                 res.status(500).end()
//             })
//             res.send({
//                 clientSecret: paymentIntent.client_secret,
//             });
//         }
//     })
// })

app.listen(3000)

module.exports = app