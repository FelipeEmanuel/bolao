const asyncHandler = require('express-async-handler')
const cron = require('node-cron')
const Game = require('../models/gameModel')
const Palpite = require('../models/palpiteModel')
const Ranking = require('../models/rankingModel')
const Semanal = require('../models/semanalModel')
const Campeonato = require('../models/campeonatoModel')
const Conquistas = require('../models/conquistasModel')

const getRanking = asyncHandler(async (req, res) => {

    let competicaoId = req.params.id
    const ranking = await Ranking.find({competicao: competicaoId}).populate("user", "name imgPerfil").sort({pontuacao: -1, cravadas: -1})

    res.status(200).json(ranking);

})

const getRankingSemanal = asyncHandler(async (req, res) => {

    const { page = 1, limit = 20, categoria } = req.query;
    const skip = (page - 1) * limit;

    // Buscar o ranking com a categoria desejada
    const ranking = await Semanal.find()
        .populate({
            path: 'campeonato',
            match: { categoria }
        })
        .populate('user', 'name imgPerfil')
        .sort({ pontuacao: -1, cravadas: -1, jogos: 1 }) // Ordenar por pontuação, cravadas e palpites
        .exec();

    // Filtra os campeonatos que correspondem à categoria
    const filteredRanking = ranking.filter(semanal => semanal.campeonato !== null);

    // Calcular posições com empates
    let lastRank = 1;
    let lastItem = null;
    const result = filteredRanking.map((item, index, array) => {
        let rank = lastRank;

        if (
            lastItem &&
            item.pontuacao === lastItem.pontuacao &&
            item.cravadas === lastItem.cravadas &&
            item.jogos === lastItem.jogos
        ) {
            rank = lastRank; // Mesma posição para empates
        } else {
            if(rank === 1 && index === 0) {
                rank = lastRank
            } else if (rank === 1 || rank === 2) {
                rank = rank + 1;
            } else {
                rank = index + 1; // Nova posição
            }
        }   
    
        lastRank = rank; // Atualiza o último rank
        lastItem = item; // Atualiza o último item
        return { ...item.toObject(), position: rank };
    });

    // Paginar o resultado final
    const paginatedResult = result.slice(skip, skip + Number(limit));

    res.status(200).json({
        paginatedRanking: paginatedResult,
        totalItems: result.length // Total de itens antes da paginação
    });
});

async function setPontuacaoUser(user, pontuacao, cravadas, competicao, jogos) {
    try {
        await Ranking.bulkWrite( [
            { updateOne: {
                filter: { user: user, competicao: competicao},
                update: { $set: {pontuacao: pontuacao, cravadas: cravadas, jogos: jogos}}
            }}
        ])
    } catch (error) {
        console.log(error)
    }
}

