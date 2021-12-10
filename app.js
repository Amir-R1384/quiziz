if (process.env.NODE_ENV === 'development') require('dotenv').config()

const express = require('express')
const expressEjsLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/authRoutes')
const deashboardRoutes = require('./routes/dashboardRoutes')
const quizRoutes = require('./routes/quizRoutes')
const settingsRoutes = require('./routes/settingsRoutes')
const profileRoutes = require('./routes/profileRoutes')
const errorRoutes = require('./routes/errorRoutes')
const { checkUser } = require('./controllers/middlewears')

// App setup
const app = express()
app.set('view engine', 'ejs')
app.set('layout', 'layouts/mainLayout.ejs')
app.use(expressEjsLayouts)
app.use(express.static('./public'))
app.use(express.urlencoded({extended: true, limit: '1mb'}))
app.use(express.json({limit: '1mb'}))
app.use(cookieParser())

app.get('/', checkUser, (req, res) => res.render('index', {route:'/'}))
app.use(authRoutes)
app.use('/dashboard', deashboardRoutes)
app.use('/quiz', quizRoutes)
app.use('/settings', settingsRoutes)
app.use('/profile', profileRoutes)
app.use(errorRoutes)

// Database connection
const { DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env
mongoose.connect(`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@production.zedy7.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`)
    .then(() => {       
        app.listen(process.env.port || 3000, () => console.log('Listening for requests'))
    })