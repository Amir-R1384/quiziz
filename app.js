if (process.env.NODE_ENV === "development") require("dotenv").config()

const express = require("express")
const expressEjsLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")


// App setup
const app = express()
app.set("view engine", "ejs")
app.set("layout", "layouts/mainLayout.ejs")
app.use(expressEjsLayouts)
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))


app.get("/", (req, res) => res.render("index", {route:"/"}))

// Database connection
const { DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env
mongoose.connect(`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@production.zedy7.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`)
    .then(() => {       
        app.listen(process.env.port || 3000, () => console.log("Listening for requests"))
    })