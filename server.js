//we use require to use express and save it as app
const express = require("express");
const app = express();

const users = []

//we use our dependency ejs 
app.set("view-engine", "ejs")

//This tells the app that we want to take the forms and to be able to access them inside our req in our post method
app.use(express.urlencoded({ extended: false }))

//get method that grabs index.ejs and our localhost default will go to this page
app.get("/", (req, res) => {
    res.render("index.ejs")
})

//get method that grabs login.ejs 
app.get("/login", (req, res) => {
    res.render("login.ejs");
})

//create a POST method for /login
app.post("/login", (req,res) => {

})

//get method that grabs register.ejs
app.get("/register", (req, res) => {
    res.render("register.ejs");
})

//create a POST method for /register
app.post("/register", (req, res) => {

})


app.listen(3000)