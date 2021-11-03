if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

//we use require to use express and save it as app
const express = require("express");
const app = express();
const bcrypt = require("bcrypt"); //we want to use bcrypt library to hash our users passwords to make them safe
const passport = require("passport"); //we want to use passport in order to allow user and password authentication
const flash = require("express-flash")
const session = require("express-session")

const initializePassport = require("./passport-config"); //we configure passport in seperate file to make code seperated and readible
initializePassport(
    passport, 
    email => users.find(user => user.email === email)
); //we call our function with the passport variable that requires passport


const users = [] //As we are not storing our data on a database we instead store them in this local variable

app.set("view-engine", "ejs") //we use our dependency ejs 
app.use(express.urlencoded({ extended: false })) //This tells the app that we want to take the forms and to be able to access them inside our req in our post method
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

//get method that grabs index.ejs and our localhost default will go to this page
app.get("/", (req, res) => {
    res.render("index.ejs")
})

//get method that grabs login.ejs 
app.get("/login", (req, res) => {
    res.render("login.ejs");
})

//create a POST method for /login
app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))

//get method that grabs register.ejs
app.get("/register", (req, res) => {
    res.render("register.ejs");
})

//creating a POST method for /register with and async function
app.post("/register", async (req, res) => {
/*we create a try, catch block to make sure the data is correct
thereafter we push the data we want into our users array. If this was successfull we will redirect to /login.
This functionality makes the user able to login as we now have saved the users data in our users array*/
    try { 
//we create a hashedPassword variable and give at a value of 10 as it is a standard default value that makes the hashing quick and secure
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect("/login")
//in the catch block we redirect back to register in case of an failure
    }catch{
        res.redirect("/register")
    }
})


app.listen(3000)