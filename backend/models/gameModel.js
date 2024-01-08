const mongoose = require('mongoose')

const gameSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    time1: {type:String, required: [true, 'Informe o nome do primeiro time']},
    time2: {type:String, required: [true, 'Informe o nome do segundo time']},
    placar1: {type:String, default: ''},
    placar2: {type:String, default: ''},
    dataLimite: {type:Date, required: true},
    isocodetime1: {type:String, required: true},
    isocodetime2: {type:String, required: true},
    infoCamp: {type: String, required: true},
    infoJogo: {type:String, required: true},
    infoGroup: {type:String, required: true},
    gameType: {type: Number, required: true}
},{
    timestamps: true
})

module.exports = mongoose.model('Game', gameSchema)