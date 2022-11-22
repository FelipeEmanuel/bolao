const moment = require('moment-timezone');

const getDate = () => {
    return moment.tz(Date.now(), "America/Sao_Paulo")
}

module.exports = {
    getDate
}