const mongoose = require('mongoose')

const CampeonatoSchema = mongoose.Schema({
    name: {type: String, required: [true, 'Please add a name']},
    sigla: {type: String, required: [true, 'Please add a sigla']},
    categoria: {type: String, required: true},
    cor: {type: String, default: "#fff"}
},{
    timestamps: true
})

module.exports = mongoose.model('Campeonato', CampeonatoSchema)
