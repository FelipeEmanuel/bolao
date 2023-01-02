const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const nodemailer = require('nodemailer');

const registerUser = asyncHandler(async(req, res) => {
    const {name, email, password, role} = req.body

    if(!name || !email || !password) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})


const loginUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body
    // Check for user email
    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
    })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

const updateUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id)

    //Não achou o usuário
    if(!user) {
        res.status(400)
        throw new Error('User not found')
    }


    //Mudar senha
    if(req.body.password) {
        const newSenha = req.body.password
        if(!user) {
            res.status(400)
            throw new Error('User not found')
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newSenha, salt)

        const updatedUser = await User.findByIdAndUpdate(user._id, {password: hashedPassword}, {
            new: true,
        })

        console.log(updatedUser.password)
        res.status(200).json(updatedUser)
    } else {
        //Todo o resto
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
        res.status(200).json(updatedUser)
    }
    
})

const deleteUser = asyncHandler(async (req, res) => {

    User.findByIdAndDelete(req.params.id, function (err, docs) {
        if (err) {
            console.log(err)
            res.status(400)
            throw new Error('User not found')
        }
        else {
            console.log("Deleted : ", docs);
            res.status(200).json({id: req.params.id})
        }
    });
       
})

const getMe = asyncHandler(async(req, res) => {
    res.status(200).json(req.user)
})

const forgotPassword = asyncHandler(async (req, res) => {

    const {email} = req.body

    const user = await User.findOne({ email })
    
    if(!user) {
        res.status(400)
        throw new Error('Email não existe')
    }
    
    const client = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.SENHA
        }
    });

    const moment24hours = moment().add(24, 'hours').toDate().getTime()

    const salt = await bcrypt.genSalt(10)
    const hashResetSenha = await bcrypt.hash(user.email + moment24hours, salt)
    
    const link = `${process.env.BASE_URL}/resetarSenha/${hashResetSenha}` 

    client.sendMail(
        {
            from: "Bolaodacopa2022",
            to: user.email,
            subject: "Resetar Senha",
            html: `<h1>Link para você resetar sua senha</h1>
            <br/>
            <a href='${link}'>Resetar senha</a>`
        }
    )
    //client.verify().then(console.log).catch(console.error);
    res.status(200).json('ok')
})

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })
}

module.exports = {
    registerUser, loginUser, getMe, updateUser, deleteUser, forgotPassword
}