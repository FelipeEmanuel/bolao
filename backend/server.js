const path = require('path');
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const port = process.env.REACT_APP_PORT || 80;
const cors = require('cors')

connectDB()

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())

app.use('/api/games', require('./routes/gameRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/palpites', require('./routes/palpiteRoutes'))
app.use('/api/ranking', require('./routes/rankingRoutes'))
app.use('/api/competicoes', require('./routes/competicaoRoutes'))
app.use('/api/campeonatos', require('./routes/campeonatoRoutes'))
app.use('/api/conquistas', require('./routes/conquistasRoutes'))
app.use('/api/semanal', require('./routes/semanalRoutes'))

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`));