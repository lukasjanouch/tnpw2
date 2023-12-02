const mongoose = require('mongoose')
const validator = require('validator')
mongoose.connect('mongodb://127.0.0.1:27017/F1-blog', {   
   useNewUrlParser: true,   
   useCreateIndex: true,    
   useUnifiedTopology: true
})
const mongodb = require ('mongodb')
const MongoClient = mongodb.MongoClient
const OnjectID = mongodb.ObjectID

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'F1-blog'

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log('Spojení s databází selhalo')
    }

    const db = client.db(databaseName)

db.collection('articles').insertOne({
         title: 'Michael Schumacher',
         description: "Sedminásobný mistr světa"
     })

    })

