const express = require('express')
const router = express.Router()
const { protect, isAdmin } = require('../middleware/authMiddleware')
const { setJogos, encerrarSemana, pontuacaoSemana, criarSemanal, criarConquistaSemanal } = require('../controllers/semanalController')

router.route('/setJogos').post(protect, isAdmin, setJogos)
router.route('/encerrar').put(protect, isAdmin, encerrarSemana)
router.route('/setPontuacao').put(protect, isAdmin, pontuacaoSemana)
router.route('/:id').post(protect, isAdmin, criarSemanal)
router.route('/').post(protect, isAdmin, criarConquistaSemanal)

module.exports = router