const mongoose = require('mongoose')

const timesSchema = mongoose.Schema({
    nome: {type: String, required: true, unique: true},
    escudo: {type: String, default: "", required: false},
    categoria: {type: String, required: true},
    ativo: {type: Boolean, default: true},
},
{
    timestamps: true
})

module.exports = mongoose.model('Times', timesSchema)