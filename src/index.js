const express = require('express')
const path = require('path')
const hbs = require('hbs')

const userRouter = require('./routers/user')
const articleRouter = require( './routers/article' )

require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


hbs.registerPartials(partialsPath)

app.set('view engine', 'hbs')
app.set('views', viewsPath)

app.use(express.json())
app.use(express.static(publicDirectoryPath))



app.use(userRouter)
app.use(articleRouter)

app.get('/index', (req, res) => {
    res.render('index.hbs')
})


app.listen(port, () => {
    console.log('Server poslouchá na portu ' + port)
    })
   


