if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const flash = require("express-flash")
const session = require("express-session")
const express = require("express");
const app = express();
const passport = require("passport");
const methodOverride = require("method-override")
const userRoutes = require("./api/routes/userRoutes")
const productRoutes = require("./api/routes/productRoutes")
const { render } = require("ejs");

app.set("view-engine", "ejs")
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method"))
app.use(express.static(__dirname + "/views/public"));
app.use("/", userRoutes)
app.use("/", productRoutes)

module.exports = app