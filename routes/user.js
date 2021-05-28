const router = require('express').Router()
const User = require('../model/User')
const jwt = require('jsonwebtoken')
const {registerValidation, loginValidation} = require('../validation')
const bcrypt = require('bcryptjs')
const verify = require('./verifyToken')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
            cb(null, './uploads/image')
        } else if(file.mimetype === 'application/pdf') {
            cb(null, './uploads/pdf')
        }
    },
    filename: function(req, file, cb) {
        // cb(null, new Date().toISOString() + file.originalname)
        cb(null, Date.now() + file.originalname)
    } 
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
        cb(null, true)
    } else if(file.mimetype === 'application/pdf') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5 //maximum file size of 5mb
    },
    fileFilter: fileFilter
})

router.put('/info', upload.any(), verify, async (req, res) => {
    jsonCv = JSON.parse(req.body.cv)
    // console.log(jsonCv)
    jsonSocial = JSON.parse(req.body.social)
    // console.log(jsonSocial)
    // const user = await User.findById(req.user._id)
    // res.send(req.body.occupation)
    var firstName = req.body.firstName
    var lastName = req.body.lastName
    const foundImage = req.files.find(element => element.fieldname == 'image');
    // console.log(req.files)
    var image = foundImage ? foundImage.path.replace(/\\/g,'/') : "uploads/image/default.png"
    const foundPdf = req.files.find(element => element.fieldname == 'pdf');
    var pdf = foundPdf ? foundPdf.path.replace(/\\/g,'/') : null

    const updatedUser = await User.updateOne(
        { _id: req.user._id },
        { $set: 
            { 
                "lastName": lastName,
                "firstName": firstName,
                "cv":  jsonCv,
                "social": jsonSocial,
                "image": image,
                "pdf": pdf,
            }
        }
    )
    res.send(updatedUser)
})

router.get('/info', verify, async (req, res) => {
    const user = await User.findById(req.user._id)
    let newUser = {
        "_id": user._id,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email,
        "date": user.date,
        "image": user.image,
        "pdf": user.pdf,
        "cv": user.cv,
        "social": user.social,
        "image": user.image,
        "pdf": user.pdf,
    }
    res.send(newUser)
})

router.post('/register', async (req, res) => {
    
    // Validate
    const {error} = registerValidation(req.body)
    if(error) return res.status(200).send({auth: 'false', msg: error.details[0].message })

    // Check if user already exists
    const emailExist = await User.findOne({ email: req.body.email })
    if(emailExist) return res.status(200).send({auth: 'false', msg: 'Email exists' })

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
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
        res.header('auth-token', token).send({auth: 'true', token: token, msg: savedUser})
    }catch(err){
        res.status(200)
    }
})

router.post('/login', async (req, res) => {
    
    // Validate
    const {error} = loginValidation(req.body)
    if(error) return res.status(200).send(error.details[0].message)

    // Check if email exists
    const user = await User.findOne({ email: req.body.email })
    if(!user) return res.status(200).send({auth: 'false', msg: 'Email or password is wrong.' })

    // Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(200).send({auth: 'false', msg: 'Email or password is wrong.' })

    // Create token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send({auth: 'true', token: token})

})

module.exports = router