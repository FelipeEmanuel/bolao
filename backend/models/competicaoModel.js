const mongoose = require('mongoose')

const CompeticaoSchema = mongoose.Schema({
    name: {type: String, required: [true, 'Please add a name']},
    ano: {type: String, required: [true, 'Please add a sigla']},
    campeonato: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Campeonato'},
    ativa: {type: Boolean, default: true},
    img: {type: String, default: "", required: false}
},{
    timestamps: true
})

module.exports = mongoose.model('Competicao', CompeticaoSchema)
