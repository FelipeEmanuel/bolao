const asyncHandler = require('express-async-handler')
const Conquistas = require('../models/conquistasModel')
const Campeonato = require('../models/campeonatoModel')
const { parseObjectId } = require('../util/index')

const getConquistas = asyncHandler(async (req, res) => {

    const semanal = await Campeonato.findOne({name: 'Semanal'})

    const userConquistas = await Conquistas.find({user: req?.user?.id, campeonato: {$ne: semanal._id}}).populate('campeonato')

    res.status(200).json(userConquistas)

})

const getSemanais = asyncHandler(async (req, res) => {

    const semanal = await Campeonato.find({name: 'Semanal'})

    const userSemanais = await Conquistas.find({user: req?.user?.id, campeonato: semanal[0]._id})

    res.status(200).json(userSemanais)
})

module.exports = {
    getConquistas, getSemanais
}