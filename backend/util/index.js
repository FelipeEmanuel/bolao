const moment = require('moment-timezone');
const mongoose = require('mongoose')

const parseObjectId = (str) => {
    return mongoose.Types.ObjectId(str)
}

const getDate = () => {
    return moment.tz(Date.now(), "America/Sao_Paulo")
}

module.exports = {
    getDate, parseObjectId
}