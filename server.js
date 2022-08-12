if(process.env.NODE_ENV !== 'production')
{
		require('dotenv').config()
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

const admin = process.env.admin
const adminPass = process.env.adminPass

const express = require('express')
const app = express()
const fs = require('fs')
const stripe = require('stripe')(stripeSecretKey)

const mysql = require('mysql2')
var con = mysql.createConnection({
					host: process.env.host,
					user: process.env.user,
					password: process.env.password,
					database: process.env.database
				});

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))

module.exports = app

app.get('/menu', function(req, res)
{
	fs.readFile('items.json', function(error, data)
	{
		if(error)
		{
			res.status(500).end()
		}
		else
		{
			res.render('menu.ejs',
			{
				stripePublicKey: stripePublicKey,
				items: JSON.parse(data)
			})
		}
	})
})

app.get('/login', function(req, res)
{
	res.render('login.ejs', {
		user: admin,
		pass: adminPass
	})
})

app.get('/admin', function(req, res)
{
	con.connect(function(err)
	{
		if (err) {
			throw err;
			res.render('admin.ejs', {data: ''})
		}
  		con.query("SELECT * FROM orderList", function (err, result, fields)
		{
    		if (err) throw err;
			res.render('admin.ejs', {data: result})
		});
	});
})

app.post('/purchase', function(req, res)
{
		fs.readFile('items.json', function(error, data)
		{
				if(error)
				{
						res.status(500).end()
				}
				else
				{
						const itemsJson = JSON.parse(data)
						const itemsArray = itemsJson.storeItems
						let total = 0
						let i=0
						req.body.items.forEach(function(item) {
								const itemJson = itemsArray.filter(function(i) {
										return (i.id == item.id)
								})
								total = total + (itemJson[0].price * parseInt(item.quantity))
								var a = req.body.uid
								var b = itemJson[0].name
								var c = item.quantity
								var d = (itemJson[0].price * parseInt(item.quantity))
								con.connect(function(err) {
  									if (err) throw err;
  									console.log("Database Connected!");
  									var sql = "INSERT INTO orderList (Userid, Item, Quantity, Total) VALUES ('"+a+"', '"+b+"', '"+c+"', '"+d+"')";
  									con.query(sql, function (err, result) {
    									if (err) throw err;
    									console.log("1 record inserted, ID: " + result.insertId);
  									});
								});
						})
						total = total * 100
						const paymentIntent = stripe.paymentIntents.create({
								amount: total,
								currency: 'inr',
								automatic_payment_methods: {
										enabled: true,
								},
								receipt_email: req.body.uid
						}).then(function() {
								console.log('Charge successful')
						}).catch(function(error) {
								console.log(error)
								console.log('Charge failed')
								res.status(500).end()
						})
						res.send({
								clientSecret: paymentIntent.client_secret,
						});
				}
		})
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));