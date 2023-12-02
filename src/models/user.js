const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    trim: true
    },
    age: {
    type: Number,
    default: 0,
    validate(value) {
        if (value < 0) {
        throw new Error('Věk musí být kladné číslo!')
        }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true, 
        unique: true, 
        validate(value) {
            if (!validator.isEmail(value)) {
            throw new Error('Neplatná mailová adresa!')
            }
            }  
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('heslo')) {
                throw new Error('Heslo nesmí obsahovat "heslo"')
            }
        }
    },
    tokens: [{
        token: {
          type: String,
          required: true
        }
      }]
    })
    

    
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'Michael')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne( {email} )
    if (!user) {
        throw new Error('Přihlášení selhalo - uživatel nenalezen')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Přihlášení selhalo - údaje neodpovídají')
    }

    return user
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
    }
//přidáváme do uživatele pole tasks, do kterého načteme úlohy uživatele; tato vlastnost je virtuální
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})    

//Vykoná se těsně před vykonáním funkce remove pro daného uživatele; odstraní všechny úlohy vytvořené uživatelem
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
    })


const User = mongoose.model('User', userSchema)


module.exports = User