const setPontuacao = asyncHandler(async (req, res) => {

    const gamesTodos = await Game.find()
    const palpitesTodos = await Palpite.find()
    const instancias = await Ranking.find()

    instancias.forEach(i => {
        let pontuacao = 0;
        let cravadas = 0;
        let jogos = 0;

        palpitesTodos.forEach(p => {
            if(i.user.toString() === p.user.toString() && i.competicao.toString() === p.competicao.toString()) {
                gamesTodos.forEach(g => {
                    if(g._id.toString() === p.jogo._id.toString() && g.competicao.toString() === p.competicao.toString()) {
                        if(g.modelo === 0) {
                            if(g.placar1 !== '' && g.placar2 !== '') {
                                if(g.placar1 === p.palpite1 && g.placar2 === p.palpite2) {
                                    if (g.gameType === 2) {
                                        pontuacao += 10;
                                        cravadas += 1;
                                        jogos += 1;
                                    } else {
                                        pontuacao += 5;
                                        cravadas += 1;
                                        jogos += 1;
                                    }
                                } else if ((p.palpite1 > p.palpite2 && g.placar1 > g.placar2) ||
                                (p.palpite1 < p.palpite2 && g.placar1 < g.placar2)) {
                                    if (g.gameType === 2) {
                                        pontuacao += 6;
                                        jogos += 1;
                                    } else {
                                        pontuacao += 3;
                                        jogos += 1;
                                    } 
                                    if (p.palpite1 === g.placar1 || p.palpite2 === g.placar2) {
                                        if(g.gameType === 2) {
                                            pontuacao += 2;
                                        } else {
                                            pontuacao += 1;
                                        }            
                                    } 
                                } else if (p.palpite1 === p.palpite2 && g.placar1 === g.placar2) {
                                    if (g.gameType === 2) {
                                        pontuacao += 6;
                                        jogos += 1;
                                    } else {
                                        pontuacao += 3;
                                        jogos += 1; 
                                    } 
                                } else if(p.palpite1 === g.placar1 || p.palpite2 === g.placar2) {
                                    if (g.gameType === 2) {
                                        pontuacao += 2;
                                        jogos += 1;
                                    } else {
                                        pontuacao += 1;
                                        jogos += 1;
                                    }
                                } else {
                                    pontuacao += 0;
                                    jogos += 1;
                                }
                            }
                        } else if (g.modelo === 1) {
                            if(p.palpite1 === g.placar1 && p.palpite2 === g.placar2) {
                                pontuacao += 3;
                                jogos += 1;
                            } else {
                                pontuacao += 0;
                                jogos += 1;
                            }
                        } else if (g.modelo === 3) {
                            if (p.palpite1 === g.placar1 && p.palpite2 === g.placar2) {
                                if (g.gameType === 2) {
                                    pontuacao += 10;
                                    cravadas += 1;
                                    jogos += 1;
                                } else {
                                    pontuacao += 5;
                                    cravadas += 1;
                                    jogos += 1;
                                }
                            } else if ((p.palpite1 === g.placar1 && p.palpite2 !== g.placar2) || (p.palpite1 !== g.placar1 && p.palpite2 === g.placar2)) {
                                if(g.gameType === 2) {
                                    pontuacao += 6;
                                    jogos += 1;
                                } else {
                                    pontuacao += 3;
                                    jogos += 1;
                                }
                            } else {
                                pontuacao += 0;
                                jogos += 1;
                            } 
                        } else if (g.modelo === 5) {
                            if (p.palpite1 === g.placar1 && p.palpite2 === g.placar2) {
                                if (g.gameType === 2) {
                                    pontuacao += 10;
                                    cravadas += 1;
                                    jogos += 1;
                                } else {
                                    pontuacao += 5;
                                    cravadas += 1;
                                    jogos += 1;
                                }
                            } else if ((p.palpite1 === g.placar1 && p.palpite2 !== g.placar2) || (p.palpite1 !== g.placar1 && p.palpite2 === g.placar2)) {
                                if(g.gameType === 2) {
                                    pontuacao += 6;
                                    jogos += 1;
                                } else {
                                    pontuacao += 3;
                                    jogos += 1;
                                }
                            } else {
                                pontuacao += 0;
                                jogos += 1;
                            }
                        }
                    }
                })
            }
        })
        setPontuacaoUser(i.user, pontuacao, cravadas, i.competicao, jogos)
    })

    res.status(200).json(instancias);
      
}) 

const criarRanking = asyncHandler(async (req, res) => {

    let pontuacao = 0
    let cravadas = 0
    let jogos = 0
    let userId = req.params.id
    let competicaoId = req.body

    obj = {user: userId, competicao: competicaoId.competicao, pontuacao: pontuacao, cravadas: cravadas, jogos: jogos}
    const ranking = await Ranking.create(obj)


    res.status(200).json(ranking);

})

const hallTitulos = asyncHandler(async (req, res) => {

    const { page = 1, limit = 20, categoria} = req.query;

    const skip = (page - 1) * limit;
    

    const conquistas = await Conquistas.find()
        .populate({
            path: 'campeonato',
            match: { categoria, name: 'Semanal' }
        })
        .populate('user', 'name imgPerfil')
        .sort({ primeiro: -1, segundo: -1, terceiro: -1 }) // Ordenar por pontuação, cravadas e palpites
        .exec();

    const filteredRanking = conquistas.filter(conquista => conquista.campeonato !== null);

    // Calcular posições com empates
    let lastRank = 1;
    let lastItem = null;
    const result = filteredRanking.map((item, index, array) => {
        let rank = lastRank;

        if (
            lastItem &&
            item.primeiro === lastItem.primeiro &&
            item.segundo === lastItem.segundo &&
            item.terceiro === lastItem.terceiro
        ) {
            rank = lastRank; // Mesma posição para empates
        } else {
            if(rank === 1 && index === 0) {
                rank = lastRank
            } else if (rank === 1 || rank === 2) {
                rank = rank + 1;
            } else {
                rank = index + 1; // Nova posição
            }
        }

        lastRank = rank; // Atualiza o último rank
        lastItem = item; // Atualiza o último item
        return { ...item.toObject(), position: rank };
    });

    // Paginar o resultado final
    const paginatedResult = result.slice(skip, skip + Number(limit));
    

    res.status(200).json({
        conquistas: paginatedResult,
        totalItems: result.length // Total de itens antes da paginação
    });

})

//cron.schedule("*/15 * * * *", function () {
//    const pont = setPontuacao();
//}, {
//    timezone: "America/Sao_Paulo"
//})

module.exports = {
    getRanking, setPontuacao, criarRanking, getRankingSemanal, hallTitulos
}
