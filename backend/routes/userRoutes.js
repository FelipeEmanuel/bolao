const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getMe,
  changePassword,
  forgotPassword
} = require('../controllers/userController')
const { protect, isAdmin } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.put('/:id', changePassword)
router.post('/novasenha', forgotPassword)

module.exports = router