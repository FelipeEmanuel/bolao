const mongoose = require('mongoose')

const palpiteSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    jogo: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Game'},
    competicao: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Competicao'},
    palpite1: {type:String, required: [true, 'Informe o numero de gols do primeiro time']},
    palpite2: {type:String, required: [true, 'Informe o numero de gols do segundo time']},
},{
    timestamps: true
})

module.exports = mongoose.model('Palpite', palpiteSchema)