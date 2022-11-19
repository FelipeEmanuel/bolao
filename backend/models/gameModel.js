const mongoose = require('mongoose')

const gameSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    time1: {type:String, required: [true, 'Informe o nome do primeiro time']},
    time2: {type:String, required: [true, 'Informe o nome do segundo time']},
    placar1: {type:String, default: 'x'},
    placar2: {type:String, default: 'x'},
    dataLimite: {type:Date, required: true}
},{
    timestamps: true
})

module.exports = mongoose.model('Game', gameSchema)