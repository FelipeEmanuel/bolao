const asyncHandler = require('express-async-handler')
const Campeonato = require('../models/campeonatoModel')

const getCampeonatos = asyncHandler(async (req, res) => {
    const campeonatosFutebol = await Campeonato.find({categoria: 'Futebol'})

    const campeonatosEsports = await Campeonato.find({categoria: 'Esports'})

    res.status(200).json({campeonatosFutebol, campeonatosEsports})
})

const setCampeonato = asyncHandler(async (req, res) => {
    const {name, sigla, categoria, cor} = req.body

    if (!name || !sigla || !categoria) {
        res.status(400)
        throw new Error('Please add a text field!')
    }

    await Campeonato.create({
        name, sigla, categoria, cor
    })

    const campeonatos = await Campeonato.find()

    res.status(200).json(campeonatos)
})

module.exports = {
    getCampeonatos, setCampeonato
}
