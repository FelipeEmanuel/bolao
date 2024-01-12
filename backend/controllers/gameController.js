const asyncHandler = require('express-async-handler')
const Game = require('../models/gameModel')
const Palpite = require('../models/palpiteModel')

const getGames = asyncHandler(async (req, res) => {
    const games = await Game.find()

    res.status(200).json(games)
})

const getGameById = asyncHandler(async (req, res) => {
    const game = await Game.findById(req.params.id)

    if(!game) {
        res.status(400)
        throw new Error('Game not found!')
    }

    res.status(200).json(game)

})

const setGames = asyncHandler(async (req, res) => {

    const {time1, time2, placar1, placar2, competicao, dataLimite, isocodetime1, isocodetime2, infoCamp, infoJogo, infoGroup, gameType} = req.body

    if (!time1 || !time2) {
        res.status(400)
        throw new Error('Please add a text field!')
    }

    //const game = await Palpite.create(obj)
    const game = await Game.create({
        user: req.user.id, competicao, 
        time1, time2, placar1, placar2,
        dataLimite, isocodetime1, isocodetime2, 
        infoCamp, infoJogo, infoGroup, gameType
    })

    res.status(200).json(game)
})

const updateGame = asyncHandler(async (req, res) => {
    const game = await Game.findById(req.params.id)

    if(!game) {
        res.status(400)
        throw new Error('Game not found')
    }

    const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })
    res.status(200).json(updatedGame)
})

const deleteGame = asyncHandler(async (req, res) => {

    try {
        await Palpite.deleteMany({ "jogo" : req.params.id})
    } catch (error) {
        console.log(error);
    }

    await Game.findByIdAndDelete(req.params.id, function (err, docs) {
        if (err) {
            console.log(err)
            res.status(400)
            throw new Error('Game not found')
        }
        else {
            console.log("Deleted : ", docs);
            res.status(200).json({id: req.params.id})
        }
    });
       
})

module.exports = {
    getGames, getGameById, setGames, updateGame, deleteGame
}