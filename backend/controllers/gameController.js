const asyncHandler = require('express-async-handler')
const Game = require('../models/gameModel')

const getGames = asyncHandler(async (req, res) => {
    const games = await Game.find()

    res.status(200).json(games)
})

const setGames = asyncHandler(async (req, res) => {
    const {time1, time2, dataLimite, isocodetime1, isocodetime2, infoJogo, infoGroup, gameType} = req.body

    if (!time1 || !time2) {
        res.status(400)
        throw new Error('Please add a text field')
    }

    const game = await Game.create({
        user: req.user.id, time1, time2, 
        dataLimite, isocodetime1, isocodetime2, 
        infoJogo, infoGroup, gameType
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
    const game = await Game.findById(req.params.id)

    if(!game) {
        res.status(400)
        throw new Error('Game not found')
    }

    await Game.remove()
    res.status(200).json({id: req.params.id})
})

module.exports = {
    getGames, setGames, updateGame, deleteGame
}