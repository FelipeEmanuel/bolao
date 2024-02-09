const mongoose = require('mongoose')

const CampeonatoSchema = mongoose.Schema({
    name: {type: String, required: [true, 'Please add a name']},
    sigla: {type: String, required: [true, 'Please add a sigla']},
},{
    timestamps: true
})

module.exports = mongoose.model('Campeonato', CampeonatoSchema)