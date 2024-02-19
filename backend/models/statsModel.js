const mongoose = require('mongoose')

const statsSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    pontuacaoTotal: {type: Number, default: 0},
    cravadasTotal: {type: Number, default: 0},
    jogosTotal: {type: Number, default: 0},
    campsParticipou: {type: Number, default: 0}
},
{
    timestamps: true
})

module.exports = mongoose.model('Stats', statsSchema)