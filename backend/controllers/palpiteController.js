const asyncHandler = require('express-async-handler')
const Game = require('../models/gameModel')
const Palpite = require('../models/palpiteModel')
const { getDate } = require('../util/index')
const moment = require('moment-timezone');

const getPartidas = asyncHandler(async (req, res) => {

    const jogosDisponiveis = getDate()
    console.log(moment().add(24, 'hours').toDate().getTime())
    console.log(moment().toDate().getTime())
    
    const listaJogos = await Game.find({dataLimite: {$gte: jogosDisponiveis}})
    res.status(200).json(listaJogos)
})

const setPalpite = asyncHandler(async (req, res) => {

    let palpite = req.body
    let user = req.user.id

    if(!palpite) {
        res.status(400)
        throw new Error('Please add all text fields')
    }   

    let palpiteEncontrado = await Palpite.findOne({jogo: palpite.jogo_id, user: req.user.id})
    let obj = {user: req.user.id, jogo: palpite.jogo_id, palpite1: palpite.palpite1, palpite2: palpite.palpite2}
    if(palpiteEncontrado) {   
        if(user === palpiteEncontrado.user.toString()){ 
            await Palpite.findByIdAndUpdate(palpiteEncontrado.id, obj)
        } else {    
            await Palpite.create(obj)
        }    
    } else { 
        await Palpite.create(obj)
    }
    
    res.status(200).json('ok')
    
})

const getUserPalpites = asyncHandler(async (req, res) => {
    const userPalpites = await Palpite.find({user: req.user.id}).populate('jogo')

    res.status(200).json(userPalpites)
})

module.exports = {
    setPalpite, getPartidas, getUserPalpites
}