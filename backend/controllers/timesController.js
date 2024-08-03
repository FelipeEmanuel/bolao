const asyncHandler = require('express-async-handler')
const Times = require('../models/timesModel')

const getTimes = asyncHandler(async(req, res) => {
    const ativosFutebol = await Times.find({categoria: "Futebol", ativo: true})
    const inativosFutebol = await Times.find({categoria: "Futebol", ativo: false})
    const ativosEsports = await Times.find({categoria: "Esports", ativo: true})
    const inativosEsports = await Times.find({categoria: "Esports", ativo: false})

    res.status(200).json({ativosFutebol, inativosFutebol, ativosEsports, inativosEsports})
})

const updateTime = asyncHandler(async(req, res) => {
    try {
        const updatedTime = await Times.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
        res.status(200).json(updatedTime)

    } catch (error) {
        let obj = Object.keys(error.keyValue)
        if(obj[0] && obj[0] == 'nome') {
            res.status(400).json({code: 451, message:'Nome já cadastrado!'})
        } else {
            res.status(400).json({code: 453, message: 'Ocorreu um erro!'})
        }
    }
})

const getTimesFutebolAtivos = asyncHandler(async(req, res) => {

    const ativosFutebol = await Times.find({categoria: "Futebol", ativo: true})

    res.status(200).json(ativosFutebol)

})

const createTime = asyncHandler(async(req, res) => {

    const {nome, escudo, categoria} = req.body

    const time = await Times.findOne({nome: nome})

    if(!nome || !categoria) {
        res.status(400).json({code: 450, message: "Preencha todos os campos!"})
    } 
    if (time) {
        res.status(400).json({code: 451, message:'Nome já cadastrado!'})
    } else {
        await Times.create({
            nome, escudo, categoria
        })
        const ativosFutebol = await Times.find({categoria: "Futebol", ativo: true})
        const inativosFutebol = await Times.find({categoria: "Futebol", ativo: false})
        const ativosEsports = await Times.find({categoria: "Esports", ativo: true})
        const inativosEsports = await Times.find({categoria: "Esports", ativo: false})
        res.status(200).json({ativosFutebol, inativosFutebol, ativosEsports, inativosEsports})
    }

})

const deleteTime = asyncHandler(async (req, res) => {
    try {
        await Times.findByIdAndDelete(req.params.id)
        const ativosFutebol = await Times.find({categoria: "Futebol", ativo: true})
        const inativosFutebol = await Times.find({categoria: "Futebol", ativo: false})
        const ativosEsports = await Times.find({categoria: "Esports", ativo: true})
        const inativosEsports = await Times.find({categoria: "Esports", ativo: false})

        res.status(200).json({ativosFutebol, inativosFutebol, ativosEsports, inativosEsports})
    } catch (error) {
        res.status(400)
        throw new Error('Time not found')
    }
})

module.exports = {
    getTimes, createTime, updateTime, deleteTime
}