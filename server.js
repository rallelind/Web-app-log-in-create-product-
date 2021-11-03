//we use require to use express and save it as app
const express = require("express");
const app = express();

//we use our dependency ejs 
app.set("view-engine", "ejs")

//get method that grabs index.ejs and our localhost default will go to this page
app.get("/", (req, res) => {
    res.render("index.ejs")
})

//get method that grabs login.ejs 
app.get("/login", (req, res) => {
    res.render("login.ejs");
})

//get method that grabs register.ejs
app.get("/register", (req, res) => {
    res.render("register.ejs");
})

app.listen(3000)