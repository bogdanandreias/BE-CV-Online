const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const { connect } = require('./routes/auth')
// Import Routes
const authRoute = require('./routes/auth')
const postsRoute = require('./routes/posts')

dotenv.config()

// Connection 
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Db connected.')
)

// Middlewares
app.use(express.json())
// Route Middlewares
app.use('/api/user', authRoute)
app.use('/api/posts', postsRoute)

app.listen(3000, () => console.log('Server running.'))

app.get('/', (req, res) => {
    res.send("💩")
})
app.get('/api', (req, res) => {
    res.send("💩")
})