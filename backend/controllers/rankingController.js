const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const getRanking = asyncHandler(async (req, res) => {
    const users = await User.find({role: "user"}).sort({pontuacao: -1})

    res.status(200).json(users)
})

module.exports = {
    getRanking
}