const mongoose = require('mongoose')

const gameSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    competicao: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Competicao'},
    time1: {type:String, required: [true, 'Informe o nome do primeiro time']},
    time2: {type:String, required: [true, 'Informe o nome do segundo time']},
    placar1: {type:String, default: ''},
    placar2: {type:String, default: ''},
    dataLimite: {type:Date, required: true},
    isocodetime1: {type:String, required: false},
    isocodetime2: {type:String, required: false},
    infoCamp: {type: String, required: true},
    infoJogo: {type:String, required: true},
    infoGroup: {type:String, required: true},
    gameType: {type: Number, required: true},
    ativo: {type: Boolean, default: false}
},{
    timestamps: true
})

module.exports = mongoose.model('Game', gameSchema)