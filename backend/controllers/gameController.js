const asyncHandler = require('express-async-handler')
const Game = require('../models/gameModel')
const Palpite = require('../models/palpiteModel')
const Times = require('../models/timesModel')
const Competicao = require('../models/competicaoModel')
const { getCompeticoesPorCategoria } = require('./competicaoController')

const getGamesPorCategoria = async (categoria, ativo = null, semanal = null, dataInicio = null, dataFim = null) => {
    // Constrói o filtro match dinamicamente
    const match = {
        'campeonato.categoria': categoria
    };

    if (ativo !== null) {
        match.ativo = ativo;
    }

    if (semanal !== null) {
        match.semanal = semanal;
    }

    if (dataInicio !== null && dataFim !== null) {
        match.dataLimite = { $gte: dataInicio, $lte: dataFim };
    }

    return await Game.aggregate([
        {
            $lookup: {
                from: 'competicaos', // nome da coleção de competições
                localField: 'competicao',
                foreignField: '_id',
                as: 'competicao'
            }
        },
        {
            $unwind: '$competicao'
        },
        {
            $lookup: {
                from: 'campeonatos', // nome da coleção de campeonatos
                localField: 'competicao.campeonato',
                foreignField: '_id',
                as: 'campeonato'
            }
        },
        {
            $unwind: '$campeonato'
        },
        {
            $match: match // Aplica o filtro construído dinamicamente
        },
        {
            $sort: {
                'createdAt': -1
            }
        },
        {
            $limit: 100
        }
    ]);
};

const getGames = asyncHandler(async (req, res) => {
    //const gamesFutebol = await Game.find({categoria: "Futebol"}).sort({'createdAt': -1}).limit(100)
    const gamesFutebol = await getGamesPorCategoria('Futebol');

    const gamesEsports = await getGamesPorCategoria('Esports');

    const escudosFutebol = await Times.find({categoria: "Futebol", ativo: true})

    const escudosEsports = await Times.find({categoria: "Esports", ativo: true})

    const competicoesFutebol = await getCompeticoesPorCategoria('Futebol', true);

    const competicoesEsports = await getCompeticoesPorCategoria('Esports', true);

    res.status(200).json({gamesFutebol, gamesEsports, escudosFutebol, escudosEsports, competicoesFutebol, competicoesEsports})
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

    const {time1, time2, placar1, placar2, competicao, dataLimite, isocodetime1, isocodetime2, infoCamp, infoJogo, infoGroup, gameType, modelo} = req.body

    if (!time1 || !time2) {
        res.status(400)
        throw new Error('Please add a text field!')
    }

    //const game = await Palpite.create(obj)
    const game = await Game.create({
        user: req.user.id, competicao, 
        time1, time2, placar1, placar2,
        dataLimite, isocodetime1, isocodetime2, 
        infoCamp, infoJogo, infoGroup, gameType, modelo
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
        console.log("Deu erro aqui", error);
    }

    try {
        await Game.findByIdAndDelete(req.params.id)
        const games = await Game.find().sort({'createdAt': -1}).limit(100)
        res.status(200).json(games)
    } catch (error) {
        res.status(400)
        throw new Error('Game not found')
    }

    /*await Game.findByIdAndDelete(req.params.id, function (err, docs) {
        if (err) {
            console.log(err)
            res.status(400)
            throw new Error('Game not found')
        }
        else {
            console.log("Deleted : ", docs);
            res.status(200).json("Ok")
        }
    });*/
       
})

module.exports = {
    getGames, getGameById, setGames, updateGame, deleteGame, getGamesPorCategoria
}
