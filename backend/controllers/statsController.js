const asyncHandler = require('express-async-handler')
const cron = require('node-cron')
const Ranking = require('../models/rankingModel')
const Stats = require('../models/statsModel')

const getStats = asyncHandler(async (req, res) => {

    const stats = await Stats.find({user: req?.user?.id})

    res.status(200).json(stats)

})

const setStats = asyncHandler(async (req, res) => {
    let user2 = req.body
    obj = {user: user2.user}

    const userStats = await Stats.create(obj)

    res.status(200).json(userStats)
})

async function setUpdate(userT, pontuacaoT, cravadasT, jogosT, rankingsT) {
    try {
        await Stats.bulkWrite( [
            { updateOne: {
                filter: { user: userT},
                update: { $set: {pontuacaoTotal: pontuacaoT, cravadasTotal: cravadasT, jogosTotal: jogosT, campsParticipou: rankingsT}}
            }}
        ])
    } catch (error) {
        console.log(error)
    }
}

const updateStats = asyncHandler(async (req, res) => {
    const rankings = await Ranking.find()
    const stats = await Stats.find()

    stats.forEach(s => {
        let pontuacaoT = 0;
        let cravadasT = 0;
        let jogosT = 0;
        let rankingsT = 0;
        rankings.forEach(r => {
            if(s.user.toString() === r.user.toString()) {
                pontuacaoT += r.pontuacao;
                cravadasT += r.cravadas;
                jogosT += r.jogos;
                rankingsT += 1;
            }  
            
        })
        setUpdate(s.user, pontuacaoT, cravadasT, jogosT, rankingsT)
    })
    

    //res.status(200).json(stats)
})

cron.schedule("*/15 * * * *", function () {
    const uptStats = updateStats();
}, {
    timezone: "America/Sao_Paulo"
})

module.exports = {
    getStats, setStats, updateStats
}