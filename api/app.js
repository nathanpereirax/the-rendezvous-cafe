const app = require('express')()

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

module.exports = app
