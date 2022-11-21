const asyncHandler = require('express-async-handler')
const Game = require('../models/gameModel')
const Palpite = require('../models/palpiteModel')
const { getDate } = require('../util/index')

const getPartidas = asyncHandler(async (req, res) => {
    jogosDisponiveis = getDate().replace(",", "")
    const listaJogos = await Game.find({dataLimite: {$gte: jogosDisponiveis}})
    //const listaJogos = await Game.find({placar1: "x"})
    res.status(200).json(listaJogos)
})

const setPalpite = asyncHandler(async (req, res) => {

    const jogos = await Game.find()
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
    /*jogos.forEach(async (jogo) => {
        palpites.forEach(async (palpite) => {
            if(jogo.id === palpite.jogo_id) {
                let palpiteEncontrado = await Palpite.findOne({jogo: jogo._id, user: req.user.id})
                let obj = {user: req.user.id, jogo: jogo, palpite1: palpite.palpite1, palpite2: palpite.palpite2}
                if(palpiteEncontrado) {
                    if(user === palpiteEncontrado.user.toString()){
                        await Palpite.findByIdAndUpdate(palpiteEncontrado.id, obj)
                    } else {
                        await Palpite.create(obj)
                    }    
                } else {
                    await Palpite.create(obj)
                }
                
            }
        })
    })*/
    
    res.status(200).json('ok')
    
})

const getUserPalpites = asyncHandler(async (req, res) => {
    const userPalpites = await Palpite.find({user: req.user.id}).populate('jogo')

    res.status(200).json(userPalpites)
})

module.exports = {
    setPalpite, getPartidas, getUserPalpites
}