const express = require('express')
const router = express.Router()
const {getCompeticao, setCompeticoes, updateCompeticao, deleteCompeticao, getCompeticaoById} = require('../controllers/CompeticaoController')
const { protect, isAdmin } = require('../middleware/authMiddleware')

router.route('/').get(protect, isAdmin, getCompeticao).post(protect, isAdmin, setCompeticoes)
router.route('/:id').delete(protect, isAdmin, deleteCompeticao).put(protect, isAdmin, updateCompeticao).get(protect, isAdmin, getCompeticaoById)
 
module.exports = router