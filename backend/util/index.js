const getDate = () => {
    const agora = new Date().toLocaleString({timeZone: "America/Sao_Paulo"});
    const diaHora = agora.split(" ");
    const arrayData = diaHora[0].split("/");
    return `${arrayData[2]}-${arrayData[1]}-${arrayData[0]}T${diaHora[1]}.000Z`
}

module.exports = {
    getDate
}