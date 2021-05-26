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
            max: 100,
            default: null
        },
        about: {
            type: String,
            min: 50,
            max: 3000,
            default: null
        },
        skill1: {
            title: {
                type: String,
                min: 2,
                max: 100,
                default: null
            },
            description: {
                type: String,
                min: 10,
                max: 300,
                default: null
            }
        },
        skill2: {
            title: {
                type: String,
                min: 2,
                max: 100,
                default: null
            },
            description: {
                type: String,
                min: 10,
                max: 300, 
                default: null
            }
        },
        skill3: {
            title: {
                type: String,
                min: 2,
                max: 100,
                default: null
            },
            description: {
                type: String,
                min: 10,
                max: 300,
                default: null
            }
        },
    },
    social: {
        facebook: {
            type: String,
            min: 3,
            max: 200,
            default: null
        },
        instagram: {
            type: String,
            min: 3,
            max: 200,
            default: null
        },
        linkedin: {
            type: String,
            min: 3,
            max: 200,
            default: null
        },
        twitter: {
            type: String,
            min: 3,
            max: 200,
            default: null
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
        max: 1000,
        default: null
    },
})

module.exports = mongoose.model('User', userSchema)