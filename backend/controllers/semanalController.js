const asyncHandler = require('express-async-handler')
const cron = require('node-cron')
const { getDate } = require('../util')
const Game = require('../models/gameModel')
const Semanal = require('../models/semanalModel')
const Palpite = require('../models/palpiteModel')
const Conquista = require('../models/conquistasModel')
const Campeonato = require('../models/campeonatoModel')

const setJogos = asyncHandler(async (req, res) => {

    const hoje = getDate();
    const dataLimite = getDate().add(7, 'days');
    
    const gamesDisponiveis = await Game.find({dataLimite: {$gte: hoje, $lte: dataLimite}})

    gamesDisponiveis.forEach(g => {
        if(g.ativo == false) {
            Game.bulkWrite([
                { updateOne: {
                    filter: { _id: g._id},
                    update: { $set: {ativo: true}}
                }}
            ])
        }
    })

    //res.status(200).json(gamesDisponiveis)
})

async function setPontuacaoUser(user, pontuacao, cravadas, jogos) {
    
    try {
        let usuario = user
        let pontuacao2 = pontuacao;
        let cravadas2 = cravadas;
        let jogos2 = jogos;
        
        await Semanal.bulkWrite( [
            { updateOne: {
                filter: { user: usuario},
                update: { $set: {pontuacao: pontuacao2, cravadas: cravadas2, jogos: jogos2}}
            }}
        ])
    } catch (error) {
        console.log(error)
    }
}

const pontuacaoSemana = asyncHandler(async (req, res) => {
    const gamesTodos = await Game.find({ativo: true})
    const palpitesTodos = await Palpite.find()
    const semanal = await Semanal.find()
    
    semanal.forEach(s => {
        let pontuacao = 0;
        let cravadas = 0;
        let jogos = 0;
        palpitesTodos.forEach(p => {
            if(s.user.toString() === p.user.toString()) {
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
        setPontuacaoUser(s.user, pontuacao, cravadas, jogos)   
    })

    //res.status(200).json(semanal);
})

const encerrarSemana = asyncHandler(async (req, res) => {
    
    const ranking = await Semanal.find().populate("user", "name imgPerfil").sort({pontuacao: -1, cravadas: -1})
    const semanal = await Campeonato.find({name: 'Semanal'})
    const todosJogos = await Game.find()
    const dadosSemana = await Semanal.find()

    if(semanal) {
        if(ranking[0]) {
            let conquista = await Conquista.findOne({user: ranking[0].user._id, campeonato: semanal[0]._id})
            if(conquista) {
                let up = conquista.primeiro + 1;
                await Conquista.bulkWrite([
                    { updateOne: {
                        filter: { user: ranking[0].user._id, campeonato: semanal[0]._id},
                        update: { $set: {primeiro: up}}
                    }}
                ])
            } else {
                let up = 1;
                let primeiro = {user: ranking[0].user._id, campeonato: semanal[0]._id, primeiro: up}
                await Conquista.create(primeiro)
            }
            
        }
    
        if(ranking[1]) {
            let conquista = await Conquista.findOne({user: ranking[1].user._id, campeonato: semanal[0]._id})
            if(conquista) {
                let up = conquista.segundo + 1;
                await Conquista.bulkWrite([
                    { updateOne: {
                        filter: { user: ranking[1].user._id, campeonato: semanal[0]._id},
                        update: { $set: {segundo: up}}
                    }}
                ])
            } else {
                let up = 1;
                let segundo = {user: ranking[1].user._id, campeonato: semanal[0]._id, segundo: up}
                await Conquista.create(segundo)
            }
        }
    
        if(ranking[2]) {
            let conquista = await Conquista.findOne({user: ranking[2].user._id, campeonato: semanal[0]._id})
            if(conquista) {
                let up = conquista.terceiro + 1;
                await Conquista.bulkWrite( [
                    { updateOne: {
                        filter: { user: ranking[2].user._id, campeonato: semanal[0]._id},
                        update: { $set: {terceiro: up}}
                    }}
                ])
            } else {
                let up = 1;
                let terceiro = {user: ranking[2].user._id, campeonato: semanal[0]._id, terceiro: up}
                await Conquista.create(terceiro)
            }
        }
    }

    todosJogos.forEach(g => {
        if(g.ativo == true) {
            Game.bulkWrite([
                { updateOne: {
                    filter: { _id: g._id},
                    update: { $set: {ativo: false}}
                }}
            ])
        }
    })
    
    dadosSemana.forEach(d => {
        Semanal.bulkWrite( [
            { updateOne: {
                filter: { _id: d._id},
                update: { $set: {pontuacao: 0, cravadas: 0, jogos: 0}}
            }}
        ])
    })

    //res.status(200).json('ok')
})

const criarSemanal = asyncHandler(async (req, res) => {

    let pontuacao = 0
    let cravadas = 0
    let jogos = 0
    let userId = req.params.id
    const semanal = await Campeonato.findOne({name: 'Semanal'})

    obj = {user: userId, campeonato: semanal._id, pontuacao: pontuacao, cravadas: cravadas, jogos: jogos}
    const ranking = await Semanal.create(obj)


    res.status(200).json(ranking);

})

const criarConquistaSemanal = asyncHandler(async (req, res) => {
    info = req.body
    const semanal = await Campeonato.findOne({name: 'Semanal'})
    
    const primeiro = {user: info.user, campeonato: semanal._id, primeiro: info.primeiro, segundo: info.segundo, terceiro: info.terceiro}
    const instancia = await Conquista.create(primeiro)

    res.status(200).json(instancia)
})

cron.schedule("00 05 * * 1", function () {
    const encerrar = encerrarSemana();
}, {
    timezone: "America/Sao_Paulo"
})

cron.schedule("00 06 * * 1", function () {
    const set = setJogos();
}, {
    timezone: "America/Sao_Paulo"
})

cron.schedule("*/30 * * * *", function () {
    const pont = pontuacaoSemana();
}, {
    timezone: "America/Sao_Paulo"
})

module.exports = {
    setJogos, pontuacaoSemana, encerrarSemana, criarSemanal, criarConquistaSemanal
}
