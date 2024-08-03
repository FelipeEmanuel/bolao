const asyncHandler = require('express-async-handler')
const cron = require('node-cron')
const { getDate } = require('../util')
const Game = require('../models/gameModel')
const Semanal = require('../models/semanalModel')
const Palpite = require('../models/palpiteModel')
const Conquista = require('../models/conquistasModel')
const Campeonato = require('../models/campeonatoModel')
const { getGamesPorCategoria } = require('./gameController')

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

    res.status(200).json('ok')
})

const setSemanais = asyncHandler(async (req, res) => {

  //const hoje = getDate();
  //const dataLimite = getDate().add(7, 'days');
  
  const gamesDisponiveis = await Game.find({ativo: true})

  gamesDisponiveis.forEach(g => {
    Game.bulkWrite([
        { updateOne: {
            filter: { _id: g._id},
            update: { $set: {semanal: true}}
        }}
    ])  
  })

  res.status(200).json('ok')
})

async function getSemanaisPorCategoria(categoria) {
    try {
      const semanais = await Semanal.aggregate([
        {
          $lookup: {
            from: 'campeonatos', // Nome da coleção de campeonatos
            localField: 'campeonato', // Campo na coleção Semanal que referencia Campeonato
            foreignField: '_id',
            as: 'campeonato',
          },
        },
        {
          $unwind: '$campeonato',
        },
        {
          $match: {
            'campeonato.categoria': categoria, // Filtra pela categoria do Campeonato
          },
        },
        {
          $project: {
            _id: 1,
            user: 1,
            campeonato: 1,
            pontuacao: 1,
            cravadas: 1,
            jogos: 1,
            // Adicione outros campos que você deseja retornar aqui, se necessário
          },
        },
      ]);
  
      return semanais;
    } catch (error) {
      console.error('Erro ao buscar semanais de futebol:', error);
      throw error;
    }
  }

async function getPalpitesPorCategoria(categoria) {
    try {
      const palpitesDeFutebol = await Palpite.aggregate([
        {
          $lookup: {
            from: 'games',
            localField: 'jogo',
            foreignField: '_id',
            as: 'jogo',
          },
        },
        {
          $unwind: '$jogo',
        },
        {
          $lookup: {
            from: 'competicaos',
            localField: 'jogo.competicao',
            foreignField: '_id',
            as: 'competicao',
          },
        },
        {
          $unwind: '$competicao',
        },
        {
          $lookup: {
            from: 'campeonatos',
            localField: 'competicao.campeonato',
            foreignField: '_id',
            as: 'campeonato',
          },
        },
        {
          $unwind: '$campeonato',
        },
        {
          $match: {
            'campeonato.categoria': categoria,
          },
        },
        {
          $project: {
            user: 1,
            palpite1: 1,
            palpite2: 1,
            'jogo._id': 1,
            'jogo.time1': 1,
            'jogo.time2': 1,
            'jogo.placar1': 1,
            'jogo.placar2': 1,
            'competicao.name': 1,
            'competicao.ano': 1,
          },
        },
      ]);
  
      return palpitesDeFutebol;
    } catch (error) {
      console.error('Erro ao buscar palpites de futebol:', error);
      throw error;
    }
  }

async function setPontuacaoUser(user, pontuacao, cravadas, jogos, campeonato) {
    try {
        await Semanal.bulkWrite( [
            { updateOne: {
                filter: { user: user, campeonato: campeonato},
                update: { $set: {pontuacao: pontuacao, cravadas: cravadas, jogos: jogos}}
            }}
        ])
    } catch (error) {
        console.log(error)
    }
}

