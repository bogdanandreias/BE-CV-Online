const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        max: 100
    },
    lastName: {
        type: String,
        required: true,
        max: 100
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 200
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 200
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    cv: {
        occupation: {
            type: String,
            min: 3,
            max: 100
        },
        about: {
            type: String,
            min: 50,
            max: 3000
        },
        skill1: {
            title: {
                type: String,
                min: 2,
                max: 100
            },
            description: {
                type: String,
                min: 10,
                max: 300
            }
        },
        skill2: {
            title: {
                type: String,
                min: 2,
                max: 100
            },
            description: {
                type: String,
                min: 10,
                max: 300
            }
        },
        skill3: {
            title: {
                type: String,
                min: 2,
                max: 100
            },
            description: {
                type: String,
                min: 10,
                max: 300
            }
        },
    },
    social: {
        facebook: {
            type: String,
            min: 3,
            max: 200
        },
        instagram: {
            type: String,
            min: 3,
            max: 200
        },
        linkedin: {
            type: String,
            min: 3,
            max: 200
        },
        twitter: {
            type: String,
            min: 3,
            max: 200
        },
    },
    image: {
        type: String,
        required: true,
        min: 3,
        max: 1000,
        default: 'images/default.jpg'
    },
    pdf: {
        type: String,
        min: 3,
        max: 1000
    },
    test: []
})

module.exports = mongoose.model('User', userSchema)