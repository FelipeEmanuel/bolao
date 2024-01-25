const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Game = require('../models/gameModel')
const Palpite = require('../models/palpiteModel')
const Ranking = require('../models/rankingModel')

const getRanking = asyncHandler(async (req, res) => {

    let competicaoId = req.params.id
    const ranking = await Ranking.find({competicao: competicaoId}).populate("user", "name imgPerfil").sort({pontuacao: -1, cravadas: -1})

    //const games = await Game.find({placar1 : {$ne : ""}}, {placar2 : {$ne: ""}}).select('time1 time2 placar1 placar2');

    res.status(200).json(ranking);

})

async function setPontuacaoUser(user, pontuacao, cravadas, competicao) {
    
    try {
        let usuario = user
        let pontuacao2 = pontuacao;
        let cravadas2 = cravadas;
        let competicaoId = competicao;
        console.log(usuario, pontuacao2, cravadas2, competicaoId)
        await Ranking.bulkWrite( [
            { updateOne: {
                filter: { user: usuario, competicao: competicaoId},
                update: { $set: {pontuacao: pontuacao2, cravadas: cravadas2}}
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
        palpitesTodos.forEach(p => {
            if(i.user.toString() === p.user.toString()) {
                gamesTodos.forEach(g => {
                    if(g._id.toString() === p.jogo.toString()) {
                        if(g.placar1 === p.palpite1 && g.placar2 === p.palpite2) {
                            if(g.gameType === 2) {
                                pontuacao += 10;
                                cravadas += 1;
                            } else {
                                pontuacao += 5;
                                cravadas += 1;
                            }
                        } else if ((p.palpite1 > p.palpite2 && g.placar1 > g.placar2) ||
                        (p.palpite1 < p.palpite2 && g.placar1 < g.placar2)) {
                            if(g.gameType === 2) {
                                pontuacao += 6;
                            } else {
                                pontuacao += 3;
                            } 
                            if(p.palpite1 === g.placar1 || p.palpite2 === g.placar2) {
                                if(g.gameType === 2) {
                                    pontuacao += 2;
                                } else {
                                    pontuacao += 1;
                                }            
                            } 
                        } else if (p.palpite1 === p.palpite2 && g.placar1 === g.placar2) {
                            if(g.gameType === 2) {
                            pontuacao += 6;
                            } else {
                            pontuacao += 3; 
                            } 
                        } else if(p.palpite1 === g.placar1 || p.palpite2 === g.placar2) {
                            if(g.gameType === 2) {
                            pontuacao += 2;
                            } else {
                            pontuacao += 1;
                            }
                        } else {
                            pontuacao += 0;
                        }
                    } 
                })
                
            }
            
        })   
        setPontuacaoUser(i.user, pontuacao, cravadas, competicaoId)
    })

    

    res.status(200).json(instancias);
      
}) 

module.exports = {
    getRanking, setPontuacao
}