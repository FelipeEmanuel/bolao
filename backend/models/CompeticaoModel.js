const mongoose = require('mongoose')

const CompeticaoSchema = mongoose.Schema({
    name: {type: String, required: [true, 'Please add a name']},
    sigla: {type: String, required: [true, 'Please add a sigla']},
    ativa: {type: Boolean, default: true},
    img: {type: String, default: "", required: false}
},{
    timestamps: true
})

module.exports = mongoose.model('Competicao', CompeticaoSchema)