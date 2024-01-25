const mongoose = require('mongoose')

const rankingSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    competicao: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Competicao'},
    pontuacao: {type: Number, default: 0},
    cravadas: {type: Number, default: 0},
},{
    timestamps: true
})

module.exports = mongoose.model('Ranking', rankingSchema)