const pontuacaoSemana = asyncHandler(async (req, res) => {

    const gamesFutebol = await getGamesPorCategoria('Futebol', true, true);
    const palpitesFutebol = await getPalpitesPorCategoria('Futebol');
    const semanaisFutebol = await getSemanaisPorCategoria('Futebol');

    const gamesEsports = await getGamesPorCategoria('Esports', true, true);
    const palpitesEsports = await getPalpitesPorCategoria('Esports');
    const semanaisEsports = await getSemanaisPorCategoria('Esports');

    console.log(gamesFutebol)

    await semanaisFutebol.forEach(s => {
        let pontuacao = 0;
        let cravadas = 0;
        let jogos = 0;
        palpitesFutebol.forEach(p => {
            if(s.user.toString() === p.user.toString()) {
                gamesFutebol.forEach(g => {
                    if(g._id.toString() === p.jogo._id.toString()) {
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
        setPontuacaoUser(s.user, pontuacao, cravadas, jogos, s.campeonato._id)   
    })

    await semanaisEsports.forEach(s => {
        let pontuacao2 = 0;
        let cravadas2 = 0;
        let jogos2 = 0;
        palpitesEsports.forEach(p => {
            if(s.user.toString() === p.user.toString()) {
                gamesEsports.forEach(g => {
                    if(g._id.toString() === p.jogo._id.toString()) {
                        if(g.modelo === 1) {
                            if(p.palpite1 === g.placar1 && p.palpite2 === g.placar2) {
                              pontuacao2 += 3;
                              jogos2 += 1;
                            } else {
                              pontuacao2 += 0;
                              jogos2 += 1;
                            }
                          } 
                          else if(g.modelo === 3) {
                            if (p.palpite1 === g.placar1 && p.palpite2 === g.placar2) {
                              if (g.gameType === 2) {
                                pontuacao2 += 10;
                                cravadas2 += 1;
                                jogos2 += 1;
                              } else {
                                pontuacao2 += 5;
                                cravadas2 += 1;
                                jogos2 += 1;
                              }
                            } else if ((p.palpite1 === g.placar1 && p.palpite2 !== g.placar2) || (p.palpite1 !== g.placar1 && p.palpite2 === g.placar2)) {
                              if(g.gameType === 2) {
                                pontuacao2 += 6;
                                jogos2 += 1;
                              } else {
                                pontuacao2 += 3;
                                jogos2 += 1;
                              }
                            } else {
                              pontuacao2 += 0;
                              jogos2 += 1;
                            } 
                          } else if(g.modelo === 5) {
                            if (p.palpite1 === g.placar1 && p.palpite2 === g.placar2) {
                              if (g.gameType === 2) {
                                pontuacao2 += 10;
                                cravadas2 += 1;
                                jogos2 += 1;
                              } else {
                                pontuacao2 += 5;
                                cravadas2 += 1;
                                jogos2 += 1;
                              }
                            } else if ((p.palpite1 === g.placar1 && p.palpite2 !== g.placar2) || (p.palpite1 !== g.placar1 && p.palpite2 === g.placar2)) {
                              if(g.gameType === 2) {
                                pontuacao2 += 6;
                                jogos2 += 1;
                              } else {
                                pontuacao2 += 3;
                                jogos2 += 1;
                              }
                            } else {
                              pontuacao2 += 0;
                              jogos2 += 1;
                            }
                          }
                    } 
                })
                
            }
            
        })
        setPontuacaoUser(s.user, pontuacao2, cravadas2, jogos2, s.campeonato._id)   
    })

    res.status(200).json({semanaisFutebol, semanaisEsports});
});

const encerrarSemana = asyncHandler(async (req, res) => {
    
    const rankingCheck = await Semanal.find()
      .populate({
        path: "campeonato",
        match: { categoria: "Futebol" }, // Filtra apenas campeonatos com categoria "Futebol"
      })
      .populate("user", "name imgPerfil")
      .sort({ pontuacao: -1, cravadas: -1, jogos: 1 });

    const rankingFutebol = rankingCheck.filter(semanal => semanal.campeonato !== null)

    const rankingCheck2 = await Semanal.find()
      .populate({
        path: "campeonato",
        match: { categoria: "Esports"},
      })
      .populate("user", "name imgPerfil")
      .sort({ pontuacao: -1, cravadas: -1, jogos: 1})

    const rankingEsports = rankingCheck2.filter(semanal => semanal.campeonato !== null)

    const semanalFutebol = await Campeonato.findOne({name: 'Semanal', categoria: 'Futebol'})
    const semanalEsports = await Campeonato.findOne({name: 'Semanal', categoria: 'Esports'})

    const todosJogos = await Game.find({semanal: true, ativo: true})
    const dadosSemana = await Semanal.find()

    if(semanalFutebol) {
        if(rankingFutebol[0]) {
            if(rankingFutebol[0].pontuacao !== 0) {
                let conquista = await Conquista.findOne({user: rankingFutebol[0].user._id, campeonato: semanalFutebol._id})
                if(conquista) {
                    let up = conquista.primeiro + 1;
                    await Conquista.bulkWrite([
                        { updateOne: {
                            filter: { user: rankingFutebol[0].user._id, campeonato: semanalFutebol._id},
                            update: { $set: {primeiro: up}}
                        }}
                    ])
                } else {
                    let up = 1;
                    let primeiro = {user: rankingFutebol[0].user._id, campeonato: semanalFutebol._id, primeiro: up}
                    await Conquista.create(primeiro)
                }
            }
            
        }
    
        if(rankingFutebol[1]) {
            if(rankingFutebol[1].pontuacao !== 0) {
                let conquista = await Conquista.findOne({user: rankingFutebol[1].user._id, campeonato: semanalFutebol._id})
                if(conquista) {
                    let up = conquista.segundo + 1;
                    await Conquista.bulkWrite([
                        { updateOne: {
                            filter: { user: rankingFutebol[1].user._id, campeonato: semanalFutebol._id},
                            update: { $set: {segundo: up}}
                        }}
                    ])
                } else {
                    let up = 1;
                    let segundo = {user: rankingFutebol[1].user._id, campeonato: semanalFutebol._id, segundo: up}
                    await Conquista.create(segundo)
                }
            }
        }
    
        if(rankingFutebol[2]) {
            if(rankingFutebol[2].pontuacao !== 0) {
                let conquista = await Conquista.findOne({user: rankingFutebol[2].user._id, campeonato: semanalFutebol._id})
                if(conquista) {
                    let up = conquista.terceiro + 1;
                    await Conquista.bulkWrite( [
                        { updateOne: {
                            filter: { user: rankingFutebol[2].user._id, campeonato: semanalFutebol._id},
                            update: { $set: {terceiro: up}}
                        }}
                    ])
                } else {
                    let up = 1;
                    let terceiro = {user: rankingFutebol[2].user._id, campeonato: semanalFutebol._id, terceiro: up}
                    await Conquista.create(terceiro)
                }
            }
        }
    }

    if(semanalEsports) {
      if(rankingEsports[0]) {
        if(rankingEsports[0].pontuacao !== 0) {
            let conquista = await Conquista.findOne({user: rankingEsports[0].user._id, campeonato: semanalEsports._id})
            if(conquista) {
                let up = conquista.primeiro + 1;
                await Conquista.bulkWrite([
                    { updateOne: {
                        filter: { user: rankingEsports[0].user._id, campeonato: semanalEsports._id},
                        update: { $set: {primeiro: up}}
                    }}
                ])
            } else {
                let up = 1;
                let primeiro = {user: rankingEsports[0].user._id, campeonato: semanalEsports._id, primeiro: up}
                await Conquista.create(primeiro)
            }
        }
        
      }

      if(rankingEsports[1]) {
        if(rankingEsports[1].pontuacao !== 0) {
            let conquista = await Conquista.findOne({user: rankingEsports[1].user._id, campeonato: semanalEsports._id})
            if(conquista) {
                let up = conquista.segundo + 1;
                await Conquista.bulkWrite([
                    { updateOne: {
                        filter: { user: rankingEsports[1].user._id, campeonato: semanalEsports._id},
                        update: { $set: {segundo: up}}
                    }}
                ])
            } else {
                let up = 1;
                let segundo = {user: rankingEsports[1].user._id, campeonato: semanalEsports._id, segundo: up}
                await Conquista.create(segundo)
            }
        }
      }

      if(rankingEsports[2]) {
        if(rankingEsports[2].pontuacao !== 0) {
            let conquista = await Conquista.findOne({user: rankingEsports[2].user._id, campeonato: semanalEsports._id})
            if(conquista) {
                let up = conquista.terceiro + 1;
                await Conquista.bulkWrite( [
                    { updateOne: {
                        filter: { user: rankingEsports[2].user._id, campeonato: semanalEsports._id},
                        update: { $set: {terceiro: up}}
                    }}
                ])
            } else {
                let up = 1;
                let terceiro = {user: rankingEsports[2].user._id, campeonato: semanalEsports._id, terceiro: up}
                await Conquista.create(terceiro)
            }
        }
      }      
    }

    todosJogos.forEach(g => {
        if(g.semanal == true) {
            Game.bulkWrite([
                { updateOne: {
                    filter: { _id: g._id},
                    update: { $set: {ativo: false, semanal: false}}
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

    res.status(200).json('ok')
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

/*cron.schedule("00 05 * * 1", function () {
    const encerrar = encerrarSemana();
}, {
    timezone: "America/Sao_Paulo"
})*/

/*cron.schedule("00 00 * * 1", function () {
    const set = setJogos();
}, {
    timezone: "America/Sao_Paulo"
})*/

/*cron.schedule("00 06 * * 1", function () {
  const semana = setSemanais();
}, {
  timezone: "America/Sao_Paulo"
})*/

//cron.schedule("*/15 * * * *", function () {
//    const pont = pontuacaoSemana();
//}, {
//    timezone: "America/Sao_Paulo"
//})

module.exports = {
    setJogos, pontuacaoSemana, encerrarSemana, criarSemanal, criarConquistaSemanal, setSemanais
}
