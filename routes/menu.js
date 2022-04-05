const express = require('express')
const app = express()
const fs = require('fs')

app.get('/menu', function(req, res)
{
    fs.readFile('../items.json', function(error, data)
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

module.exports = menu