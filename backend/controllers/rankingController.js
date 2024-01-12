const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Game = require('../models/gameModel')

const getRanking = asyncHandler(async (req, res) => {
    const users = await User.aggregate( [
        {
            $match:{
                role: "user",
                palpitou: true
            }
        },
        {
            $lookup:
            {
                from: "palpites",
                localField: "_id",
                foreignField: "user",
                as: "palpites"
            }

        },
        { 
            $project : { 
                name: 1, 
                palpites : {
                    palpite1: 1, 
                    palpite2: 1,
                    jogo: 1  
                } 
            } 
        }
    ]);

    const games = await Game.find({placar1 : {$ne : ""}}, {placar2 : {$ne: ""}}).select('time1 time2 placar1 placar2');

    res.status(200).json({ games, users });

})

module.exports = {
    getRanking,
}