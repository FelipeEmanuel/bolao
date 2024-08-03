const asyncHandler = require('express-async-handler')
const Competicao = require('../models/competicaoModel')
const Game = require('../models/gameModel')
const Palpite = require('../models/palpiteModel')
const Ranking = require('../models/rankingModel')
const Conquista = require('../models/conquistasModel')
const Campeonato = require('../models/campeonatoModel')

const getCompeticoesPorCategoria = async (categoria, apenasAtivas = false) => {
    const match = {
      'campeonato.categoria': categoria
    };
  
    if (apenasAtivas) {
      match.ativa = true;
    }
  
    return await Competicao.aggregate([
      {
        $lookup: {
          from: 'campeonatos', // Nome da coleção de campeonatos
          localField: 'campeonato', // Campo na coleção Competicao
          foreignField: '_id', // Campo na coleção Campeonato
          as: 'campeonato'
        }
      },
      {
        $unwind: '$campeonato' // Deconstrói o array resultante de campeonatos
      },
      {
        $match: match // Aplica o filtro construído dinamicamente
      },
      {
        $project: {
          name: 1, // Inclua outros campos da coleção Competicao que você deseja retornar
          ano: 1,
          ativa: 1,
          img: 1,
          'campeonato.categoria': 1,
          'campeonato.cor': 1
        }
      }
    ]);
};

const getCompeticao = asyncHandler(async (req, res) => {
    const competicoesFutebol = await getCompeticoesPorCategoria('Futebol');

    const competicoesEsports = await getCompeticoesPorCategoria('Esports');

    const campeonatosFutebol = await Campeonato.find({categoria: 'Futebol'})

    const campeonatosEsports = await Campeonato.find({categoria: 'Esports'})

    res.status(200).json({competicoesFutebol, competicoesEsports, campeonatosFutebol, campeonatosEsports})
})

const getCompeticoesAtivas = asyncHandler(async (req, res) => {
    const competicoesFutebol = await getCompeticoesPorCategoria('Futebol', true);

    const competicoesEsports = await getCompeticoesPorCategoria('Esports', true);

    res.status(200).json({competicoesFutebol, competicoesEsports})
})

const getCompeticaoById = asyncHandler(async (req, res) => {
    const competicao = await Competicao.findById(req.params.id)

    if(!competicao) {
        res.status(400)
        throw new Error('competicao not found!')
    }

    res.status(200).json(competicao)

})

const setCompeticoes = asyncHandler(async (req, res) => {
    const {name, ano, campeonato, img, encerrado} = req.body

    if (!name || !ano || !campeonato) {
        res.status(400)
        throw new Error('Please add a text field!')
    }

    await Competicao.create({
        name, ano, campeonato, img, encerrado
    })

    const Competicoes = await Competicao.find()

    res.status(200).json(Competicoes)
})

const updateCompeticao = asyncHandler(async (req, res) => {
    const competicao = await Competicao.findById(req.params.id)

    if(!competicao) {
        res.status(400)
        throw new Error('competicao not found')
    }

    const updatedCompeticao = await Competicao.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })
    res.status(200).json(updatedCompeticao)
})

const deleteCompeticao = asyncHandler(async (req, res) => {

    try {
        await Palpite.deleteMany({ "competicao" : req.params.id})
    } catch (error) {
        res.status(400)
        throw new Error(error)
    }

    try {
        await Game.deleteMany({"competicao" : req.params.id}) 
    } catch (error) {
        res.status(400)
        throw new Error(error)
    }

    try {
        await Competicao.findByIdAndDelete(req.params.id)
        const Competicoes = await Competicao.find()
        res.status(200).json(Competicoes)
    } catch (error) {
        res.status(400)
        throw new Error(error)
    }
    
       
})

const encerrarCompeticao = asyncHandler(async (req, res) => {

    const competicaoId = req.params.id

    const competicao = await Competicao.findById(competicaoId)

    if(!competicao) {
        res.status(400)
        throw new Error('competicao not found')
    }

    if(competicao.ativa == true) {
        const ranking = await Ranking.find({competicao: competicaoId}).populate("user", "name imgPerfil").sort({pontuacao: -1, cravadas: -1})

        if(ranking[0]) {
            let conquista = await Conquista.findOne({user: ranking[0].user._id, campeonato: competicao.campeonato})
            if(conquista) {
                let up = conquista.primeiro + 1;
                await Conquista.bulkWrite([
                    { updateOne: {
                        filter: { user: ranking[0].user._id, campeonato: competicao.campeonato},
                        update: { $set: {primeiro: up}}
                    }}
                ])
                await Conquista.findOneAndUpdate(
                    {user: ranking[0].user._id, campeonato: competicao.campeonato},
                    {$push: {primeiroAnos: competicao.ano}}
                )
            } else {
                let up = 1;
                let primeiro = {user: ranking[0].user._id, campeonato: competicao.campeonato, primeiro: up, primeiroAnos: competicao.ano}
                await Conquista.create(primeiro)
            }
            
        }

        if(ranking[1]) {
            let conquista = await Conquista.findOne({user: ranking[1].user._id, campeonato: competicao.campeonato})
            if(conquista) {
                let up = conquista.segundo + 1;
                await Conquista.bulkWrite( [
                    { updateOne: {
                        filter: { user: ranking[1].user._id, campeonato: competicao.campeonato},
                        update: { $set: {segundo: up}}
                    }}
                ])
                await Conquista.findOneAndUpdate(
                    {user: ranking[1].user._id, campeonato: competicao.campeonato},
                    {$push: {segundoAnos: competicao.ano}}
                )
            } else {
                let up = 1;
                let segundo = {user: ranking[1].user._id, campeonato: competicao.campeonato, segundo: up, segundoAnos: competicao.ano}
                await Conquista.create(segundo)
            }
        }

        if(ranking[2]) {
            let conquista = await Conquista.findOne({user: ranking[2].user._id, campeonato: competicao.campeonato})
            if(conquista) {
                let up = conquista.terceiro + 1;
                await Conquista.bulkWrite( [
                    { updateOne: {
                        filter: { user: ranking[2].user._id, campeonato: competicao.campeonato},
                        update: { $set: {terceiro: up}}
                    }}
                ])
                await Conquista.findOneAndUpdate(
                    {user: ranking[2].user._id, campeonato: competicao.campeonato},
                    {$push: {terceiroAnos: competicao.ano}}
                )
            } else {
                let up = 1;
                let terceiro = {user: ranking[2].user._id, campeonato: competicao.campeonato, terceiro: up, terceiroAnos: competicao.ano}
                await Conquista.create(terceiro)
            }
        }

        await Competicao.findByIdAndUpdate(req.params.id, {ativa: false}, {
            new: true,
        })
    } else {
        res.status(400)
        throw new Error("Essa competição já foi finalizada!")
    }

    const Competicoes = await Competicao.find()

    res.status(200).json(Competicoes)
})



module.exports = {
    getCompeticao, getCompeticaoById, setCompeticoes, updateCompeticao, deleteCompeticao, encerrarCompeticao, getCompeticoesAtivas, getCompeticoesPorCategoria
}
