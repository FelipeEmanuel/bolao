const asyncHandler = require('express-async-handler')
const Conquistas = require('../models/conquistasModel')
const Campeonato = require('../models/campeonatoModel')
const Stats = require('../models/statsModel')
const { parseObjectId } = require('../util/index')

const getConquistas = asyncHandler(async (req, res) => {

    const semanal = await Campeonato.findOne({name: 'Semanal'})

    const userConquistas = await Conquistas.find({user: req?.user?.id, campeonato: {$ne: semanal._id}}).populate('campeonato')

    const userSemanais = await Conquistas.find({user: req?.user?.id, campeonato: semanal._id})

    const userStats = await Stats.find({user: req?.user?.id})

    res.status(200).json({userConquistas, userSemanais, userStats})

})

const getConquistasById = asyncHandler(async (req, res) => {

    const semanal = await Campeonato.findOne({name: 'Semanal'})

    const userConquistas = await Conquistas.find({user: req.params.id, campeonato: {$ne: semanal._id}}).populate('campeonato')

    const userSemanais = await Conquistas.find({user: req.params.id, campeonato: semanal._id})

    const userStats = await Stats.find({user: req.params.id})

    res.status(200).json({ userConquistas, userSemanais, userStats})

})


module.exports = {
    getConquistas, getConquistasById,
}