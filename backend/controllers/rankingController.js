const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Game = require('../models/gameModel')
const Palpite = require('../models/palpiteModel')
const Ranking = require('../models/rankingModel')

const getRanking = asyncHandler(async (req, res) => {

    let competicaoId = req.params.id
    const ranking = await Ranking.find({competicao: competicaoId}).populate("user", "name imgPerfil").sort({pontuacao: -1, cravadas: -1})


    res.status(200).json(ranking);

})

async function setPontuacaoUser(user, pontuacao, cravadas, competicao, jogos) {
    
    try {
        let usuario = user
        let pontuacao2 = pontuacao;
        let cravadas2 = cravadas;
        let competicaoId = competicao;
        let jogos2 = jogos;
        
        await Ranking.bulkWrite( [
            { updateOne: {
                filter: { user: usuario, competicao: competicaoId},
                update: { $set: {pontuacao: pontuacao2, cravadas: cravadas2, jogos: jogos2}}
            }}
        ])
        //console.log("Ok")
    } catch (error) {
        console.log(error)
    }
}

const setPontuacao = asyncHandler(async (req, res) => {

    let competicaoId = req.params.id
    const gamesTodos = await Game.find({competicao: competicaoId})
    const palpitesTodos = await Palpite.find({competicao: competicaoId})
    const instancias = await Ranking.find({competicao: competicaoId})

    instancias.forEach(i => {
        let pontuacao = 0;
        let cravadas = 0;
        let jogos = 0;
        palpitesTodos.forEach(p => {
            if(i.user.toString() === p.user.toString()) {
                gamesTodos.forEach(g => {
                    if(g._id.toString() === p.jogo.toString()) {
                        if(g.placar1 !== '' && g.placar2 !== ''){
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
                    } 
                })
                
            }
            
        })   
        setPontuacaoUser(i.user, pontuacao, cravadas, competicaoId, jogos)
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

module.exports = {
    getRanking, setPontuacao, criarRanking
}