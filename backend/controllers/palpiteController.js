const asyncHandler = require("express-async-handler");
const ObjectId = require('mongoose').Types.ObjectId; 
const Game = require("../models/gameModel");
const Palpite = require("../models/palpiteModel");
const User = require("../models/userModel");
const Ranking = require("../models/rankingModel");
const Campeonato = require("../models/campeonatoModel");
const Conquista = require("../models/conquistasModel");
const { getDate, parseObjectId } = require("../util/index");
const Competicao = require("../models/competicaoModel");
const Semanal = require("../models/semanalModel");
const { getGamesPorCategoria } = require("./gameController");

const setPalpite = asyncHandler(async (req, res) => {
    let palpite = req.body;
    let user = req.user.id;
    const getUser = true;
    let userInfo = await User.findOne({_id: user})

    if (!palpite) {
        res.status(400);
        throw new Error('Please add all text fields');
    }

    const jogoDisponivel = getDate().utc().toDate(); // Certifica-se de que a data está em UTC
    let palpiteEncontrado = await Palpite.findOne({ jogo: palpite.jogo_id, user: user });
    let ranking = await Ranking.findOne({ user: user, competicao: palpite.competicao });

    // Busca o jogo e o campeonato associado
    let jogoAtual = await Game.findById(palpite.jogo_id).populate({
        path: 'competicao',
        populate: {
            path: 'campeonato'
        }
    });

    if (!jogoAtual) {
        res.status(404);
        throw new Error('Jogo não encontrado');
    }

    let campeonatoCategoria = jogoAtual.competicao.campeonato.categoria;

    // Busca o campeonato semanal de acordo com a categoria
    let semanal = await Campeonato.findOne({ name: 'Semanal', categoria: campeonatoCategoria });
    if (!semanal) {
        res.status(404);
        throw new Error('Campeonato Semanal não encontrado');
    }

    let semanal2 = await Semanal.findOne({ user: user, campeonato: semanal._id });
    let semanalCreate = { user: user, campeonato: semanal._id };
    let obj = { user: user, jogo: palpite.jogo_id, competicao: palpite.competicao, palpite1: palpite.palpite1, palpite2: palpite.palpite2 };
    let instancia = { user: user, competicao: palpite.competicao };
    
    
    // Verifica se o jogo está dentro do prazo para palpitar
    if (jogoAtual.dataLimite < jogoDisponivel) {
        res.status(400);
        throw new Error('Já passou da hora de palpitar nesse aqui parça');
    }
    
    if (palpiteEncontrado) {
        // Atualiza o palpite existente
        await Palpite.findByIdAndUpdate(palpiteEncontrado._id, obj);
    } else {
        // Cria um novo palpite se não houver palpite existente
        await Palpite.create(obj);
        // Cria o ranking se ainda não existir
        if (!ranking && userInfo.role === 'user') {
            
            await Ranking.create(instancia);
        }
    }
    
    // Verifica e cria o registro semanal se necessário
    if (!semanal2 && userInfo.role === 'user') {
        await Semanal.create(semanalCreate);
    }
    
    // Atualiza o status do usuário
    await User.findByIdAndUpdate(user, { palpitou: getUser })

    res.status(200).json(obj);

});

const getPalpitesFutebol = asyncHandler(async (req, res) => {

    const userId = req.user.id;
    const userObjectId = new ObjectId(userId);
    const hoje = getDate().utc().toDate();
    const dataLimite = getDate().add(7, "days").utc().toDate();

    const gamesDisponiveisFutebol = await getGamesPorCategoria("Futebol", true, null, hoje, dataLimite);
    const gamesAtivosFutebol = await getGamesPorCategoria("Futebol", true);
    const userPalpitesFutebol = await getUserPalpitesPorCategoria(userObjectId, "Futebol", true);

    res.status(200).json({gamesDisponiveisFutebol, gamesAtivosFutebol, userPalpitesFutebol});

});

const getPalpitesEsports = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const userObjectId = new ObjectId(userId);
    const hoje = getDate().utc().toDate();
    const dataLimite = getDate().add(7, "days").utc().toDate();

    const gamesDisponiveisEsports = await getGamesPorCategoria("Esports", true, null, hoje, dataLimite);
    const gamesAtivosEsports = await getGamesPorCategoria("Esports", true);
    const userPalpitesEsports = await getUserPalpitesPorCategoria(userObjectId, "Esports", true);

    res.status(200).json({gamesDisponiveisEsports, gamesAtivosEsports, userPalpitesEsports})
})

const userPalpitesById = asyncHandler(async (req, res) => {
  const user = req.params.id;

  const palpites = await Palpite.find({ user: user }).populate(
    "jogo",
    "time1 time2"
  );

  res.status(200).json(palpites);
});

const getUserPalpitesPorCategoria = async(userObjectId, categoria, ativo) => {
    return await Palpite.aggregate([
        {
            $match: {
              user: userObjectId
            }
          },
          {
            $lookup: {
              from: 'competicaos', // Nome da coleção de competições
              localField: 'competicao',
              foreignField: '_id',
              as: 'competicao'
            }
          },
          {
            $unwind: {
              path: '$competicao',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'campeonatos', // Nome da coleção de campeonatos
              localField: 'competicao.campeonato',
              foreignField: '_id',
              as: 'competicao.campeonato'
            }
          },
          {
            $unwind: {
              path: '$competicao.campeonato',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'games', // Nome da coleção de jogos
              localField: 'jogo',
              foreignField: '_id',
              as: 'jogo'
            }
          },
          {
            $unwind: {
              path: '$jogo',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $match: {
              'competicao.campeonato.categoria': categoria,
              'jogo.ativo': ativo
            }
          },
          {
            $project: {
              _id: 1,
              user: 1,
              jogo: 1,
              palpite1: 1,
              palpite2: 1
            }
          }
        ]);
}

module.exports = {
  setPalpite,
  getPalpitesFutebol,
  getPalpitesEsports,
  userPalpitesById,
};
