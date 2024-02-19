const asyncHandler = require('express-async-handler')
const Game = require('../models/gameModel')
const Palpite = require('../models/palpiteModel')
const User = require('../models/userModel')
const Ranking = require('../models/rankingModel')
const Campeonato = require('../models/campeonatoModel')
const Conquista = require('../models/conquistasModel')
const { getDate, parseObjectId } = require('../util/index')
const Competicao = require('../models/competicaoModel')
const Semanal = require('../models/semanalModel')

const getPartidas = asyncHandler(async (req, res) => {

    const user = await User.aggregate( [
        {
            $match:
            {
                _id: parseObjectId(req?.user?.id)
            }
        },
        {
            $lookup:
            {
                from: "palpites",
                localField: "_id",
                foreignField: "user",
                as: "palpites"
            }

        },
        { 
            $project : { 
                name: 1, 
                palpites : {
                    palpite1: 1, 
                    palpite2: 1,
                    jogo: 1  
                } 
            } 
        }
    ]);
    
    const gamesDisponiveis = await Game.find({ativo: true})
    
    const gamesTodos = await Game.find()

    let jogos = []

    user.forEach(u => {
        u.palpites.forEach(palpite => {
            /*if(palpite.jogoObj.ativo == true) {
                jogos.push(palpite)
            }*/
        })
        
    });

    res.status(200).json({ gamesDisponiveis, gamesTodos, user });
})

const setPalpite = asyncHandler(async (req, res) => {

    let palpite = req.body
    let user = req.user.id
    const getUser = true

    if(!palpite) {
        res.status(400)
        throw new Error('Please add all text fields')
    }

    const jogoDisponivel = getDate()
    let palpiteEncontrado = await Palpite.findOne({jogo: palpite.jogo_id, user: req.user.id})
    let ranking = await Ranking.findOne({user: req.user.id, competicao: palpite.competicao})
    let userInfo = await User.findById(user)
    let semanal = await Campeonato.findOne({name: 'Semanal'})
    let semanal2 = await Semanal.findOne({user: req.user.id, campeonato: semanal._id})
    let semanalCreate = {user: req.user.id, campeonato: semanal._id}
    let obj = {user: req.user.id, jogo: palpite.jogo_id, competicao: palpite.competicao, palpite1: palpite.palpite1, palpite2: palpite.palpite2} 
    let jogoAtual = await Game.findById(obj.jogo)
    let instancia = {user: req.user.id, competicao: palpite.competicao}
   
    if(jogoAtual.dataLimite >= jogoDisponivel) {
        if(palpiteEncontrado) {   
            if(user === palpiteEncontrado.user.toString()){
                await User.findByIdAndUpdate(user, {palpitou: getUser}) 
                await Palpite.findByIdAndUpdate(palpiteEncontrado.id, obj)
                if(!semanal2 && userInfo.role == 'user') {
                    await Semanal.create(semanalCreate)
                }
            } else {
                if(!ranking && userInfo.role == 'user') {
                    await Ranking.create(instancia)
                }
                if(!semanal2 && userInfo.role == 'user') {
                    await Semanal.create(semanalCreate)
                }
                await User.findByIdAndUpdate(user, {palpitou: getUser})    
                await Palpite.create(obj)
            }    
        } else {
            if(!ranking && userInfo.role === 'user') {
                await Ranking.create(instancia)  
            }
            if(!semanal2 && userInfo.role == 'user') {
                await Semanal.create(semanalCreate)
            }
            await User.findByIdAndUpdate(user, {palpitou: getUser}) 
            await Palpite.create(obj)
        }
    } else {
        res.status(400)
        throw new Error('Já passou da hora de palpitar nesse aqui parça')
    }   
    
    res.status(200).json(obj)
    
})

const getUserPalpites = asyncHandler(async (req, res) => {
    const hoje = getDate();
    const dataLimite = getDate().add(7, 'days');
    
    const gamesDisponiveis = await Game.find({dataLimite: {$gte: hoje, $lte: dataLimite}, ativo: true})
    
    const gamesTodos = await Game.find({ativo: true})

    const userPalpites = await Palpite.find({user: req.user.id}).populate('jogo')

    let palpites = []

    userPalpites.forEach(palpite => {
        if(palpite.jogo.ativo == true) {
            palpites.push(palpite)
        }
    });

    res.status(200).json({gamesDisponiveis, gamesTodos, palpites})
})


module.exports = {
    setPalpite, getPartidas, getUserPalpites
}
