const mongoose = require('mongoose')

const ConquistaSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    campeonato: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Campeonato'},
    primeiro: {type: Number, default: 0},
    primeiroAnos: {type: Array, default: []},
    segundo: {type: Number, default: 0},
    segundoAnos: {type: Array, default: []},
    terceiro: {type: Number, default: 0},
    terceiroAnos: {type: Array, default: []}
},
{
    timestamps: true
})

module.exports = mongoose.model('Conquista', ConquistaSchema)