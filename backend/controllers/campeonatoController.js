const asyncHandler = require('express-async-handler')
const Campeonato = require('../models/campeonatoModel')

const getCampeonatos = asyncHandler(async (req, res) => {
    const campeonatos = await Campeonato.find()

    res.status(200).json(campeonatos)
})

const setCampeonato = asyncHandler(async (req, res) => {
    const {name, sigla} = req.body

    if (!name || !sigla) {
        res.status(400)
        throw new Error('Please add a text field!')
    }

    await Campeonato.create({
        name, sigla
    })

    const campeonatos = await Campeonato.find()

    res.status(200).json(campeonatos)
})

module.exports = {
    getCampeonatos, setCampeonato
}