const mongoose = require('mongoose')
const validator = require('validator')

const Article = mongoose.model('Article', {
    title: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
        },        
    description: {
        type: String,
        required: true,
        trim: true
    }
    })

    module.exports = Article