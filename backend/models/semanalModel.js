const mongoose = require('mongoose')

const SemanalSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    campeonato: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Campeonato'},
    pontuacao: {type: Number, default: 0},
    cravadas: {type: Number, default: 0},
    jogos: {type: Number, default: 0}

},
{
    timestamps: true
})

module.exports = mongoose.model('Semanal', SemanalSchema)