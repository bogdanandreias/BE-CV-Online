const router = require('express').Router()
const User = require('../model/User')
const jwt = require('jsonwebtoken')
const {registerValidation, loginValidation} = require('../validation')
const bcrypt = require('bcryptjs')
const verify = require('./verifyToken')

router.put('/info', verify, async (req, res) => {
    // const user = await User.findById(req.user._id)
    // res.send(req.body.occupation)
    var cv = {
        occupation: req.body.occupation,
        about: req.body.about,
        skill1: {
            title: req.body.skill1 ? req.body.skill1.title : null,
            description:  req.body.skill1 ? req.body.skill1.description : null,
        },
        skill2: {
            title: req.body.skill2 ? req.body.skill2.title : null,
            description:  req.body.skill2 ? req.body.skill2.description : null,
        },
        skill3: {
            title: req.body.skill3 ? req.body.skill3.title : null,
            description:  req.body.skill3 ? req.body.skill3.description : null,
        },
    }
    var social = {
        facebook: req.body.social ? req.body.social.facebook : null,
        instagram: req.body.social ? req.body.social.instagram : null,
        twitter: req.body.social ? req.body.social.twitter : null,
        linkedin: req.body.social ? req.body.social.linkedin : null,
    }
    const updatedUser = await User.updateOne(
        { _id: req.user._id },
        { $set: 
            { 
                "cv":  cv,
                "social": social
            }
        }
    )
    res.send(updatedUser)
})

router.get('/info', verify, async (req, res) => {
    const user = await User.findById(req.user._id)
    res.send(user)
})

router.post('/register', async (req, res) => {
    
    // Validate
    const {error} = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // Check if user already exists
    const emailExist = await User.findOne({ email: req.body.email })
    if(emailExist) return res.status(400).send('Email already exists.')

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    // Create new user
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword,
    })
    try{
        const savedUser = await user.save()
        res.send({ user: user._id })
    }catch(err){
        res.status(400)
    }
})

router.post('/login', async (req, res) => {
    
    // Validate
    const {error} = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // Check if email exists
    const user = await User.findOne({ email: req.body.email })
    if(!user) return res.status(400).send('Email or password is wrong.')

    // Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('Email or password is wrong.')

    // Create token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)

})

module.exports = router