const express = require('express')
const router = express.Router()
const {getCampeonatos, setCampeonato} = require('../controllers/campeonatoController')
const { protect, isAdmin } = require('../middleware/authMiddleware')

router.route('/').get(protect, getCampeonatos).post(protect, isAdmin, setCampeonato)
//router.route('/:id').delete(protect, isAdmin, deleteCompeticao).put(protect, isAdmin, updateCompeticao).get(protect, isAdmin, getCompeticaoById)
 
module.exports = router