const asyncHandler = require('express-async-handler')
const Competicao = require('../models/CompeticaoModel')
const Game = require('../models/gameModel')
const Palpite = require('../models/palpiteModel')

const getCompeticao = asyncHandler(async (req, res) => {
    const Competicoes = await Competicao.find()

    res.status(200).json(Competicoes)
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
    const {name, sigla, encerrado} = req.body

    if (!name || !sigla) {
        res.status(400)
        throw new Error('Please add a text field!')
    }

    const competicao = await Competicao.create({
        name, sigla, encerrado
    })

    res.status(200).json(competicao)
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
        console.log(error);
    }

    try {
        await Game.deleteMany({"competicao" : req.params.id}) 
    } catch (error) {
        console.log(error);
    }

    await Competicao.findByIdAndDelete(req.params.id, function (err, docs) {
        if (err) {
            console.log(err)
            res.status(400)
            throw new Error('Competicao not found')
        }
        else {
            console.log("Deleted : ", docs);
            res.status(200).json({id: req.params.id})
        }
    });
       
})

module.exports = {
    getCompeticao, getCompeticaoById, setCompeticoes, updateCompeticao, deleteCompeticao
}